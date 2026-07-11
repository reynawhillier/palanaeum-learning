import { submissionFileValidator } from '#validators/submission'
import type { HttpContext } from '@adonisjs/core/http'
import db from '@adonisjs/lucid/services/db'
import string from '@adonisjs/core/helpers/string'
import drive from '@adonisjs/drive/services/main'
// Troy: Temporary submission-validation controller.
// Permanent storage and database records will be added later.
export default class SubmissionController {
  async create({ view, params }: HttpContext) {
    const courseId = params.courseId ?? null
    const assignmentId = params.assignmentId ?? null

    return view.render('pages/submissions/validate', { courseId, assignmentId })
  }

  async store({ request, response, session, params, auth }: HttpContext) {
    const payload = await request.validateUsing(submissionFileValidator)

    const file = payload.submission

    const mimeType =
      file.type && file.subtype
        ? `${file.type}/${file.subtype}`
        : (file.type ?? 'application/octet-stream')

    console.log('Detected file MIME:', {
      type: file.type,
      subtype: file.subtype,
      mimeType,
    })
    if (!params.assignmentId) {
      session.flash(
        'success',
        `File "${file.clientName}" passed validation. Size: ${file.size} bytes.`
      )
      return response.redirect().toRoute('submissions.form')
    }
    const assignmentId = Number(params.assignmentId)
    const studentId = auth.user!.id

    const fileKey =
      `submissions/course-${params.courseId}` +
      `/assignments-${assignmentId}` +
      `/student-${studentId}` +
      `/${string.uuid()}.${file.extname ?? 'bin'}`

    await file.moveToDisk(fileKey)

    const existingSubmission = await db
      .from('submissions')
      .where('assignment_id', assignmentId)
      .where('student_id', studentId)
      .first()

    if (existingSubmission) {
      await db.from('submissions').where('submission_id', existingSubmission.submission_id).update({
        file_name: file.clientName,
        file_key: fileKey,
        mime_type: mimeType,
        file_size: file.size,
        submitted_at: new Date(),
        status: 'Submitted',
      })
    } else {
      await db.table('submissions').insert({
        assignment_id: assignmentId,
        student_id: studentId,
        file_name: file.clientName,
        file_key: fileKey,
        mime_type: mimeType,
        file_size: file.size,
        submitted_at: new Date(),
        status: 'Submitted',
      })
    }
    session.flash(
      'success',
      `File "${file.clientName}" passed validation. Size: ${file.size} bytes.`
    )

    return response.redirect().toRoute('submissions.create', {
      courseId: params.courseId,
      assignmentId: params.assignmentId,
    })
  }
  async viewFile({ params, auth, response }: HttpContext) {
    const courseId = Number(params.courseId)
    const assignmentId = Number(params.assignmentId)
    const studentId = auth.user!.id

    const submission = await db
      .from('submissions')
      .join('assignments', 'submissions.assignment_id', 'assignments.assignment_id')
      .where('submissions.assignment_id', assignmentId)
      .where('submissions.student_id', studentId)
      .where('assignments.course_id', courseId)
      .select('submissions.file_key', 'submissions.file_name')
      .first()
    if (!submission?.file_key) {
      return response.notFound('Submission file not found')
    }
    const signedUrl = await drive.use().getSignedUrl(submission.file_key, {
      expiresIn: '10 mins',
    })
    return response.redirect().toPath(signedUrl)
  }
}
