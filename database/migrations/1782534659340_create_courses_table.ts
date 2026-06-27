import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'courses'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('course_id').primary()
      table.string('course_code', 20).notNullable().unique()
      table.string('course_name', 100).notNullable()
      table.string('term', 20)
      table.string('status', 20).defaultTo('Active')
      table.integer('professor_id').unsigned().notNullable()
      table.integer('program_id').unsigned().notNullable()

      table.foreign('professor_id').references('professor_id').inTable('professors')
      table.foreign('program_id').references('program_id').inTable('programs')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}