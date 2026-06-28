import { BaseSchema } from '@adonisjs/lucid/schema'

export default class Assignments extends BaseSchema {
  protected tableName = 'assignments'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('title').notNullable()
      table.text('description').nullable()
      table.date('due_date').notNullable()
      table.timestamps(true)
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
