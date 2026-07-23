import type { HttpContext } from '@adonisjs/core/http'

export default class PerformanceReportsController {
  public async index({ view, params }: HttpContext) {
    const courseId = Number(params.courseId)

    return view.render('pages/reports/performance', {
      courseId,
      report: null,
    })
  }

  public async generate({ view, params }: HttpContext) {
    const courseId = Number(params.courseId)

    const report = {
      courseId,
      classAverage: null,
      submittedCount: null,
      missingCount: null,
      atRiskCount: null,
      generatedAt: new Date(),
    }

    return view.render('pages/reports/performance', {
      courseId,
      report,
    })
  }
}
