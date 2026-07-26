import { sessionUser } from '#services/role_service'
import { courseValidator } from '#validators/course'
import type { HttpContext } from '@adonisjs/core/http'
import db from '@adonisjs/lucid/services/db'

export default class CoursesController {
  async show(ctx: HttpContext) {
    const { params, response } = ctx
    const user = sessionUser(ctx)
    const courseId = Number(params.id)

    const courseRow = await db.from('courses').where('course_id', courseId).first()

    if (!courseRow) {
      return response.notFound('Course not found')
    }

    const hasAccess = await this.canAccessCourse(user.role, user.roleId, courseId, courseRow)

    if (!hasAccess) {
      return response.status(403).send('You do not have access to this course')
    }

    const course = {
      id: courseRow.course_id,
      code: courseRow.course_code,
      name: courseRow.course_name,
      term: courseRow.term,
      status: courseRow.status,
    }

    return ctx.view.render('pages/courses/dashboard', { user, course })
  }

  async grades(ctx: HttpContext) {
    const { params, response } = ctx
    const user = sessionUser(ctx)
    const courseId = Number(params.id)

    const courseRow = await db.from('courses').where('course_id', courseId).first()

    if (!courseRow) {
      return response.notFound('Course not found')
    }

    const hasAccess = await this.canAccessCourse(user.role, user.roleId, courseId, courseRow)

    if (!hasAccess) {
      return response.status(403).send('You do not have access to this course')
    }

    const course = {
      id: courseRow.course_id,
      code: courseRow.course_code,
      name: courseRow.course_name,
    }

    if (user.role === 'professor') {
      const assignments = await db
        .from('assignments')
        .where('course_id', courseId)
        .orderBy('assignment_id', 'asc')
        .select('assignment_id', 'title')

      const students = await db
        .from('enrollments')
        .join('students', 'enrollments.student_id', 'students.student_id')
        .where('enrollments.course_id', courseId)
        .select('students.student_id', 'students.first_name', 'students.last_name')
        .orderBy('students.last_name', 'asc')

      const assignmentIds = assignments.map((a) => a.assignment_id)

      const gradeRows =
        assignmentIds.length === 0
          ? []
          : await db
              .from('submissions')
              .leftJoin('grades', 'submissions.submission_id', 'grades.submission_id')
              .whereIn('submissions.assignment_id', assignmentIds)
              .select(
                'submissions.student_id',
                'submissions.assignment_id',
                'submissions.submission_id',
                'grades.score'
              )

      const gradeByKey = new Map(
        gradeRows.map((row) => [`${row.student_id}-${row.assignment_id}`, row])
      )

      const rows = students.map((student) => {
        const cells = assignments.map((assignment) => {
          const match = gradeByKey.get(`${student.student_id}-${assignment.assignment_id}`)
          return {
            assignmentId: assignment.assignment_id,
            submissionId: match?.submission_id ?? null,
            score: match?.score ?? null,
          }
        })
        const scored = cells.filter((c) => c.score !== null).map((c) => Number(c.score))
        const average = scored.length
          ? Math.round((scored.reduce((sum, s) => sum + s, 0) / scored.length) * 10) / 10
          : null

        return {
          id: student.student_id,
          name: `${student.first_name} ${student.last_name}`,
          cells,
          average,
        }
      })

      return ctx.view.render('pages/courses/grades/professor', {
        user,
        course,
        assignments,
        rows,
      })
    }

    // student
    const assignments = await db
      .from('assignments')
      .where('course_id', courseId)
      .orderBy('due_date', 'asc')

    const gradeRows = await db
      .from('submissions')
      .leftJoin('grades', 'submissions.submission_id', 'grades.submission_id')
      .where('submissions.student_id', user.roleId!)
      .whereIn(
        'submissions.assignment_id',
        assignments.map((a) => a.assignment_id)
      )
      .select('submissions.assignment_id', 'grades.score', 'grades.feedback')

    const gradeByAssignment = new Map(gradeRows.map((row) => [row.assignment_id, row]))

    const rows = assignments.map((assignment) => {
      const match = gradeByAssignment.get(assignment.assignment_id)
      return {
        id: assignment.assignment_id,
        title: assignment.title,
        dueDate: assignment.due_date,
        score: match?.score ?? null,
        status: match?.score != null ? 'Graded' : match ? 'Submitted' : 'Not submitted',
      }
    })

    return ctx.view.render('pages/courses/grades/student', { user, course, rows })
  }

  // GET /courses/create  (professor only)
  async create(ctx: HttpContext) {
    const user = sessionUser(ctx)
    const programs = await db.from('programs').select('program_id', 'program_name')
    return ctx.view.render('pages/courses/create', { user, programs })
  }

