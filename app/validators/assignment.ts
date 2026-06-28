import { schema } from '@adonisjs/validator'

export const AssignmentValidator = schema.create({
  title: schema.string(),
  description: schema.string.optional(),
  due_date: schema.date(),
})
