import db from '@adonisjs/lucid/services/db'
import { BaseSeeder } from '@adonisjs/lucid/seeders'

export default class extends BaseSeeder {
  async run() {
    const exists = await db
      .from('admins')
      .where('school_id', 'A3001')
      .first()

    if (!exists) {
      await db.table('admins').insert([
        {
          school_id: 'A3001',
          first_name: 'Albus',
          last_name: 'Dumbledore',
          email: 'dumbledore@school.ca',
          password_hash: 'password123',
        },
      ])
    }
  }
}