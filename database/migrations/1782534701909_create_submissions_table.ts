import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'submissions'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('submission_id').primary()
      table.integer('assignment_id').unsigned().notNullable()
      table.integer('student_id').unsigned().notNullable()
      table.string('file_name', 255)
      table.timestamp('submitted_at').defaultTo(this.now())
      table.string('status', 20).defaultTo('Submitted')

      table.foreign('assignment_id').references('assignment_id').inTable('assignments')
      table.foreign('student_id').references('student_id').inTable('students')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
