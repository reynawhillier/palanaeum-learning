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
import CourseRetrievalController from '#controllers/course_retrievals_controller'
import NewCoursesController from '#controllers/new_courses_controller'


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
