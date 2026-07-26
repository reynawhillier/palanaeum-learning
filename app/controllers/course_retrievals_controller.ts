import type { HttpContext } from '@adonisjs/core/http'
import Course from '#models/course'

export default class CourseRetrievalController {
  async index({ response }: HttpContext) {
    const courses = await Course.all()

    return response.ok({
      message: 'Courses retrieved successfully',
      data: courses,
    })
  }
}