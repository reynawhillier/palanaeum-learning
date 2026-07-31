import { sessionUser } from '#services/role_service'
import type { HttpContext } from '@adonisjs/core/http'
import db from '@adonisjs/lucid/services/db'

export default class StudentsController {
  // GET /admin/students  (admin only)
  async index(ctx: HttpContext) {
    const user = sessionUser(ctx)

    const students = await db
      .from('students')
      .leftJoin('enrollments', 'students.student_id', 'enrollments.student_id')
      .groupBy('students.student_id', 'students.first_name', 'students.last_name', 'students.email')
      .orderBy('students.last_name', 'asc')
      .select('students.student_id as id', 'students.first_name', 'students.last_name', 'students.email')
      .count('enrollments.enrollment_id as enrollmentCount')

    return ctx.view.render('pages/admin/students/index', { user, students })
  }

  // GET /admin/students/:id  (admin only)
  async show(ctx: HttpContext) {
    const { params, response } = ctx
    const user = sessionUser(ctx)
    const studentId = Number(params.id)

    const studentRow = await db.from('students').where('student_id', studentId).first()
    if (!studentRow) {
      return response.notFound('Student not found')
    }

    const enrollments = await db
      .from('enrollments')
      .join('courses', 'enrollments.course_id', 'courses.course_id')
      .join('professors', 'courses.professor_id', 'professors.professor_id')
      .where('enrollments.student_id', studentId)
      .orderBy('courses.course_code', 'asc')
      .select(
        'courses.course_id as id',
        'courses.course_code as code',
        'courses.course_name as name',
        'enrollments.enrollment_status as status',
        db.raw("CONCAT(professors.first_name, ' ', professors.last_name) as professor")
      )

    const enrolledCourseIds = enrollments.map((e) => e.id)

    const availableCoursesQuery = db
      .from('courses')
      .select('course_id as id', 'course_code as code', 'course_name as name')
      .orderBy('course_code', 'asc')

    if (enrolledCourseIds.length > 0) {
      availableCoursesQuery.whereNotIn('course_id', enrolledCourseIds)
    }

    const availableCourses = await availableCoursesQuery

    const student = {
      id: studentRow.student_id,
      firstName: studentRow.first_name,
      lastName: studentRow.last_name,
      email: studentRow.email,
    }

    return ctx.view.render('pages/admin/students/show', {
      user,
      student,
      enrollments,
      availableCourses,
    })
  }

  // POST /admin/students/:id/enrollments  (admin only)
  async enroll(ctx: HttpContext) {
    const { request, response, params, session } = ctx
    const studentId = Number(params.id)
    const courseId = Number(request.input('course_id'))

    const studentRow = await db.from('students').where('student_id', studentId).first()
    if (!studentRow) {
      return response.notFound('Student not found')
    }

    const courseRow = await db.from('courses').where('course_id', courseId).first()
    if (!courseRow) {
      session.flash('error', 'Course not found.')
      return response.redirect().toRoute('students.show', { id: studentId })
    }

    const existing = await db
      .from('enrollments')
      .where('student_id', studentId)
      .where('course_id', courseId)
      .first()

    if (existing) {
      session.flash('error', 'This student is already enrolled in this course.')
      return response.redirect().toRoute('students.show', { id: studentId })
    }

    await db.table('enrollments').insert({
      student_id: studentId,
      course_id: courseId,
      enrollment_status: 'Active',
    })

    session.flash(
      'success',
      `${studentRow.first_name} ${studentRow.last_name} enrolled in ${courseRow.course_code}.`
    )
    return response.redirect().toRoute('students.show', { id: studentId })
  }
}
