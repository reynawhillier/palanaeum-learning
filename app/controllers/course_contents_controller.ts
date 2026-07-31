import { sessionUser } from '#services/role_service'
import { contentItemValidator, contentTopicValidator } from '#validators/course_content'
import string from '@adonisjs/core/helpers/string'
import type { HttpContext } from '@adonisjs/core/http'
import drive from '@adonisjs/drive/services/main'
import db from '@adonisjs/lucid/services/db'

export default class CourseContentsController {
  private async getCourse(courseId: number) {
    const row = await db
      .from('courses')
      .where('course_id', courseId)
      .select('course_id', 'course_code', 'course_name', 'professor_id')
      .first()

    if (!row) return null

    return {
      id: row.course_id,
      code: row.course_code,
      name: row.course_name,
      professorId: row.professor_id,
    }
  }

  private async canViewCourse(
    user: { role: string | null; roleId: number | null },
    courseId: number,
    course: { professorId: number }
  ) {
    if (!user.role || !user.roleId) return false

    if (user.role === 'admin') return true
    if (user.role === 'professor') return course.professorId === user.roleId

    if (user.role === 'student') {
      const enrollment = await db
        .from('enrollments')
        .where('course_id', courseId)
        .where('student_id', user.roleId)
        .first()

      return Boolean(enrollment)
    }

    return false
  }

  private canManageCourse(
    user: { role: string | null; roleId: number | null },
    course: { professorId: number }
  ) {
    return user.role === 'professor' && user.roleId === course.professorId
  }

  async index(ctx: HttpContext) {
    const { params, response, view } = ctx
    const user = sessionUser(ctx)
    const courseId = Number(params.courseId)

    if (Number.isNaN(courseId)) {
      return response.status(400).send('Invalid course ID')
    }

    const course = await this.getCourse(courseId)

    if (!course) {
      return response.notFound('Course not found')
    }

    if (!(await this.canViewCourse(user, courseId, course))) {
      return response.status(403).send('You do not have access to this course')
    }

    const topicRows = await db
      .from('course_content_topics')
      .leftJoin(
        'course_content_items',
        'course_content_topics.content_topic_id',
        'course_content_items.content_topic_id'
      )
      .where('course_content_topics.course_id', courseId)
      .groupBy(
        'course_content_topics.content_topic_id',
        'course_content_topics.title',
        'course_content_topics.description',
        'course_content_topics.created_at'
      )
      .select(
        'course_content_topics.content_topic_id',
        'course_content_topics.title',
        'course_content_topics.description',
        'course_content_topics.created_at'
      )
      .count('course_content_items.content_item_id as itemCount')
      .orderBy('course_content_topics.created_at', 'desc')

    const topics = topicRows.map((topic) => ({
      id: topic.content_topic_id,
      title: topic.title,
      description: topic.description,
      createdAt: topic.created_at,
      itemCount: Number(topic.itemCount ?? 0),
    }))

    return view.render('pages/courses/content/index', {
      user,
      course,
      courseId,
      topics,
      canManage: this.canManageCourse(user, course),
    })
  }

  async createTopic(ctx: HttpContext) {
    const { params, response, view } = ctx
    const user = sessionUser(ctx)
    const courseId = Number(params.courseId)
    const course = await this.getCourse(courseId)

    if (!course) {
      return response.notFound('Course not found')
    }

    if (!this.canManageCourse(user, course)) {
      return response.status(403).send('You do not have access to manage this course')
    }

    return view.render('pages/courses/content/create_topic', { user, course, courseId })
  }

  async storeTopic(ctx: HttpContext) {
    const { request, response, params } = ctx
    const user = sessionUser(ctx)
    const courseId = Number(params.courseId)
    const course = await this.getCourse(courseId)

    if (!course) {
      return response.notFound('Course not found')
    }

    if (!this.canManageCourse(user, course)) {
      return response.status(403).send('You do not have access to manage this course')
    }

    const payload = await request.validateUsing(contentTopicValidator)

    const [topicId] = await db.table('course_content_topics').insert({
      course_id: courseId,
      professor_id: user.roleId!,
      title: payload.title,
      description: payload.description ?? null,
      created_at: new Date(),
      updated_at: new Date(),
    })

    return response.redirect().toPath(`/courses/${courseId}/content/topics/${topicId}`)
  }

  async showTopic(ctx: HttpContext) {
    const { params, response, view } = ctx
    const user = sessionUser(ctx)
    const courseId = Number(params.courseId)
    const topicId = Number(params.topicId)
    const course = await this.getCourse(courseId)

    if (!course) {
      return response.notFound('Course not found')
    }

    if (!(await this.canViewCourse(user, courseId, course))) {
      return response.status(403).send('You do not have access to this course')
    }

    const topic = await db
      .from('course_content_topics')
      .where('content_topic_id', topicId)
      .where('course_id', courseId)
      .first()

    if (!topic) {
      return response.notFound('Content topic not found')
    }

    const items = await db
      .from('course_content_items')
      .where('content_topic_id', topicId)
      .orderBy('created_at', 'desc')

    return view.render('pages/courses/content/show_topic', {
      user,
      course,
      courseId,
      topic,
      items,
      canManage: this.canManageCourse(user, course),
    })
  }

