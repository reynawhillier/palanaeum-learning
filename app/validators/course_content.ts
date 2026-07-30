import vine from '@vinejs/vine'

export const contentTopicValidator = vine.compile(
  vine.object({
    title: vine.string().trim().maxLength(255),
    description: vine.string().trim().optional(),
  })
)

export const contentItemValidator = vine.compile(
  vine.object({
    title: vine.string().trim().maxLength(255),
    body: vine.string().trim().optional(),
    content_file: vine
      .file({
        size: '20mb',
        extnames: ['pdf', 'doc', 'docx', 'txt', 'zip', 'png', 'jpg', 'jpeg'],
      })
      .optional(),
  })
)
