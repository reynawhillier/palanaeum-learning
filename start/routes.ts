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

router.on('/').render('pages/home').as('home')

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
// User list routes
router.get('/users', [controllers.UserLists, 'index']).use(middleware.auth())
router //so non admin can view the user list but cannot modify it
  .group(() => {
    router.post('/users', [controllers.UserLists, 'store'])
    router.put('/users/:id', [controllers.UserLists, 'update'])
    router.delete('/users/:id', [controllers.UserLists, 'destroy'])
  })
  .use(middleware.auth())
  .use(middleware.adminOnly())

