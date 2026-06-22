import { BaseSchema } from '@adonisjs/lucid/schema'

// This is an example of a database table migration!
// Related to this: schema defined in schema.ts, create a model out of it. to work with the data (app/models/role.ts)
export default class extends BaseSchema {
  protected tableName = 'roles'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')

      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
