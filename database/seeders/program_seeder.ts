import Program from '#models/program'
import { BaseSeeder } from '@adonisjs/lucid/seeders'

export default class extends BaseSeeder {
  async run() {
    await Program.firstOrCreate(
      {
        programName: 'Magical Sciences',
      },
      {
        programName: 'Magical Sciences',
        departmentId: 1,
      }
    )

    await Program.firstOrCreate(
      {
        programName: 'Transfiguration Sciences',
      },
      {
        programName: 'Transfiguration Sciences',
        departmentId: 1,
      }
    )

    await Program.firstOrCreate(
      {
        programName: 'Dark Arts',
      },
      {
        programName: 'Dark Arts',
        departmentId: 3,
      }
    )

    await Program.firstOrCreate(
      {
        programName: 'Charm Design',
      },
      {
        programName: 'Charm Design',
        departmentId: 2,
      }
    )

    await Program.firstOrCreate(
      {
        programName: 'Potions',
      },
      {
        programName: 'Potions',
        departmentId: 4,
      }
    )
  }
}