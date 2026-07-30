import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'course_content_items'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('content_item_id')
      table.integer('content_topic_id').unsigned().notNullable()
      table.string('title', 255).notNullable()
      table.text('body').nullable()
      table.string('file_name', 255).nullable()
      table.string('file_key', 500).nullable()
      table.string('mime_type', 100).nullable()
      table.integer('file_size').unsigned().nullable()
      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at').nullable()

      table
        .foreign('content_topic_id')
        .references('course_content_topics.content_topic_id')
        .onDelete('CASCADE')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
