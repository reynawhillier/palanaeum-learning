import db from '@adonisjs/lucid/services/db'
import { BaseSeeder } from '@adonisjs/lucid/seeders'

export default class extends BaseSeeder {
  async run() {
    const exists = await db
      .from('professors')
      .where('school_id', 'P2001')
      .first()

    if (!exists) {
      await db.table('professors').insert([
        {
          school_id: 'P2001',
          first_name: 'Minerva',
          last_name: 'McGonagall',
          email: 'mcgonagall@school.ca',
          password_hash: 'password123',
          department_id: 1,
        },
        {
          school_id: 'P2002',
          first_name: 'Filius',
          last_name: 'Flitwick',
          email: 'flitwick@school.ca',
          password_hash: 'password234',
          department_id: 2,
        },
        {
          school_id: 'P2003',
          first_name: 'Ahsen',
          last_name: 'Ucler',
          email: 'ucler@school.ca',
          password_hash: 'password245',
          department_id: 3,
        },
        {
          school_id: 'P2004',
          first_name: 'Horace',
          last_name: 'Slughorn',
          email: 'slughorn@school.ca',
          password_hash: 'password245',
          department_id: 4,
        },
      ])
    }
  }
}