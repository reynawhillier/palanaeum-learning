import User from '#models/user'
import { signupValidator } from '#validators/user'
import type { HttpContext } from '@adonisjs/core/http'

/**
 * NewAccountController handles user registration.
 * It provides methods for displaying the signup page and creating
 * new user accounts.
 */
export default class NewAccountController {
  /**
   * Display the signup page
   */
  async create({ view }: HttpContext) {
    return view.render('pages/auth/signup')
  }

  /**
   * Create a new user account and authenticate the user
   */
  async store({ request, response, auth, session }: HttpContext) {
    const payload = await request.validateUsing(signupValidator)
    const user = await User.create({ ...payload })

    await auth.use('web').login(user)

    // A fresh signup has no students/professors/admins row yet, so there's
    // no role to yet. An admin has to assign one via /admin/users
    // before this account can see a dashboard. Send them straight to
    // profile rather than through home/dashboard, which would just bounce
    // them right back here anyway.
    session.flash(
      'success',
      'Account created! An administrator needs to assign your role before you can access courses.'
    )
    response.redirect().toRoute('profile')
  }
}
