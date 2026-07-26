import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'grades'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('grade_id').primary()
      table.integer('submission_id').unsigned().notNullable()
      table.integer('professor_id').unsigned().notNullable()
      table.decimal('score', 5, 2)
      table.text('feedback')
      table.timestamp('graded_at').defaultTo(this.now())

      table.foreign('submission_id').references('submission_id').inTable('submissions')
      table.foreign('professor_id').references('professor_id').inTable('professors')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
