import db from '@adonisjs/lucid/services/db'
import { BaseSeeder } from '@adonisjs/lucid/seeders'

export default class extends BaseSeeder {
  async run() {
    const exists = await db
      .from('assignments')
      .where('title', 'Patronus Essay')
      .first()

    if (!exists) {
      await db.table('assignments').insert([
        {
          course_id: 1,
          title: 'Patronus Essay',
          description: 'Write a 1000 word essay on Patronus Charm.',
          due_date: '2026-07-15',
        },
        {
          course_id: 2,
          title: 'Potion Analysis',
          description: 'Analyze the effects of Polyjuice Potion.',
          due_date: '2026-07-20',
        },
        {
          course_id: 3,
          title: 'Wingardium Leviosa Practice',
          description: 'Demonstrate proper levitation technique.',
          due_date: '2026-07-25',
        },
      ])
    }
  }
}