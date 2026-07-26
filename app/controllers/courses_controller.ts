import type { HttpContext } from '@adonisjs/core/http'
import Course from '#models/course'

export default class CoursesController {
  async index({ view }: HttpContext) {
    const courses = await Course.all()

    return view.render('pages/courses/view', {
      courses,
    })
  }
}