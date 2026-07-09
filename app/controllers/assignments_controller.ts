import Assignment from '#models/assignment'
import { assignmentsValidator } from '#validators/assignments'
import type { HttpContext } from '@adonisjs/core/http'

export default class AssignmentsController {
  public async index() {
    return await Assignment.all()
  }

  public async store({ request }: HttpContext) {
    const payload = await request.validateUsing(assignmentsValidator)

    return await Assignment.create({
      title: payload.title,
      description: payload.description,
      dueDate: payload.due_date,
    })
  }
}
