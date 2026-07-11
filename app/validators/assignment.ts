import vine from '@vinejs/vine'

export const assignmentsValidator = vine.compile(
  vine.object({
    title: vine.string().trim(),
    description: vine.string().trim().optional(),
    due_date: vine.date(),
  })
)