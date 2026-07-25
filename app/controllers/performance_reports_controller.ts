import performanceReportService from '#services/performance_report_service'
import type { HttpContext } from '@adonisjs/core/http'
import db from '@adonisjs/lucid/services/db'

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

    const report = await performanceReportService.build(courseId)

    if (!report) {
      return response.notFound('Course not found')
    }

    return view.render('pages/reports/performance', {
      courseId,
      report,
    })
  }

  public async print({ view, params, auth, response }: HttpContext) {
    const courseId = Number(params.courseId)
    const userId = auth.user!.id

    const canAccessReport = await this.canAccessCourseReport(userId, courseId)

    if (!canAccessReport) {
      return response.status(403).send('You are not authorized to print this performance report')
    }

    const report = await performanceReportService.build(courseId)

    if (!report) {
      return response.notFound('Course not found')
    }

    return view.render('pages/reports/performance_print', {
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
}
