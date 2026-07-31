import Assignment from '#models/assignment'
import { assignmentsValidator } from '#validators/assignment'
import { gradeValidator } from '#validators/grade'
import { submissionFileValidator } from '#validators/submission'
import { sessionUser } from '#services/role_service'
import string from '@adonisjs/core/helpers/string'
import type { HttpContext } from '@adonisjs/core/http'
import drive from '@adonisjs/drive/services/main'
import db from '@adonisjs/lucid/services/db'

export default class AssignmentsController {
  private async getCourse(courseId: number) {
    const row = await db
      .from('courses')
      .where('course_id', courseId)
      .select('course_id', 'course_code', 'course_name')
      .first()

    if (!row) return null

    return { id: row.course_id, code: row.course_code, name: row.course_name }
  }

  // GET /courses/:courseId/assignments
  async index(ctx: HttpContext) {
    const { view, params } = ctx
    const user = sessionUser(ctx)
    const courseId = Number(params.courseId)
    const course = await this.getCourse(courseId)

    const assignmentRows = await db
      .from('assignments')
      .where('course_id', courseId)
      .orderBy('due_date', 'asc')

    if (user.role === 'professor') {
      const counts = await db
        .from('submissions')
        .whereIn(
          'assignment_id',
          assignmentRows.map((a) => a.assignment_id)
        )
        .groupBy('assignment_id')
        .select('assignment_id')
        .count('* as count')

      const countByAssignment = new Map(counts.map((c) => [c.assignment_id, Number(c.count)]))

      const assignments = assignmentRows.map((a) => ({
        id: a.assignment_id,
        title: a.title,
        due: a.due_date,
        submissionCount: countByAssignment.get(a.assignment_id) ?? 0,
      }))

      return view.render('pages/courses/assignments/index', { user, courseId, course, assignments })
    }

    // student
    const submissionRows = await db
      .from('submissions')
      .where('student_id', user.roleId!)
      .select('assignment_id')

    const submittedIds = new Set(submissionRows.map((s) => Number(s.assignment_id)))

    const assignments = assignmentRows.map((a) => ({
      id: a.assignment_id,
      title: a.title,
      due: a.due_date,
      submitted: submittedIds.has(Number(a.assignment_id)),
    }))

    return view.render('pages/courses/assignments/index', { user, courseId, course, assignments })
  }

  // GET /courses/:courseId/assignments/create  (professor only, enforced by route middleware)
  async create(ctx: HttpContext) {
    const user = sessionUser(ctx)
    const courseId = Number(ctx.params.courseId)
    const course = await this.getCourse(courseId)

    return ctx.view.render('pages/courses/assignments/create', { user, courseId, course })
  }

  // POST /courses/:courseId/assignments  (professor only)
  async store({ request, response, params }: HttpContext) {
    const courseId = Number(params.courseId)
    const payload = await request.validateUsing(assignmentsValidator)

    await Assignment.create({
      courseId,
      title: payload.title,
      description: payload.description ?? null,
      dueDate: payload.due_date,
      status: 'Open',
    })

    return response.redirect().toRoute('courses.assignments', { courseId })
  }

  // GET /courses/:courseId/assignments/:assignmentId
  async show(ctx: HttpContext) {
    const { view, params, response } = ctx
    const user = sessionUser(ctx)
    const courseId = Number(params.courseId)
    const assignmentId = Number(params.assignmentId)
    const course = await this.getCourse(courseId)

    const assignmentRow = await db
      .from('assignments')
      .where('assignment_id', assignmentId)
      .where('course_id', courseId)
      .first()

    if (!assignmentRow) {
      return response.notFound('Assignment not found')
    }

    const assignment = {
      id: assignmentRow.assignment_id,
      title: assignmentRow.title,
      description: assignmentRow.description,
      dueDate: assignmentRow.due_date,
    }

    if (user.role === 'professor') {
      const submissions = await db
        .from('submissions')
        .join('students', 'submissions.student_id', 'students.student_id')
        .leftJoin('grades', 'submissions.submission_id', 'grades.submission_id')
        .where('submissions.assignment_id', assignmentId)
        .select(
          'submissions.submission_id',
          'submissions.file_name',
          'submissions.submitted_at',
          'students.first_name',
          'students.last_name',
          'grades.score',
          'grades.feedback'
        )

      return view.render('pages/courses/assignments/show', {
        user,
        courseId,
        course,
        assignment,
        submissions,
      })
    }

    // student
    const submission = await db
      .from('submissions')
      .leftJoin('grades', 'submissions.submission_id', 'grades.submission_id')
      .where('submissions.assignment_id', assignmentId)
      .where('submissions.student_id', user.roleId!)
      .select(
        'submissions.submission_id',
        'submissions.file_name',
        'submissions.submitted_at',
        'grades.score',
        'grades.feedback'
      )
      .first()

    return view.render('pages/courses/assignments/show', {
      user,
      courseId,
      course,
      assignment,
      submission,
    })
  }

  // GET /courses/:courseId/assignments/:assignmentId/edit  (professor only)
  async edit(ctx: HttpContext) {
    const user = sessionUser(ctx)
    const courseId = Number(ctx.params.courseId)
    const assignmentId = Number(ctx.params.assignmentId)
    const course = await this.getCourse(courseId)

    const assignmentRow = await db
      .from('assignments')
      .where('assignment_id', assignmentId)
      .where('course_id', courseId)
      .first()

    if (!assignmentRow) {
      return ctx.response.notFound('Assignment not found')
    }

    return ctx.view.render('pages/courses/assignments/edit', {
      user,
      courseId,
      course,
      assignment: {
        id: assignmentRow.assignment_id,
        title: assignmentRow.title,
        description: assignmentRow.description,
        dueDate: assignmentRow.due_date,
      },
    })
  }

