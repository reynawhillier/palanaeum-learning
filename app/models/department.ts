import Department from '#models/department'
import { BaseSeeder } from '@adonisjs/lucid/seeders'

export default class extends BaseSeeder {
  async run() {
    const departments = [
      { departmentName: 'Transfiguration' },
      { departmentName: 'Charms' },
      { departmentName: 'Dark Arts' },
      { departmentName: 'Potions' },
    ]

    for (const department of departments) {
      await Department.firstOrCreate(department)
    }
  }
}