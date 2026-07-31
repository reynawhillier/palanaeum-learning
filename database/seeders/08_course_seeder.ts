import db from '@adonisjs/lucid/services/db'
import { BaseSeeder } from '@adonisjs/lucid/seeders'

export default class extends BaseSeeder {
  async run() {
    const exists = await db.from('courses').where('course_code', 'DADA601').first()

    if (!exists) {
      await db.table('courses').insert([
        {
          course_code: 'DADA601',
          course_name: 'Defense Against Dark Arts',
          term: 'Summer 2026',
          professor_id: 3,
          program_id: 3,
        },
        {
          course_code: 'AD600',
          course_name: 'Advanced Potions',
          term: 'Summer 2026',
          professor_id: 4,
          program_id: 5,
        },
        {
          course_code: 'CH101',
          course_name: 'Introduction to Charms',
          term: 'Summer 2026',
          professor_id: 2,
          program_id: 4,
        },
        {
          course_code: 'TF3003',
          course_name: 'Transfiguration of the Living',
          term: 'Summer 2026',
          professor_id: 1,
          program_id: 2,
        },
      ])
    }
  }
}
