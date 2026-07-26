import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'assignments'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('assignment_id').primary()
      table.integer('course_id').unsigned().notNullable()
      table.string('title', 100).notNullable()
      table.text('description')
      table.date('due_date')
      table.string('status', 20).defaultTo('Open')

      table.foreign('course_id').references('course_id').inTable('courses')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
