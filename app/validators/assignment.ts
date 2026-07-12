import vine from '@vinejs/vine'

export const AssignmentValidator = vine.compile(
  vine.object({
    title: vine.string(),
    description: vine.string().optional(),
    due_date: vine.date(),
  })
)

