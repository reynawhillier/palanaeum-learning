import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'students'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('student_id').primary()
      table.string('school_id', 20).notNullable().unique()
      table.string('first_name', 50).notNullable()
      table.string('last_name', 50).notNullable()
      table.string('email', 100).notNullable().unique()
      table.string('password_hash', 255).notNullable()
      table.integer('program_id').unsigned().notNullable()
      table.timestamp('created_at').defaultTo(this.now())

      table.foreign('program_id').references('program_id').inTable('programs')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
