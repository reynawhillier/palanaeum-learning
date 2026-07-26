import type { HttpContext } from '@adonisjs/core/http'
import Course from '#models/course'

export default class NewCoursesController {
  async store({ request, response }: HttpContext) {
    const data = request.only([
      'courseCode',
      'courseName',
      'term',
      'status',
      'departmentId',
      'professorId',
    ])

    const course = await Course.create(data)

    return response.created({
      message: 'Course created successfully',
      course,
    })
  }
}