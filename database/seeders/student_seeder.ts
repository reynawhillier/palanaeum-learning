import db from '@adonisjs/lucid/services/db'
import { BaseSeeder } from '@adonisjs/lucid/seeders'

export default class extends BaseSeeder {
  async run() {
    const exists = await db
      .from('students')
      .where('school_id', 'S1001')
      .first()

    if (!exists) {
      await db.table('students').insert([
        {
          school_id: 'S1001',
          first_name: 'James',
          last_name: 'Potter',
          email: 'potter@school.ca',
          password_hash: 'password123',
          program_id: 1,
        },
        {
          school_id: 'S1004',
          first_name: 'Sirius',
          last_name: 'Black',
          email: 'black@school.ca',
          password_hash: 'password123',
          program_id: 2,
        },
        {
          school_id: 'S1005',
          first_name: 'Remus',
          last_name: 'Lupin',
          email: 'lupin@school.ca',
          password_hash: 'password123',
          program_id: 3,
        },
        {
          school_id: 'S1006',
          first_name: 'Peter',
          last_name: 'Pettigrew',
          email: 'pettigrew@school.ca',
          password_hash: 'password123',
          program_id: 4,
        },
        {
          school_id: 'S1007',
          first_name: 'Severus',
          last_name: 'Snape',
          email: 'snape@school.ca',
          password_hash: 'password123',
          program_id: 5,
        },
      ])
    }
  }
}