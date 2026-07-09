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

//router.on('/').render('pages/home').as('home')

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

router.get('/', async ({ view }) => {
  return view.render('pages/dashboards/student')
})

router.get('/admin', async ({ view }) => {
  return view.render('pages/dashboards/admin')
})

router.get('/professor', async ({ view }) => {
  return view.render('pages/dashboards/professor')
})

router.get('/courses/:id', async ({ view, params }) => {
  return view.render('pages/courses/dashboard', {
    courseId: params.id
  })
})

router.get('/courses/:id/assignments', async ({ view, params }) => {

    const role = 'professor' // Replace later when db is connected 

    if (role === 'professor') {
        return view.render('pages/courses/assignments/professor', {
            courseId: params.id
        })
    }

    else {
        return view.render('pages/courses/assignments/student', {
            courseId: params.id
        })
    }

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
