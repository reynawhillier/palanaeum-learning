import Student from '#models/student'
import type { HttpContext } from '@adonisjs/core/http'

export default class StudentListsController {
  //  Handle GET requests to list all students
  async index({ view }: HttpContext) {
    const students = await Student.query().orderBy('last_name', 'desc')

    return view.render('pages/student_list', { students })
  }
}
