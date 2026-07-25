import User from '#models/user'
import type { HttpContext } from '@adonisjs/core/http'

export default class UserListsController {
  //  Handle GET requests to list all users
  async index({ view }: HttpContext) {
    return view.render('pages/user_list', {
      users: await User.all(),
    })
  }
}
