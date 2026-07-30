import User from '#models/user'
import type { HttpContext } from '@adonisjs/core/http'
import { resolveUserRole } from '#services/role_service'

/**
 * SessionController handles user authentication and session management.
 * It provides methods for displaying the login page, authenticating users,
 * and logging out.
 */
export default class SessionController {
  /**
   * Display the login page
   */
  async create({ view }: HttpContext) {
    return view.render('pages/auth/login')
  }

  /**
   * Authenticate user credentials and create a new session
   */
  async store({ request, auth, session, response }: HttpContext) {
    const { email, password } = request.all()
    const user = await User.verifyCredentials(email, password)

    await auth.use('web').login(user)

    // Role is derived (not a column on `users`), so we resolve it once
    // here and cache it on the session for the rest of the visit.
    const { role, roleId } = await resolveUserRole(user.id)

    if (role) {
      session.put('role', role)
    } else {
      session.forget('role')
    }

    if (roleId !== null) {
      session.put('roleId', roleId)
    } else {
      session.forget('roleId')
    }

    response.redirect().toRoute('home')
  }

  /**
   * Log out the current user and destroy their session
   */
  async destroy({ auth, session, response }: HttpContext) {
    await auth.use('web').logout()
    session.forget('role')
    session.forget('roleId')
    response.redirect().toRoute('session.create')
  }
}
