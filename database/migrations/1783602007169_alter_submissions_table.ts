import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'submissions'

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.string('file_key', 500).nullable()
      table.string('mime_type', 100).nullable()
      table.integer('file_size').unsigned().nullable()
    })
  }

  async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('file_key')
      table.dropColumn('mime_type')
      table.dropColumn('file_size')
    })
  }
}
