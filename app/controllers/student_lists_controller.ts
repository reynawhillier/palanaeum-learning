import type { HttpContext } from '@adonisjs/core/http'
import Student from '#models/student'

export default class StudentListsController {
  async index({ view }: HttpContext) {
    const students = await Student.all()

    return view.render('pages/students', {
      students,
    })
  }
}
