import Assignment from '#models/assignment'
import { AssignmentValidator } from '#validators/assignment'

export default class AssignmentsController {
  /**
   * GET /assignments
   * Returns all assignments
   */
  public async index() {
    return await Assignment.all()
  }

  /**
   * POST /assignments
   * Creates a new assignment with validation
   */
  public async store({ request }) {
    const payload = await request.validateUsing(AssignmentValidator)

    return await Assignment.create({
      title: payload.title,
      description: payload.description,
      dueDate: payload.due_date,
    })
  }
}
