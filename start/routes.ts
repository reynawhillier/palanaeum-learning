/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import { controllers } from '#generated/controllers'
import { middleware } from '#start/kernel'
import router from '@adonisjs/core/services/router'

const CourseContentsController = () => import('#controllers/course_contents_controller')

// router.on('/').render('pages/dashboard').as('home')

// Guest routes
router
  .group(() => {
    router.get('signup', [controllers.NewAccount, 'create'])
    router.post('signup', [controllers.NewAccount, 'store'])

    router.get('login', [controllers.Session, 'create'])
    router.post('login', [controllers.Session, 'store'])
  })
  .use(middleware.guest())

// Authenticated routes
router
  .group(() => {
    router
      .get('/courses/:courseId/reports/performance/print', [
        controllers.PerformanceReports,
        'print',
      ])
      .as('reports.performance.print')

    router
      .get('/courses/:courseId/reports/performance', [controllers.PerformanceReports, 'index'])
      .as('reports.performance')

    router
      .get('/courses/:courseId/reports/performance/generate', [
        controllers.PerformanceReports,
        'generate',
      ])
      .as('reports.performance.generate.get')

    router.get('/dashboard', [controllers.Dashboard, 'index']).as('dashboard')
    router.get('/profile', [controllers.Profile, 'show']).as('profile')

    router.post('logout', [controllers.Session, 'destroy'])
    router.post('/profile', [controllers.Profile, 'update']).as('profile.update')

    router
      .post('/courses/:courseId/reports/performance/generate', [
        controllers.PerformanceReports,
        'generate',
      ])
      .as('reports.performance.generate')
  })
  .use(middleware.auth())

// Admin user list
router
  .group(() => {
    router.get('/user_list', [controllers.UserLists, 'index']).as('admin.users')
  })
  .use(middleware.auth())
  .use(middleware.role({ roles: ['admin'] }))

router
  .get('/', async ({ auth, view, response }) => {
    if (await auth.use('web').check()) {
      return response.redirect().toRoute('dashboard')
    }
    return view.render('pages/home')
  })
  .as('home')

// Upload routes
router
  .group(() => {
    router.post('/upload', [controllers.Upload, 'store'])
  })
  .use(middleware.auth())

// Course content: professor-only create/delete.
router
  .group(() => {
    router
      .get('/courses/:courseId/content/topics/create', [CourseContentsController, 'createTopic'])
      .as('course_content.topics.create')

    router
      .post('/courses/:courseId/content/topics', [CourseContentsController, 'storeTopic'])
      .as('course_content.topics.store')

    router
      .get('/courses/:courseId/content/topics/:topicId/items/create', [
        CourseContentsController,
        'createItem',
      ])
      .as('course_content.items.create')

    router
      .post('/courses/:courseId/content/topics/:topicId/items', [
        CourseContentsController,
        'storeItem',
      ])
      .as('course_content.items.store')

    router
      .post('/courses/:courseId/content/topics/:topicId/delete', [
        CourseContentsController,
        'destroyTopic',
      ])
      .as('course_content.topics.destroy')

    router
      .post('/courses/:courseId/content/topics/:topicId/items/:itemId/delete', [
        CourseContentsController,
        'destroyItem',
      ])
      .as('course_content.items.destroy')
  })
  .use(middleware.auth())
  .use(middleware.role({ roles: ['professor'] }))

// Course content: any authenticated course member can view.
router
  .group(() => {
    router
      .get('/courses/:courseId/content', [CourseContentsController, 'index'])
      .as('courses.content')

    router
      .get('/courses/:courseId/content/topics/:topicId', [CourseContentsController, 'showTopic'])
      .as('course_content.topics.show')

    router
      .get('/courses/:courseId/content/items/:itemId/file', [CourseContentsController, 'file'])
      .as('course_content.items.file')
  })
  .use(middleware.auth())

// Assignments: professor-only lifecycle create/edit/delete and grading.
router
  .group(() => {
    router
      .get('/courses/:courseId/assignments/create', [controllers.Assignments, 'create'])
      .as('assignments.create')

    router
      .post('/courses/:courseId/assignments', [controllers.Assignments, 'store'])
      .as('assignments.store')

    router
      .get('/courses/:courseId/assignments/:assignmentId/edit', [controllers.Assignments, 'edit'])
      .as('assignments.edit')

    router
      .post('/courses/:courseId/assignments/:assignmentId', [controllers.Assignments, 'update'])
      .as('assignments.update')

    router
      .post('/courses/:courseId/assignments/:assignmentId/delete', [
        controllers.Assignments,
        'destroy',
      ])
      .as('assignments.destroy')

    router
      .get('/courses/:courseId/assignments/:assignmentId/submissions/:submissionId/grade', [
        controllers.Assignments,
        'gradeEdit',
      ])
      .as('assignments.grade.edit')

    router
      .post('/courses/:courseId/assignments/:assignmentId/submissions/:submissionId/grade', [
        controllers.Assignments,
        'gradeStore',
      ])
      .as('assignments.grade.store')

    router
      .post('/courses/:courseId/assignments/:assignmentId/submissions/:submissionId/grade/delete', [
        controllers.Assignments,
        'gradeDestroy',
      ])
      .as('assignments.grade.destroy')
  })
  .use(middleware.auth())
  .use(middleware.role({ roles: ['professor'] }))

// Assignments: any authenticated course member can view.
router
  .group(() => {
    router
      .get('/courses/:courseId/assignments', [controllers.Assignments, 'index'])
      .as('courses.assignments')

    router
      .get('/courses/:courseId/assignments/:assignmentId', [controllers.Assignments, 'show'])
      .as('assignments.show')

    router
      .get('/courses/:courseId/assignments/:assignmentId/submissions/:submissionId/file', [
        controllers.Assignments,
        'file',
      ])
      .as('assignments.file')
  })
  .use(middleware.auth())

// Assignments: student-only submission.
router
  .group(() => {
    router
      .post('/courses/:courseId/assignments/:assignmentId/submit', [
        controllers.Assignments,
        'submit',
      ])
      .as('assignments.submit')
  })
  .use(middleware.auth())
  .use(middleware.role({ roles: ['student'] }))

// Courses: professor-only create/delete.
router
  .group(() => {
    router.get('/courses/create', [controllers.Courses, 'create']).as('courses.create')
    router.post('/courses', [controllers.Courses, 'store']).as('courses.store')
    router.post('/courses/:id/delete', [controllers.Courses, 'destroy']).as('courses.destroy')
  })
  .use(middleware.auth())
  .use(middleware.role({ roles: ['professor'] }))

// Courses: classlist, professor or admin.
router
  .group(() => {
    router.get('/courses/:id/students', [controllers.Courses, 'students']).as('courses.students')
  })
  .use(middleware.auth())
  .use(middleware.role({ roles: ['professor', 'admin'] }))

// Courses: admin-only enrollment.
router
  .group(() => {
    router.post('/courses/:id/enrollments', [controllers.Courses, 'enroll']).as('courses.enroll')
  })
  .use(middleware.auth())
  .use(middleware.role({ roles: ['admin'] }))

// Courses: any authenticated course member can view.
router
  .group(() => {
    router.get('/courses/:id', [controllers.Courses, 'show']).as('courses.show')
    router.get('/courses/:id/grades', [controllers.Courses, 'grades']).as('courses.grades')
  })
  .use(middleware.auth())
