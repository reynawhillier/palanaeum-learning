import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'enrollments'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('enrollment_id').primary()
      table.integer('student_id').unsigned().notNullable()
      table.integer('course_id').unsigned().notNullable()
      table.string('enrollment_status', 20).defaultTo('Active')

      table.foreign('student_id').references('student_id').inTable('students')
      table.foreign('course_id').references('course_id').inTable('courses')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
