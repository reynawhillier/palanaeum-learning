import Assignment from '#models/assignment'
import { assignmentsValidator } from '#validators/assignment'
import { submissionFileValidator } from '#validators/submission'
import string from '@adonisjs/core/helpers/string'
import type { HttpContext } from '@adonisjs/core/http'
import drive from '@adonisjs/drive/services/main'
import db from '@adonisjs/lucid/services/db'

export default class AssignmentsController {
  public async index() {
    return await Assignment.all()
  }

  public async courseAssignments({ view, params, auth }: HttpContext) {
    const courseId = Number(params.courseId)
    const studentId = auth.user!.id

    const assignmentRows = await db
      .from('assignments')
      .where('course_id', courseId)
      .orderBy('assignment_id', 'asc')

    const submissionRows = await db
      .from('submissions')
      .where('student_id', studentId)
      .select('assignment_id')

    const submittedIds = new Set(
      submissionRows.map((submission) => Number(submission.assignment_id))
    )

    const assignments = assignmentRows.map((assignment) => ({
      id: assignment.assignment_id,
      name: assignment.title,
      due: assignment.due_date,
      submitted: submittedIds.has(Number(assignment.assignment_id)),
    }))

    return view.render('pages/course/assignments', {
      courseId,
      assignments,
    })
  }

  public async createSubmission({ view, params }: HttpContext) {
    const courseId = Number(params.courseId)
    const assignmentId = Number(params.assignmentId)

    return view.render('pages/submissions/validate', {
      courseId,
      assignmentId,
    })
  }

  public async storeSubmission({ request, response, session, params, auth }: HttpContext) {
    const payload = await request.validateUsing(submissionFileValidator)
    const file = payload.submission

    const courseId = Number(params.courseId)
    const assignmentId = Number(params.assignmentId)
    const studentId = auth.user!.id

    const mimeType =
      file.type && file.subtype
        ? `${file.type}/${file.subtype}`
        : (file.type ?? 'application/octet-stream')

    const fileKey =
      `submissions/course-${courseId}` +
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
      courseId,
      assignmentId,
    })
  }

  public async viewSubmissionFile({ params, auth, response }: HttpContext) {
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

  public async store({ request }: HttpContext) {
    const payload = await request.validateUsing(assignmentsValidator)

    return await Assignment.create({
      courseId: payload.course_id,
      title: payload.title,
      description: payload.description ?? null,
      dueDate: payload.due_date,
      status: 'Open',
    })
  }
}