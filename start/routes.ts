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

    // router
    //   .get('/courses/:courseId/assignments/:assignmentId/submit', [
    //     controllers.Assignments,
    //     'createSubmission',
    //   ])
    //   .as('submissions.create')

    // router
    //   .get('/courses/:courseId/assignments/:assignmentId/submission/file', [
    //     controllers.Assignments,
    //     'viewSubmissionFile',
    //   ])
    //   .as('submissions.file')

    // router
    //   .get('/courses/:courseId/assignments', [controllers.Assignments, 'courseAssignments'])
    //   .as('courses.assignments')

    // POST routes
    router.post('logout', [controllers.Session, 'destroy'])

    router.get('/dashboard', [controllers.Dashboard, 'index']).as('dashboard')
    router.get('/profile', [controllers.Profile, 'show']).as('profile')
    router.post('/profile', [controllers.Profile, 'update']).as('profile.update')

    // router
    //   .post('/courses/:courseId/assignments/:assignmentId/submit', [
    //     controllers.Assignments,
    //     'storeSubmission',
    //   ])
    //   .as('submissions.store')

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


router
  .get('/', async ({ auth, view, response }) => {
    if (await auth.use('web').check()) {
      return response.redirect().toRoute('dashboard')
    }
    return view.render('pages/home')
  })
  .as('home')

// Assignment routes
// router
//   .group(() => {
//     router.get('/assignments', [controllers.Assignments, 'index'])
//     router.post('/assignments', [controllers.Assignments, 'store'])
//   })
//   .use(middleware.auth())

// Upload routes
router
  .group(() => {
    router.post('/upload', [controllers.Upload, 'store'])
  })
  .use(middleware.auth())

// Assignments: professor-only lifecycle (create/edit/delete) and grading.
// Registered BEFORE the generic :assignmentId route below so the literal
// "create" segment isn't swallowed by the :assignmentId param matcher.
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
      .post(
        '/courses/:courseId/assignments/:assignmentId/submissions/:submissionId/grade/delete',
        [controllers.Assignments, 'gradeDestroy']
      )
      .as('assignments.grade.destroy')
  })
  .use(middleware.auth())
  .use(middleware.role({ roles: ['professor'] }))

// Assignments: any authenticated course member can view; the controller
// branches by role internally for what it shows.
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

// Assignments: student-only submission
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

// Courses: professor-only create/delete. Registered BEFORE the generic
// :id route below so the literal "create" segment isn't swallowed by
// the :id param matcher (same issue as assignments/create).
router
  .group(() => {
    router.get('/courses/create', [controllers.Courses, 'create']).as('courses.create')
    router.post('/courses', [controllers.Courses, 'store']).as('courses.store')
    router.post('/courses/:id/delete', [controllers.Courses, 'destroy']).as('courses.destroy')
  })
  .use(middleware.auth())
  .use(middleware.role({ roles: ['professor'] }))

// Courses: classlist, professor (owner) or admin
router
  .group(() => {
    router.get('/courses/:id/students', [controllers.Courses, 'students']).as('courses.students')
  })
  .use(middleware.auth())
  .use(middleware.role({ roles: ['professor', 'admin'] }))

// Courses: any authenticated course member can view
router
  .group(() => {
    router.get('/courses/:id', [controllers.Courses, 'show']).as('courses.show')
    router.get('/courses/:id/grades', [controllers.Courses, 'grades']).as('courses.grades')
  })
  .use(middleware.auth())



