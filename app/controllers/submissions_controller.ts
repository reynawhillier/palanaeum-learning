import { submissionFileValidator } from '#validators/submission'
import type { HttpContext } from '@adonisjs/core/http'

export default class SubmissionController {
  public async create({ view }: HttpContext) {
    return view.render('pages/submissions/validate', {
      courseId: null,
      assignmentId: null,
    })
  }

  public async store({ request, response, session }: HttpContext) {
    const payload = await request.validateUsing(submissionFileValidator)
    const file = payload.submission

    session.flash(
      'success',
      `File "${file.clientName}" passed validation. Size: ${file.size} bytes.`
    )

    return response.redirect().toRoute('submissions.form')
  }
}
