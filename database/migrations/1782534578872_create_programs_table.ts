import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'programs'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('program_id').primary()
      table.string('program_name', 100).notNullable().unique()
      table.integer('department_id').unsigned().notNullable()

      table.foreign('department_id').references('department_id').inTable('departments')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}