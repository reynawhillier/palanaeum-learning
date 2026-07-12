import Professor from '#models/professor'
import { BaseSeeder } from '@adonisjs/lucid/seeders'

export default class extends BaseSeeder {
  async run() {
    await Professor.firstOrCreate(
      {
        schoolId: 'P2001',
      },
      {
        schoolId: 'P2001',
        firstName: 'Minerva',
        lastName: 'McGonagall',
        email: 'mcgonagall@school.ca',
        passwordHash: 'password123',
        departmentId: 1,
      }
    )

    await Professor.firstOrCreate(
      {
        schoolId: 'P2002',
      },
      {
        schoolId: 'P2002',
        firstName: 'Filius',
        lastName: 'Flitwick',
        email: 'flitwick@school.ca',
        passwordHash: 'password234',
        departmentId: 2,
      }
    )

    await Professor.firstOrCreate(
      {
        schoolId: 'P2003',
      },
      {
        schoolId: 'P2003',
        firstName: 'Ahsen',
        lastName: 'Ucler',
        email: 'ucler@school.ca',
        passwordHash: 'password245',
        departmentId: 3,
      }
    )

    await Professor.firstOrCreate(
      {
        schoolId: 'P2004',
      },
      {
        schoolId: 'P2004',
        firstName: 'Horace',
        lastName: 'Slughorn',
        email: 'slughorn@school.ca',
        passwordHash: 'password245',
        departmentId: 4,
      }
    )
  }
}