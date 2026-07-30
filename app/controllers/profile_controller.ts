import { sessionUser } from '#services/role_service'
import { profileValidator } from '#validators/profile'
import type { HttpContext } from '@adonisjs/core/http'

export default class ProfileController {
  // GET /profile
  async show(ctx: HttpContext) {
    const user = sessionUser(ctx)
    return ctx.view.render('pages/profile', { user })
  }

  // POST /profile
  async update(ctx: HttpContext) {
    const { request, response, auth, session } = ctx
    const payload = await request.validateUsing(profileValidator)

    auth.user!.fullName = payload.fullName
    await auth.user!.save()

    session.flash('success', 'Profile updated.')
    return response.redirect().toRoute('profile')
  }
}
