import Professor from '#models/professor'
import User from '#models/user'
import { BaseSeeder } from '@adonisjs/lucid/seeders'

export default class extends BaseSeeder {
  async run() {
    const professors = [
      {
        schoolId: 'P2001',
        firstName: 'Minerva',
        lastName: 'McGonagall',
        email: 'mcgonagall@school.ca',
        passwordHash: 'password123',
        departmentId: 1,
      },
      {
        schoolId: 'P2002',
        firstName: 'Filius',
        lastName: 'Flitwick',
        email: 'flitwick@school.ca',
        passwordHash: 'password234',
        departmentId: 2,
      },
      {
        schoolId: 'P2003',
        firstName: 'Ahsen',
        lastName: 'Ucler',
        email: 'ucler@school.ca',
        passwordHash: 'password245',
        departmentId: 3,
      },
      {
        schoolId: 'P2004',
        firstName: 'Horace',
        lastName: 'Slughorn',
        email: 'slughorn@school.ca',
        passwordHash: 'password245',
        departmentId: 4,
      },
    ]

    for (const professorData of professors) {
      const user = await User.findByOrFail('email', professorData.email)

      await Professor.updateOrCreate(
        { schoolId: professorData.schoolId },
        {
          userId: user.id,
          schoolId: professorData.schoolId,
          firstName: professorData.firstName,
          lastName: professorData.lastName,
          email: professorData.email,
          passwordHash: professorData.passwordHash,
          departmentId: professorData.departmentId,
        }
      )
    }
  }
}
