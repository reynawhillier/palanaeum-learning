import type { HttpContext } from '@adonisjs/core/http'

export default class CourseRetrievalController {
  async index({ response }: HttpContext) {
    // temporary mock data (until DB step later)
    const courses = [
      { id: 1, title: 'Intro to Programming', description: 'Basics of coding' },
      { id: 2, title: 'Web Development', description: 'Building web apps' },
    ]

    return response.ok({
      message: 'Courses retrieved successfully',
      data: courses,
    })
  }
}