import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  async up() {
    this.schema.alterTable('students', (table) => {
      table
        .integer('user_id')
        .unsigned()
        .nullable()
        .unique()
        .references('id')
        .inTable('users')
        .onDelete('CASCADE')
    })

    this.schema.alterTable('professors', (table) => {
      table
        .integer('user_id')
        .unsigned()
        .nullable()
        .unique()
        .references('id')
        .inTable('users')
        .onDelete('CASCADE')
    })

    this.schema.alterTable('admins', (table) => {
      table
        .integer('user_id')
        .unsigned()
        .nullable()
        .unique()
        .references('id')
        .inTable('users')
        .onDelete('CASCADE')
    })
  }

  async down() {
    this.schema.alterTable('admins', (table) => {
      table.dropForeign(['user_id'])
      table.dropColumn('user_id')
    })

    this.schema.alterTable('professors', (table) => {
      table.dropForeign(['user_id'])
      table.dropColumn('user_id')
    })

    this.schema.alterTable('students', (table) => {
      table.dropForeign(['user_id'])
      table.dropColumn('user_id')
    })
  }
}
