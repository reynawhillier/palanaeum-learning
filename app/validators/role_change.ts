import vine from '@vinejs/vine'

export const roleChangeValidator = vine.compile(
  vine.object({
    role: vine.enum(['student', 'professor', 'admin']),
    program_id: vine.number().positive().optional(),
    department_id: vine.number().positive().optional(),
  })
)
