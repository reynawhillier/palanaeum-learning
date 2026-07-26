import Student from '#models/student'
import User from '#models/user'
import { BaseSeeder } from '@adonisjs/lucid/seeders'

export default class extends BaseSeeder {
  async run() {
    const students = [
      {
        schoolId: 'S1001',
        firstName: 'James',
        lastName: 'Potter',
        email: 'potter@school.ca',
        passwordHash: 'password123',
        programId: 1,
      },
      {
        schoolId: 'S1004',
        firstName: 'Sirius',
        lastName: 'Black',
        email: 'black@school.ca',
        passwordHash: 'password123',
        programId: 2,
      },
      {
        schoolId: 'S1005',
        firstName: 'Remus',
        lastName: 'Lupin',
        email: 'lupin@school.ca',
        passwordHash: 'password123',
        programId: 3,
      },
      {
        schoolId: 'S1006',
        firstName: 'Peter',
        lastName: 'Pettigrew',
        email: 'pettigrew@school.ca',
        passwordHash: 'password123',
        programId: 4,
      },
      {
        schoolId: 'S1007',
        firstName: 'Severus',
        lastName: 'Snape',
        email: 'snape@school.ca',
        passwordHash: 'password123',
        programId: 5,
      },
    ]

    for (const studentData of students) {
      const user = await User.findByOrFail('email', studentData.email)

      await Student.updateOrCreate(
        { schoolId: studentData.schoolId },
        {
          userId: user.id,
          schoolId: studentData.schoolId,
          firstName: studentData.firstName,
          lastName: studentData.lastName,
          email: studentData.email,
          passwordHash: studentData.passwordHash,
          programId: studentData.programId,
        }
      )
    }
  }
}