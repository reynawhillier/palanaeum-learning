import type { HttpContext } from '@adonisjs/core/http'

export default class NewCoursesController {
  async store({ request, response }: HttpContext) {
    const data = request.only(['title', 'description'])

    return response.created({
      message: 'Course created',
      data,
    })
  }
}