  async createItem(ctx: HttpContext) {
    const { params, response, view } = ctx
    const user = sessionUser(ctx)
    const courseId = Number(params.courseId)
    const topicId = Number(params.topicId)
    const course = await this.getCourse(courseId)

    if (!course) {
      return response.notFound('Course not found')
    }

    if (!this.canManageCourse(user, course)) {
      return response.status(403).send('You do not have access to manage this course')
    }

    const topic = await db
      .from('course_content_topics')
      .where('content_topic_id', topicId)
      .where('course_id', courseId)
      .first()

    if (!topic) {
      return response.notFound('Content topic not found')
    }

    return view.render('pages/courses/content/create_item', {
      user,
      course,
      courseId,
      topic,
    })
  }

  async storeItem(ctx: HttpContext) {
    const { request, response, params, session } = ctx
    const user = sessionUser(ctx)
    const courseId = Number(params.courseId)
    const topicId = Number(params.topicId)
    const course = await this.getCourse(courseId)

    if (!course) {
      return response.notFound('Course not found')
    }

    if (!this.canManageCourse(user, course)) {
      return response.status(403).send('You do not have access to manage this course')
    }

    const topic = await db
      .from('course_content_topics')
      .where('content_topic_id', topicId)
      .where('course_id', courseId)
      .first()

    if (!topic) {
      return response.notFound('Content topic not found')
    }

    const payload = await request.validateUsing(contentItemValidator)
    const file = payload.content_file

    let fileName: string | null = null
    let fileKey: string | null = null
    let mimeType: string | null = null
    let fileSize: number | null = null

    if (file) {
      mimeType =
        file.type && file.subtype
          ? `${file.type}/${file.subtype}`
          : (file.type ?? 'application/octet-stream')

      fileKey =
        `content/course-${courseId}` +
        `/topic-${topicId}` +
        `/${string.uuid()}.${file.extname ?? 'bin'}`

      await file.moveToDisk(fileKey)

      fileName = file.clientName
      fileSize = file.size
    }

    await db.table('course_content_items').insert({
      content_topic_id: topicId,
      title: payload.title,
      body: payload.body ?? null,
      file_name: fileName,
      file_key: fileKey,
      mime_type: mimeType,
      file_size: fileSize,
      created_at: new Date(),
      updated_at: new Date(),
    })

    session.flash('success', 'Content item added.')

    return response.redirect().toPath(`/courses/${courseId}/content/topics/${topicId}`)
  }

  async file(ctx: HttpContext) {
    const { params, response } = ctx
    const user = sessionUser(ctx)
    const courseId = Number(params.courseId)
    const itemId = Number(params.itemId)
    const course = await this.getCourse(courseId)

    if (!course) {
      return response.notFound('Course not found')
    }

    if (!(await this.canViewCourse(user, courseId, course))) {
      return response.status(403).send('You do not have access to this course')
    }

    const item = await db
      .from('course_content_items')
      .join(
        'course_content_topics',
        'course_content_items.content_topic_id',
        'course_content_topics.content_topic_id'
      )
      .where('course_content_items.content_item_id', itemId)
      .where('course_content_topics.course_id', courseId)
      .select('course_content_items.file_key')
      .first()

    if (!item?.file_key) {
      return response.notFound('Content file not found')
    }

    const signedUrl = await drive.use().getSignedUrl(item.file_key, {
      expiresIn: '10 mins',
    })

    return response.redirect().toPath(signedUrl)
  }

  async destroyTopic(ctx: HttpContext) {
    const { params, response } = ctx
    const user = sessionUser(ctx)
    const courseId = Number(params.courseId)
    const topicId = Number(params.topicId)
    const course = await this.getCourse(courseId)

    if (!course) {
      return response.notFound('Course not found')
    }

    if (!this.canManageCourse(user, course)) {
      return response.status(403).send('You do not have access to manage this course')
    }

    await db
      .from('course_content_topics')
      .where('content_topic_id', topicId)
      .where('course_id', courseId)
      .delete()

    return response.redirect().toPath(`/courses/${courseId}/content`)
  }

  async destroyItem(ctx: HttpContext) {
    const { params, response } = ctx
    const user = sessionUser(ctx)
    const courseId = Number(params.courseId)
    const topicId = Number(params.topicId)
    const itemId = Number(params.itemId)
    const course = await this.getCourse(courseId)

    if (!course) {
      return response.notFound('Course not found')
    }

    if (!this.canManageCourse(user, course)) {
      return response.status(403).send('You do not have access to manage this course')
    }

    await db
      .from('course_content_items')
      .join(
        'course_content_topics',
        'course_content_items.content_topic_id',
        'course_content_topics.content_topic_id'
      )
      .where('course_content_items.content_item_id', itemId)
      .where('course_content_topics.content_topic_id', topicId)
      .where('course_content_topics.course_id', courseId)
      .delete()

    return response.redirect().toPath(`/courses/${courseId}/content/topics/${topicId}`)
  }
}