  // POST /courses/:courseId/assignments/:assignmentId  (professor only)
  async update({ request, response, params }: HttpContext) {
    const courseId = Number(params.courseId)
    const assignmentId = Number(params.assignmentId)
    const payload = await request.validateUsing(assignmentsValidator)

    await db
      .from('assignments')
      .where('assignment_id', assignmentId)
      .where('course_id', courseId)
      .update({
        title: payload.title,
        description: payload.description ?? null,
        due_date: payload.due_date.toSQLDate(),
      })

    return response.redirect().toRoute('assignments.show', { courseId, assignmentId })
  }

  // POST /courses/:courseId/assignments/:assignmentId/delete  (professor only)
  async destroy({ response, params }: HttpContext) {
    const courseId = Number(params.courseId)
    const assignmentId = Number(params.assignmentId)

    await db
      .from('assignments')
      .where('assignment_id', assignmentId)
      .where('course_id', courseId)
      .delete()

    return response.redirect().toRoute('courses.assignments', { courseId })
  }

  // POST /courses/:courseId/assignments/:assignmentId/submit  (student only)
  async submit(ctx: HttpContext) {
    const { request, response, session, params } = ctx
    const user = sessionUser(ctx)
    const payload = await request.validateUsing(submissionFileValidator)
    const file = payload.submission

    const courseId = Number(params.courseId)
    const assignmentId = Number(params.assignmentId)
    const studentId = user.roleId!

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

    session.flash('success', `File "${file.clientName}" submitted successfully.`)

    return response.redirect().toRoute('assignments.show', { courseId, assignmentId })
  }

  // GET /courses/:courseId/assignments/:assignmentId/submissions/:submissionId/file
  async file(ctx: HttpContext) {
    const { params, response } = ctx
    const user = sessionUser(ctx)
    const submissionId = Number(params.submissionId)

    const query = db.from('submissions').where('submission_id', submissionId)

    // Students may only fetch their own submission file; professors may
    // fetch any submission (ownership of the course is checked at the
    // assignments.show level that links here).
    if (user.role === 'student') {
      query.where('student_id', user.roleId!)
    }

    const submission = await query.select('file_key').first()

    if (!submission?.file_key) {
      return response.notFound('Submission file not found')
    }

    const signedUrl = await drive.use().getSignedUrl(submission.file_key, {
      expiresIn: '10 mins',
    })

    return response.redirect().toPath(signedUrl)
  }

  // GET /courses/:courseId/assignments/:assignmentId/submissions/:submissionId/grade  (professor only)
  async gradeEdit(ctx: HttpContext) {
    const user = sessionUser(ctx)
    const courseId = Number(ctx.params.courseId)
    const assignmentId = Number(ctx.params.assignmentId)
    const submissionId = Number(ctx.params.submissionId)
    const course = await this.getCourse(courseId)

    const submission = await db
      .from('submissions')
      .join('students', 'submissions.student_id', 'students.student_id')
      .leftJoin('grades', 'submissions.submission_id', 'grades.submission_id')
      .where('submissions.submission_id', submissionId)
      .select(
        'submissions.file_name',
        'students.first_name',
        'students.last_name',
        'grades.score',
        'grades.feedback'
      )
      .first()

    if (!submission) {
      return ctx.response.notFound('Submission not found')
    }

    return ctx.view.render('pages/courses/assignments/grade', {
      user,
      courseId,
      course,
      assignmentId,
      submissionId,
      submission,
    })
  }

  // POST /courses/:courseId/assignments/:assignmentId/submissions/:submissionId/grade  (professor only)
  async gradeStore(ctx: HttpContext) {
    const { request, response, params } = ctx
    const user = sessionUser(ctx)
    const courseId = Number(params.courseId)
    const assignmentId = Number(params.assignmentId)
    const submissionId = Number(params.submissionId)
    const payload = await request.validateUsing(gradeValidator)

    const existingGrade = await db.from('grades').where('submission_id', submissionId).first()

    if (existingGrade) {
      await db
        .from('grades')
        .where('grade_id', existingGrade.grade_id)
        .update({
          score: payload.score,
          feedback: payload.feedback ?? null,
          professor_id: user.roleId!,
          graded_at: new Date(),
        })
    } else {
      await db.table('grades').insert({
        submission_id: submissionId,
        professor_id: user.roleId!,
        score: payload.score,
        feedback: payload.feedback ?? null,
        graded_at: new Date(),
      })
    }

    return response.redirect().toRoute('assignments.show', { courseId, assignmentId })
  }

  // POST /courses/:courseId/assignments/:assignmentId/submissions/:submissionId/grade/delete  (professor only)
  async gradeDestroy(ctx: HttpContext) {
    const { response, params } = ctx
    const courseId = Number(params.courseId)
    const assignmentId = Number(params.assignmentId)
    const submissionId = Number(params.submissionId)

    await db.from('grades').where('submission_id', submissionId).delete()

    return response.redirect().toRoute('assignments.show', { courseId, assignmentId })
  }
}
