import User from '#models/user'
import type { HttpContext } from '@adonisjs/core/http'

export default class UserListsController {
  //  Handle GET requests to list all users
  async index({ response }: HttpContext) {
    const users = await User.query().orderBy('last_name', 'desc')

    return response.json({ users })
  }
}
