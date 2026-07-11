import vine from '@vinejs/vine'

export const submissionFileValidator = vine.compile(
  vine.object({
    submission: vine.file({
      size: '20mb',
      extnames: ['pdf', 'doc', 'docx', 'txt', 'zip'],
    }),
  })
)
