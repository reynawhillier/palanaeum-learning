import { sessionUser, resolveUserRole } from '#services/role_service'
import { roleChangeValidator } from '#validators/role_change'
import type { HttpContext } from '@adonisjs/core/http'
import db from '@adonisjs/lucid/services/db'

export default class UserListsController {
  // GET /admin/users  (admin only)
  async index(ctx: HttpContext) {
    const currentUser = sessionUser(ctx)
    const users = await db.from('users').orderBy('full_name', 'asc')

    const students = await db.from('students').select('user_id', 'student_id')
    const professors = await db.from('professors').select('user_id', 'professor_id')
    const admins = await db.from('admins').select('user_id', 'admin_id')

    const roleByUserId = new Map<number, string>()
    for (const s of students) if (s.user_id) roleByUserId.set(s.user_id, 'student')
    for (const p of professors) if (p.user_id) roleByUserId.set(p.user_id, 'professor')
    for (const a of admins) if (a.user_id) roleByUserId.set(a.user_id, 'admin')

    const rows = users.map((u) => ({
      id: u.id,
      fullName: u.full_name,
      email: u.email,
      role: roleByUserId.get(u.id) ?? 'unassigned',
    }))

    return ctx.view.render('pages/user_list', { user: currentUser, users: rows })
  }

  // GET /admin/users/:id/change-role  (admin only)
  async changeRoleForm(ctx: HttpContext) {
    const currentUser = sessionUser(ctx)
    const targetUserId = Number(ctx.params.id)

    const targetUser = await db.from('users').where('id', targetUserId).first()
    if (!targetUser) return ctx.response.notFound('User not found')

    const { role: currentRole } = await resolveUserRole(targetUserId)
    const departments = await db.from('departments').select('department_id', 'department_name')
    const programs = await db.from('programs').select('program_id', 'program_name')

    return ctx.view.render('pages/admin/change_role', {
      user: currentUser,
      targetUser,
      currentRole,
      departments,
      programs,
    })
  }

  // POST /admin/users/:id/change-role  (admin only)
  async changeRole(ctx: HttpContext) {
    const { request, response, session, params } = ctx
    const targetUserId = Number(params.id)
    const payload = await request.validateUsing(roleChangeValidator)

    if (payload.role === 'student' && !payload.program_id) {
      session.flash('error', 'Choose a program for a student.')
      return response.redirect().back()
    }

    if (payload.role === 'professor' && !payload.department_id) {
      session.flash('error', 'Choose a department for a professor.')
      return response.redirect().back()
    }

    const targetUser = await db.from('users').where('id', targetUserId).first()
    if (!targetUser) return response.notFound('User not found')

    // Try to change role, can't change if prof has courses or student has enrollments/submissions/grades.
    const { role: currentRole } = await resolveUserRole(targetUserId)

    if (currentRole && currentRole !== payload.role) {
      const currentTable =
        currentRole === 'student' ? 'students' : currentRole === 'professor' ? 'professors' : 'admins'

      try {
        await db.from(currentTable).where('user_id', targetUserId).delete()
      } catch {
        session.flash(
          'error',
          `${targetUser.full_name} still has active ${currentRole} data (owned courses, enrollments, submissions, or grades) and can't be switched to a new role until that's reassigned or removed first.`
        )
        return response.redirect().toRoute('admin.users')
      }
    } else if (currentRole === payload.role) {
      session.flash('error', `${targetUser.full_name} is already a ${payload.role}.`)
      return response.redirect().toRoute('admin.users')
    }

    const { firstName, lastName } = this.splitName(targetUser.full_name)
    const schoolId = this.generateSchoolId(payload.role, targetUserId)

    if (payload.role === 'student') {
      await db.table('students').insert({
        user_id: targetUserId,
        school_id: schoolId,
        first_name: firstName,
        last_name: lastName,
        email: targetUser.email,
        password_hash: targetUser.password,
        program_id: payload.program_id,
      })
    } else if (payload.role === 'professor') {
      await db.table('professors').insert({
        user_id: targetUserId,
        school_id: schoolId,
        first_name: firstName,
        last_name: lastName,
        email: targetUser.email,
        password_hash: targetUser.password,
        department_id: payload.department_id,
      })
    } else {
      await db.table('admins').insert({
        user_id: targetUserId,
        school_id: schoolId,
        first_name: firstName,
        last_name: lastName,
        email: targetUser.email,
        password_hash: targetUser.password,
      })
    }

    session.flash('success', `${targetUser.full_name} is now a ${payload.role}.`)
    return response.redirect().toRoute('admin.users')
  }

  private splitName(fullName: string | null): { firstName: string; lastName: string } {
    if (!fullName || !fullName.trim()) {
      return { firstName: 'Unknown', lastName: 'User' }
    }

    const parts = fullName.trim().split(/\s+/)
    const firstName = parts[0]
    const lastName = parts.length > 1 ? parts.slice(1).join(' ') : 'Unknown'

    return { firstName, lastName }
  }

  private generateSchoolId(role: 'student' | 'professor' | 'admin', userId: number): string {
    const prefix = role === 'student' ? 'S' : role === 'professor' ? 'P' : 'A'
    return `${prefix}${userId}`
  }
}
