import vine from '@vinejs/vine'

export const courseValidator = vine.compile(
  vine.object({
    course_code: vine.string().trim().maxLength(20),
    course_name: vine.string().trim().maxLength(100),
    term: vine.string().trim().maxLength(20).optional(),
    program_id: vine.number().positive(),
  })
)
