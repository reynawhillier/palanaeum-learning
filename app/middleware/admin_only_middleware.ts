import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'

export default class AdminOnlyMiddleware {
  async handle(ctx: HttpContext, next: NextFn) {
    // Silent auth check (consistent with your kernel)
    await ctx.auth.check()

    const user = ctx.auth.user

    if (!user || user.role !== 'admin') {
      return ctx.response.forbidden({
        message: 'Admin access required',
      })
    }

    return next()
  }
}
