import type { HttpContext } from '@adonisjs/core/http'

export default class StudentListsController {
  async index({ response }: HttpContext) {
    const students = [
      { id: 1, name: 'John Doe', studentId: 'L12345678' },
      { id: 2, name: 'Jane Smith', studentId: 'L87654321' },
    ]

    return response.ok({
      message: 'Students retrieved successfully',
      data: students,
    })
  }
}