import type { HttpContext } from '@adonisjs/core/http'
import db from '@adonisjs/lucid/services/db'

type StudentPerformance = {
  studentId: number
  name: string
  email: string
  submittedCount: number
  missingCount: number
  averageScore: number | null
  status: string
}

type PerformanceReport = {
  courseId: number
  courseCode: string | null
  courseName: string | null
  studentCount: number
  assignmentCount: number
  submittedCount: number
  missingCount: number
  classAverage: number | null
  atRiskCount: number
  generatedAt: Date
  students: StudentPerformance[]
}

export default class PerformanceReportsController {
  public async index({ view, params, auth, response }: HttpContext) {
    const courseId = Number(params.courseId)
    const userId = auth.user!.id

    const canAccessReport = await this.canAccessCourseReport(userId, courseId)

    if (!canAccessReport) {
      return response.status(403).send('You are not authorized to view this performance report')
    }

    return view.render('pages/reports/performance', {
      courseId,
      report: null,
    })
  }

  public async generate({ view, params, auth, response }: HttpContext) {
    const courseId = Number(params.courseId)
    const userId = auth.user!.id

    const canAccessReport = await this.canAccessCourseReport(userId, courseId)

    if (!canAccessReport) {
      return response.status(403).send('You are not authorized to generate this performance report')
    }

    const report = await this.buildReport(courseId)

    if (!report) {
      return response.notFound('Course not found')
    }

    return view.render('pages/reports/performance', {
      courseId,
      report,
    })
  }
  private async canAccessCourseReport(userId: number, courseId: number): Promise<boolean> {
    const professorCourse = await db
      .from('professors')
      .join('courses', 'professors.professor_id', 'courses.professor_id')
      .where('professors.user_id', userId)
      .where('courses.course_id', courseId)
      .first()

    if (professorCourse) {
      return true
    }

    const admin = await db.from('admins').where('user_id', userId).first()

    return Boolean(admin)
  }
  private async buildReport(courseId: number): Promise<PerformanceReport | null> {
    const course = await db
      .from('courses')
      .where('course_id', courseId)
      .select('course_id', 'course_code', 'course_name')
      .first()

    if (!course) {
      return null
    }

    const assignments = await db
      .from('assignments')
      .where('course_id', courseId)
      .orderBy('assignment_id', 'asc')
      .select('assignment_id', 'title')

    const enrollments = await db
      .from('enrollments')
      .where('course_id', courseId)
      .select('student_id')

    const studentIds = enrollments.map((enrollment) => Number(enrollment.student_id))
    const assignmentIds = assignments.map((assignment) => Number(assignment.assignment_id))

    const students =
      studentIds.length > 0
        ? await db
            .from('students')
            .whereIn('student_id', studentIds)
            .select('student_id', 'first_name', 'last_name', 'email')
        : []

    const submissions =
      studentIds.length > 0 && assignmentIds.length > 0
        ? await db
            .from('submissions')
            .whereIn('student_id', studentIds)
            .whereIn('assignment_id', assignmentIds)
            .select('submission_id', 'assignment_id', 'student_id', 'status')
        : []

    const submissionIds = submissions.map((submission) => Number(submission.submission_id))

    const grades =
      submissionIds.length > 0
        ? await db
            .from('grades')
            .whereIn('submission_id', submissionIds)
            .select('submission_id', 'score')
        : []

    const gradesBySubmission = new Map<number, number>()

    for (const grade of grades) {
      const score = Number(grade.score)

      if (Number.isFinite(score)) {
        gradesBySubmission.set(Number(grade.submission_id), score)
      }
    }

    const studentReports = students.map((student) => {
      const studentSubmissions = submissions.filter(
        (submission) => Number(submission.student_id) === Number(student.student_id)
      )

      const studentScores = studentSubmissions
        .map((submission) => gradesBySubmission.get(Number(submission.submission_id)))
        .filter((score): score is number => score !== undefined)

      const averageScore =
        studentScores.length > 0
          ? Math.round(
              (studentScores.reduce((total, score) => total + score, 0) / studentScores.length) *
                100
            ) / 100
          : null

      const missingCount = Math.max(assignments.length - studentSubmissions.length, 0)

      let status = 'On track'

      if (missingCount > 0 || (averageScore !== null && averageScore < 60)) {
        status = 'Needs attention'
      }

      return {
        studentId: Number(student.student_id),
        name: `${student.first_name} ${student.last_name}`,
        email: student.email,
        submittedCount: studentSubmissions.length,
        missingCount,
        averageScore,
        status,
      }
    })

    const numericScores = Array.from(gradesBySubmission.values())

    const classAverage =
      numericScores.length > 0
        ? Math.round(
            (numericScores.reduce((total, score) => total + score, 0) / numericScores.length) * 100
          ) / 100
        : null

    return {
      courseId,
      courseCode: course.course_code,
      courseName: course.course_name,
      studentCount: students.length,
      assignmentCount: assignments.length,
      submittedCount: submissions.length,
      missingCount: Math.max(students.length * assignments.length - submissions.length, 0),
      classAverage,
      atRiskCount: studentReports.filter((student) => student.status === 'Needs attention').length,
      generatedAt: new Date(),
      students: studentReports,
    }
  }
}
