import { BaseSchema } from '@adonisjs/lucid/schema'

// This is Adonis' default user table -> we can add to it, but we NEED to use this users' table as our main user stoargae
// Preconfigured to work with Adonis' authentication system
// There is a coomand line command to create users -> node ace make:user --help
// probably don't change these fields unless we want to go on a wild goose
export default class extends BaseSchema {
  protected tableName = 'users'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').notNullable()
      table.string('full_name').nullable()
      table.string('email', 254).notNullable().unique()
      table.string('password').notNullable()

      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at').nullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
