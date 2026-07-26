import vine from '@vinejs/vine'

export const profileValidator = vine.compile(
  vine.object({
    fullName: vine.string().trim().minLength(1),
  })
)
