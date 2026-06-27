import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'departments'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('department_id').primary()
      table.string('department_name', 100).notNullable().unique()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}