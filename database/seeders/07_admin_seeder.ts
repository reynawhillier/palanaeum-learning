import Admin from '#models/admin'
import User from '#models/user'
import { BaseSeeder } from '@adonisjs/lucid/seeders'

export default class extends BaseSeeder {
  async run() {
    const email = 'dumbledore@school.ca'
    const user = await User.findByOrFail('email', email)

    await Admin.updateOrCreate(
      { schoolId: 'A3001' },
      {
        userId: user.id,
        schoolId: 'A3001',
        firstName: 'Albus',
        lastName: 'Dumbledore',
        email,
        passwordHash: 'password123',
      }
    )
  }
}