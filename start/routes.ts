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

//router.on('/').render('pages/dashboard').as('home')

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

router.get('/courses/:id/assignments', async ({ view }) => {
  return view.render('pages/course/assignments')
})

router.get('/courses/:id/grades', async ({ view }) => {
  return view.render('pages/course/grades')
})
// Assignment routes
router
  .group(() => {
    router.post('/assignments', [controllers.Assignments, 'store'])
    router.get('/assignments', [controllers.Assignments, 'index'])
  })
  .use(middleware.auth())

// Upload routes
router
  .group(() => {
    router.post('/upload', [controllers.Upload, 'store'])
  })
  .use(middleware.auth())
