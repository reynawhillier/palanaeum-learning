import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'course_content_topics'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('content_topic_id')
      table.integer('course_id').unsigned().notNullable()
      table.integer('professor_id').unsigned().notNullable()
      table.string('title', 255).notNullable()
      table.text('description').nullable()
      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at').nullable()

      table.foreign('course_id').references('courses.course_id').onDelete('CASCADE')
      table.foreign('professor_id').references('professors.professor_id').onDelete('CASCADE')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
