import db from '@adonisjs/lucid/services/db'
import { BaseSeeder } from '@adonisjs/lucid/seeders'

export default class extends BaseSeeder {
  async run() {
    const exists = await db
      .from('programs')
      .where('program_name', 'Magical Sciences')
      .first()

    if (!exists) {
      await db.table('programs').insert([
        {
          program_name: 'Magical Sciences',
          department_id: 1,
        },
        {
          program_name: 'Transfiguration Sciences',
          department_id: 1,
        },
        {
          program_name: 'Dark Arts',
          department_id: 3,
        },
        {
          program_name: 'Charm Design',
          department_id: 2,
        },
        {
          program_name: 'Potions',
          department_id: 4,
        },
      ])
    }
  }
}