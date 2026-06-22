import Role from '#models/role'
import { BaseSeeder } from '@adonisjs/lucid/seeders'

// This is an example of adding a record to a table :)
export default class extends BaseSeeder {
  async run() {
    // Write your database queries inside the run method
    await Role.firstOrCreate({ id: 1 }, {})
  }
}
