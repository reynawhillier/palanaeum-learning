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
import CoursesController from '#controllers/courses_controller'


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

    // Reports
    router
      .get('/courses/:courseId/reports/performance/print', [
        controllers.PerformanceReports,
        'print',
      ])
      .as('reports.performance.print')


    router
      .get('/courses/:courseId/reports/performance', [
        controllers.PerformanceReports,
        'index',
      ])
      .as('reports.performance')


    router
      .get('/courses/:courseId/reports/performance/generate', [
        controllers.PerformanceReports,
        'generate',
      ])
      .as('reports.performance.generate.get')


    // Submissions
    router
      .get('/submissions/validate', [
        controllers.Submissions,
        'create'
      ])
      .as('submissions.form')


    router
      .post('/submissions/validate', [
        controllers.Submissions,
        'store'
      ])
      .as('submissions.validate')


    router
      .get('/courses/:courseId/assignments/:assignmentId/submit', [
        controllers.Assignments,
        'createSubmission',
      ])
      .as('submissions.create')


    router
      .post('/courses/:courseId/assignments/:assignmentId/submit', [
        controllers.Assignments,
        'storeSubmission',
      ])
      .as('submissions.store')


    router
      .get('/courses/:courseId/assignments', [
        controllers.Assignments,
        'courseAssignments'
      ])
      .as('courses.assignments')


    // Logout
    router.post('logout', [
      controllers.Session,
      'destroy'
    ])

  })
  .use(middleware.auth())



// User list
router
  .get('/user_list', [
    controllers.UserLists,
    'index'
  ])
  .use(middleware.auth())



// Profile
router.get('/profile', async ({ view }) => {
  return view.render('pages/profile')
})



// Dashboard
router
  .get('/', async ({ view }) => {
    return view.render('pages/dashboard')
  })
  .as('home')



// ================================
// AYZA COURSE WORK
// ================================


// Create course API
router
  .post('new-course', [
    NewCoursesController,
    'store'
  ])
  .use(middleware.auth())



// Retrieve courses API
router.get(
  'courses',
  [
    CourseRetrievalController,
    'index'
  ]
)



// Courses list page
// MUST COME BEFORE /courses/:id
router.get(
  'courses/view',
  [
    CoursesController,
    'index'
  ]
)



// Create course page
router.get(
  'courses/create',
  async ({ view }) => {
    return view.render('pages/courses/create')
  }
)



// Course grades page
router.get(
  'courses/:id/grades',
  async ({ view }) => {
    return view.render('pages/course/grades')
  }
)



// Course dashboard page
// MUST ALWAYS BE LAST
router.get(
  'courses/:id',
  async ({ view }) => {
    return view.render('pages/course_dashboard')
  }
)



// Assignments
router
  .group(() => {
    router.get('/assignments', [
      controllers.Assignments,
      'index'
    ])

    router.post('/assignments', [
      controllers.Assignments,
      'store'
    ])
  })
  .use(middleware.auth())



// Upload
router
  .post('/upload', [
    controllers.Upload,
    'store'
  ])
  .use(middleware.auth())



// Students
router.get(
  'students',
  [
    controllers.StudentLists,
    'index'
  ]
)