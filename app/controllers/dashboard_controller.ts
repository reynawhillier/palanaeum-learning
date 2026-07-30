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
      return ctx.view.render('pages/dashboards/admin', { user })
    }

    // Logged-in user with no students/professors/admins row (typically a
    // fresh self-signup awaiting admin role assignment). Redirecting to
    // the login page here would loop forever - GuestMiddleware bounces
    // authenticated users away from it, straight back to '/', which
    // redirects to /dashboard again. Send them somewhere that works for
    // any authenticated user instead.
    session.flash('error', 'Your account is not yet linked to a role. Contact an administrator.')
    return response.redirect().toRoute('profile')
  }
}
