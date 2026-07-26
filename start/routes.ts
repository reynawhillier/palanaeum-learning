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
import CourseRetrievalController from '#controllers/course_retrievals_controller'
import NewCoursesController from '#controllers/new_courses_controller'


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
    // GET routes
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

    router.get('/submissions/validate', [controllers.Submissions, 'create']).as('submissions.form')

    router
      .get('/courses/:courseId/assignments/:assignmentId/submit', [
        controllers.Assignments,
        'createSubmission',
      ])
      .as('submissions.create')

    router
      .get('/courses/:courseId/assignments/:assignmentId/submission/file', [
        controllers.Assignments,
        'viewSubmissionFile',
      ])
      .as('submissions.file')

    router
      .get('/courses/:courseId/assignments', [controllers.Assignments, 'courseAssignments'])
      .as('courses.assignments')

    // POST routes
    router.post('logout', [controllers.Session, 'destroy'])

    router
      .post('/submissions/validate', [controllers.Submissions, 'store'])
      .as('submissions.validate')

    router
      .post('/courses/:courseId/assignments/:assignmentId/submit', [
        controllers.Assignments,
        'storeSubmission',
      ])
      .as('submissions.store')

    router
      .post('/courses/:courseId/reports/performance/generate', [
        controllers.PerformanceReports,
        'generate',
      ])
      .as('reports.performance.generate')
  })
  .use(middleware.auth())

router
  .group(() => {
    router.get('/user_list', [controllers.UserLists, 'index'])
  })
  .use(middleware.auth())

router.get('/profile', async ({ view }) => {
  return view.render('pages/profile')
})

router
  .get('/', async ({ view }) => {
    return view.render('pages/dashboard')
  })
  .as('home')

router.get('/courses/:id', async ({ view }) => {
  return view.render('pages/course_dashboard')
})

router.get('/courses/:id/grades', async ({ view }) => {
  return view.render('pages/course/grades')
})

// Assignment routes
router
  .group(() => {
    router.get('/assignments', [controllers.Assignments, 'index'])
    router.post('/assignments', [controllers.Assignments, 'store'])
  })
  .use(middleware.auth())

// Upload routes
router
  .group(() => {
    router.post('/upload', [controllers.Upload, 'store'])
  })
  .use(middleware.auth())

/*Ayza Work*/
router
  .group(() => {
    router.post('new-course', [NewCoursesController, 'store'])
  })
  .use(middleware.auth())

router
  .group(() => {
    router.get('courses', [CourseRetrievalController, 'index'])
  })

router.get('courses/create', async ({ view }) => {
  return view.render('pages/courses/create')
})

router.get('courses/view', async ({ view }) => {
  return view.render('pages/courses/view')
})

router.group(() => {
  router.get('students', [controllers.StudentLists, 'index'])
})