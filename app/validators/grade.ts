import vine from '@vinejs/vine'

export const gradeValidator = vine.compile(
  vine.object({
    score: vine.number().min(0).max(100),
    feedback: vine.string().trim().optional(),
  })
)
