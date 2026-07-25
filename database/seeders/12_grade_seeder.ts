import db from '@adonisjs/lucid/services/db'
import { BaseSeeder } from '@adonisjs/lucid/seeders'

export default class extends BaseSeeder {
  async run() {
    const exists = await db.from('grades').where('submission_id', 1).first()

    if (!exists) {
      await db.table('grades').insert([
        {
          submission_id: 1,
          professor_id: 3,
          score: 92.5,
          feedback: 'Excellent Patronus analysis',
        },
        {
          submission_id: 2,
          professor_id: 4,
          score: 88.0,
          feedback: 'Good understanding of potion effects',
        },
      ])
    }
  }
}
