import Student from '#models/student'
import { BaseSeeder } from '@adonisjs/lucid/seeders'

export default class extends BaseSeeder {
  async run() {
    await Student.firstOrCreate(
      { schoolId: 'S1001' },
      {
        schoolId: 'S1001',
        firstName: 'James',
        lastName: 'Potter',
        email: 'potter@school.ca',
        passwordHash: 'password123',
        programId: 1,
      }
    )

    await Student.firstOrCreate(
      { schoolId: 'S1004' },
      {
        schoolId: 'S1004',
        firstName: 'Sirius',
        lastName: 'Black',
        email: 'black@school.ca',
        passwordHash: 'password123',
        programId: 2,
      }
    )

    await Student.firstOrCreate(
      { schoolId: 'S1005' },
      {
        schoolId: 'S1005',
        firstName: 'Remus',
        lastName: 'Lupin',
        email: 'lupin@school.ca',
        passwordHash: 'password123',
        programId: 3,
      }
    )

    await Student.firstOrCreate(
      { schoolId: 'S1006' },
      {
        schoolId: 'S1006',
        firstName: 'Peter',
        lastName: 'Pettigrew',
        email: 'pettigrew@school.ca',
        passwordHash: 'password123',
        programId: 4,
      }
    )

    await Student.firstOrCreate(
      { schoolId: 'S1007' },
      {
        schoolId: 'S1007',
        firstName: 'Severus',
        lastName: 'Snape',
        email: 'snape@school.ca',
        passwordHash: 'password123',
        programId: 5,
      }
    )
  }
}