import db from '@adonisjs/lucid/services/db'
import { BaseSeeder } from '@adonisjs/lucid/seeders'

export default class extends BaseSeeder {
  async run() {
    const exists = await db.from('enrollments').where('student_id', 1).where('course_id', 4).first()

    if (!exists) {
      await db.table('enrollments').insert([
        { student_id: 1, course_id: 4 },
        { student_id: 2, course_id: 4 },
        { student_id: 3, course_id: 1 },
        { student_id: 4, course_id: 3 },
        { student_id: 5, course_id: 2 },
      ])
    }
  }
}
