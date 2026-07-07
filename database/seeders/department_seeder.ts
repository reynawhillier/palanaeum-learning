import db from '@adonisjs/lucid/services/db'
import { BaseSeeder } from '@adonisjs/lucid/seeders'

export default class extends BaseSeeder {
  async run() {
    const exists = await db
      .from('departments')
      .where('department_name', 'Transfiguration')
      .first()

    if (!exists) {
      await db.table('departments').insert([
        { department_name: 'Transfiguration' },
        { department_name: 'Charms' },
        { department_name: 'Dark Arts' },
        { department_name: 'Potions' },
      ])
    }
  }
}