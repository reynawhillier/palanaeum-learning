/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import { middleware } from '#start/kernel'
import { controllers } from '#generated/controllers'
import router from '@adonisjs/core/services/router'
//import AssignmentsController from '#controllers/assignments_controller'
import { fakeUsers } from './fakeData.js'


router.get('/', async ({ view }) => {
  return view.render('pages/home')
})

router
  .group(() => {
    router.get('signup', [controllers.NewAccount, 'create'])
    router.post('signup', [controllers.NewAccount, 'store'])

    router.get('login', [controllers.Session, 'create'])
    router.post('login', [controllers.Session, 'store'])
  })
  .use(middleware.guest())

router
  .group(() => {
    router.post('logout', [controllers.Session, 'destroy'])
  })
  .use(middleware.auth())

router.get('/student_list', [controllers.StudentLists, 'index'])

router.get('/profile', async ({ view }) => {
  return view.render('pages/profile')
})

router.get('/student/dashboard', async ({ view }) => {
  return view.render('pages/dashboards/student', {
    user: fakeUsers.student,
    courses: fakeUsers.student.courses
  })
})

router.get('/professor/dashboard', async ({ view }) => {
  return view.render('pages/dashboards/professor', {
    user: fakeUsers.professor,
    courses: fakeUsers.professor.courses
  })
})

router.get('/admin/dashboard', async ({ view }) => {
  return view.render('pages/dashboards/admin', {
    user: fakeUsers.admin
  })
})

router.get('/courses/:id', async ({ view, params }) => {
  const courseId = Number(params.id)
  const user = fakeUsers.professor

  const course = user.courses.find(
    course => course.id === courseId
  )

  return view.render('pages/courses/dashboard', {
    user,
    course
  })
})

router.get('/courses/:id/assignments', async ({ view, params }) => {
    const user = fakeUsers.professor

    if(user.role === 'professor') {

        return view.render(
            'pages/courses/assignments/professor',
            {
                user,
                courseId: params.id
            }
        )

    }

    return view.render(
        'pages/courses/assignments/student',
        {
            user,
            courseId: params.id
        }
    )
})

router.get('/courses/:id/assignments/create', async ({ view, params }) => {
    return view.render('pages/courses/assignments/create', {
        courseId: params.id
    })
})

router.get('/courses/:id/grades', async ({ view, params }) => {
    return view.render('pages/courses/grades', {
        courseId: params.id
    })
})
// Assignment routes
// router
//   .group(() => {
//     router.post('/assignments', [AssignmentsController, 'store'])
//     router.get('/assignments', [AssignmentsController, 'index'])
//   })
//   .use(middleware.auth())
