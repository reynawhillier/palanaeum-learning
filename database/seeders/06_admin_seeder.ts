import Admin from '#models/admin'
import { BaseSeeder } from '@adonisjs/lucid/seeders'

export default class extends BaseSeeder {
  async run() {
    await Admin.firstOrCreate(
      {
        schoolId: 'A3001',
      },
      {
        schoolId: 'A3001',
        firstName: 'Albus',
        lastName: 'Dumbledore',
        email: 'dumbledore@school.ca',
        passwordHash: 'password123',
      }
    )
  }
}