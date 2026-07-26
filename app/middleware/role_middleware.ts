import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'
import { sessionUser, type UserRole } from '#services/role_service'

/**
 * Enforces that the logged-in user has one of the given roles.
 * Must run AFTER auth middleware (so `session.get('role')` is populated).
 *
 * Usage: .use(middleware.role({ roles: ['professor'] }))
 */
export default class RoleMiddleware {
  async handle(ctx: HttpContext, next: NextFn, options: { roles: UserRole[] }) {
    const user = sessionUser(ctx)

    if (!user.role || !options.roles.includes(user.role)) {
      return ctx.response.status(403).send('You are not authorized to perform this action')
    }

    return next()
  }
}
