import type { HttpContext } from '@adonisjs/core/http'
import db from '@adonisjs/lucid/services/db'

export type UserRole = 'student' | 'professor' | 'admin' | null

export interface ResolvedRole {
  role: UserRole
  roleId: number | null
}

export function sessionUser({ auth, session }: HttpContext) {
  const user = auth.user!

  return {
    id: user.id,
    fullName: user.fullName,
    email: user.email,
    initials: user.initials,
    role: session.get('role') as UserRole,
    roleId: session.get('roleId') as number | null,
  }
}

export async function resolveUserRole(userId: number): Promise<ResolvedRole> {
  const student = await db.from('students').where('user_id', userId).select('student_id').first()
  if (student) {
    return { role: 'student', roleId: student.student_id }
  }

  const professor = await db
    .from('professors')
    .where('user_id', userId)
    .select('professor_id')
    .first()
  if (professor) {
    return { role: 'professor', roleId: professor.professor_id }
  }

  const admin = await db.from('admins').where('user_id', userId).select('admin_id').first()
  if (admin) {
    return { role: 'admin', roleId: admin.admin_id }
  }

  return { role: null, roleId: null }
}