  // POST /courses  (professor only)
  async store(ctx: HttpContext) {
    const user = sessionUser(ctx)
    const payload = await ctx.request.validateUsing(courseValidator)

    const [courseId] = await db.table('courses').insert({
      course_code: payload.course_code,
      course_name: payload.course_name,
      term: payload.term ?? null,
      professor_id: user.roleId!,
      program_id: payload.program_id,
    })

    return ctx.response.redirect().toRoute('courses.show', { id: courseId })
  }

  // POST /courses/:id/delete  (professor only, must own the course)
  async destroy(ctx: HttpContext) {
    const { params, response, session } = ctx
    const user = sessionUser(ctx)
    const courseId = Number(params.id)

    const courseRow = await db.from('courses').where('course_id', courseId).first()

    if (!courseRow) {
      return response.notFound('Course not found')
    }

    if (courseRow.professor_id !== user.roleId) {
      return response.status(403).send('You do not have access to this course')
    }

    // No ON DELETE CASCADE defined on assignments/enrollments -> courses,
    // so a course with existing assignments or enrollments will fail this
    // delete rather than orphan rows. Surface that as a friendly message
    // instead of a raw DB error.
    try {
      await db.from('courses').where('course_id', courseId).delete()
    } catch {
      session.flash(
        'error',
        'This course still has assignments or enrolled students and cannot be deleted.'
      )
      return response.redirect().toRoute('courses.show', { id: courseId })
    }

    return response.redirect().toRoute('dashboard')
  }

  // GET /courses/:id/students  (professor + admin)
  async students(ctx: HttpContext) {
    const { params, response } = ctx
    const user = sessionUser(ctx)
    const courseId = Number(params.id)

    const courseRow = await db.from('courses').where('course_id', courseId).first()

    if (!courseRow) {
      return response.notFound('Course not found')
    }

    const hasAccess = await this.canAccessCourse(user.role, user.roleId, courseId, courseRow)

    if (!hasAccess) {
      return response.status(403).send('You do not have access to this course')
    }

    const students = await db
      .from('enrollments')
      .join('students', 'enrollments.student_id', 'students.student_id')
      .where('enrollments.course_id', courseId)
      .select(
        'students.student_id',
        'students.first_name',
        'students.last_name',
        'students.email',
        'enrollments.enrollment_status'
      )
      .orderBy('students.last_name', 'asc')

    const course = {
      id: courseRow.course_id,
      code: courseRow.course_code,
      name: courseRow.course_name,
    }

    // Only fetch the "available to enroll" list when it'll actually be
    // used - the enroll form is admin-only.
    let availableStudents: { student_id: number; first_name: string; last_name: string }[] = []

    if (user.role === 'admin') {
      const enrolledIds = students.map((s) => s.student_id)
      const availableQuery = db
        .from('students')
        .select('student_id', 'first_name', 'last_name')
        .orderBy('last_name', 'asc')

      if (enrolledIds.length > 0) {
        availableQuery.whereNotIn('student_id', enrolledIds)
      }

      availableStudents = await availableQuery
    }

    return ctx.view.render('pages/courses/students', {
      user,
      course,
      students,
      availableStudents,
    })
  }

  // POST /courses/:id/enrollments  (admin only)
  async enroll(ctx: HttpContext) {
    const { request, response, params, session } = ctx
    const courseId = Number(params.id)
    const studentId = Number(request.input('student_id'))

    const courseRow = await db.from('courses').where('course_id', courseId).first()
    if (!courseRow) {
      return response.notFound('Course not found')
    }

    const studentRow = await db.from('students').where('student_id', studentId).first()
    if (!studentRow) {
      session.flash('error', 'Student not found.')
      return response.redirect().toRoute('courses.students', { id: courseId })
    }

    const existing = await db
      .from('enrollments')
      .where('student_id', studentId)
      .where('course_id', courseId)
      .first()

    if (existing) {
      session.flash('error', 'This student is already enrolled in this course.')
      return response.redirect().toRoute('courses.students', { id: courseId })
    }

    await db.table('enrollments').insert({
      student_id: studentId,
      course_id: courseId,
      enrollment_status: 'Active',
    })

    session.flash('success', `${studentRow.first_name} ${studentRow.last_name} enrolled.`)
    return response.redirect().toRoute('courses.students', { id: courseId })
  }

  private async canAccessCourse(
    role: string | null,
    roleId: number | null,
    courseId: number,
    courseRow: { professor_id: number }
  ): Promise<boolean> {
    if (!role || !roleId) return false

    if (role === 'admin') return true
    if (role === 'professor') return courseRow.professor_id === roleId

    if (role === 'student') {
      const enrollment = await db
        .from('enrollments')
        .where('student_id', roleId)
        .where('course_id', courseId)
        .first()
      return Boolean(enrollment)
    }

    return false
  }
}
