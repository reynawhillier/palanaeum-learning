import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'professors'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('professor_id').primary()
      table.string('school_id', 20).notNullable().unique()
      table.string('first_name', 50).notNullable()
      table.string('last_name', 50).notNullable()
      table.string('email', 100).notNullable().unique()
      table.string('password_hash', 255).notNullable()
      table.integer('department_id').unsigned().notNullable()
      table.timestamp('created_at').defaultTo(this.now())

      table.foreign('department_id').references('department_id').inTable('departments')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
