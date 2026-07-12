import Department from '#models/department'
import { BaseSeeder } from '@adonisjs/lucid/seeders'

export default class extends BaseSeeder {
  async run() {
    await Department.firstOrCreate({
      departmentName: 'Transfiguration',
    })

    await Department.firstOrCreate({
      departmentName: 'Charms',
    })

    await Department.firstOrCreate({
      departmentName: 'Dark Arts',
    })

    await Department.firstOrCreate({
      departmentName: 'Potions',
    })
  }
}