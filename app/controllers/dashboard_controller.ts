import { sessionUser } from '#services/role_service'
import type { HttpContext } from '@adonisjs/core/http'
import db from '@adonisjs/lucid/services/db'

export default class DashboardController {
  async index(ctx: HttpContext) {
    const { response, session } = ctx
    const user = sessionUser(ctx)

    if (user.role === 'student') {
      const courses = await db
        .from('enrollments')
        .join('courses', 'enrollments.course_id', 'courses.course_id')
        .join('professors', 'courses.professor_id', 'professors.professor_id')
        .where('enrollments.student_id', user.roleId!)
        .select(
          'courses.course_id as id',
          'courses.course_code as code',
          'courses.course_name as name',
          'courses.term',
          db.raw("CONCAT(professors.first_name, ' ', professors.last_name) as professor")
        )

      return ctx.view.render('pages/dashboards/student', { user, courses })
    }

    if (user.role === 'professor') {
      const courses = await db
        .from('courses')
        .leftJoin('enrollments', 'courses.course_id', 'enrollments.course_id')
        .where('courses.professor_id', user.roleId!)
        .groupBy('courses.course_id', 'courses.course_code', 'courses.course_name')
        .select(
          'courses.course_id as id',
          'courses.course_code as code',
          'courses.course_name as name'
        )
        .count('enrollments.enrollment_id as students')

      return ctx.view.render('pages/dashboards/professor', { user, courses })
    }

    if (user.role === 'admin') {
      const unassignedUsers = await db
        .from('users')
        .leftJoin('students', 'users.id', 'students.user_id')
        .leftJoin('professors', 'users.id', 'professors.user_id')
        .leftJoin('admins', 'users.id', 'admins.user_id')
        .whereNull('students.user_id')
        .whereNull('professors.user_id')
        .whereNull('admins.user_id')
        .orderBy('users.created_at', 'desc')
        .select('users.id', 'users.full_name', 'users.email')

      const courses = await db
        .from('courses')
        .join('professors', 'courses.professor_id', 'professors.professor_id')
        .orderBy('courses.course_code', 'asc')
        .select(
          'courses.course_id as id',
          'courses.course_code as code',
          'courses.course_name as name',
          db.raw("CONCAT(professors.first_name, ' ', professors.last_name) as professor")
        )

      return ctx.view.render('pages/dashboards/admin', { user, unassignedUsers, courses })
    }


    // Logged-in user with no role redirecrt to profile page
    session.flash('error', 'Your account is not yet linked to a role. Contact an administrator.')
    return response.redirect().toRoute('profile')
  }
}
