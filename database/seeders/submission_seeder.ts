import db from '@adonisjs/lucid/services/db'
import { BaseSeeder } from '@adonisjs/lucid/seeders'

export default class extends BaseSeeder {
  async run() {
    const exists = await db
      .from('submissions')
      .where('file_name', 'patronus_essay.pdf')
      .first()

    if (!exists) {
      await db.table('submissions').insert([
        {
          assignment_id: 1,
          student_id: 3,
          file_name: 'patronus_essay.pdf',
        },
        {
          assignment_id: 2,
          student_id: 5,
          file_name: 'potion_analysis.docx',
        },
      ])
    }
  }
}