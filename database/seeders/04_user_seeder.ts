import User from '#models/user'
import { BaseSeeder } from '@adonisjs/lucid/seeders'

export default class extends BaseSeeder {
  async run() {
    const users = [
      {
        fullName: 'Minerva McGonagall',
        email: 'mcgonagall@school.ca',
        password: 'password123',
      },
      {
        fullName: 'Filius Flitwick',
        email: 'flitwick@school.ca',
        password: 'password234',
      },
      {
        fullName: 'Ahsen Ucler',
        email: 'ucler@school.ca',
        password: 'password245',
      },
      {
        fullName: 'Horace Slughorn',
        email: 'slughorn@school.ca',
        password: 'password245',
      },
      {
        fullName: 'James Potter',
        email: 'potter@school.ca',
        password: 'password123',
      },
      {
        fullName: 'Sirius Black',
        email: 'black@school.ca',
        password: 'password123',
      },
      {
        fullName: 'Remus Lupin',
        email: 'lupin@school.ca',
        password: 'password123',
      },
      {
        fullName: 'Peter Pettigrew',
        email: 'pettigrew@school.ca',
        password: 'password123',
      },
      {
        fullName: 'Severus Snape',
        email: 'snape@school.ca',
        password: 'password123',
      },
      {
        fullName: 'Albus Dumbledore',
        email: 'dumbledore@school.ca',
        password: 'password123',
      },
    ]

    for (const userData of users) {
      const existingUser = await User.findBy('email', userData.email)

      if (!existingUser) {
        await User.create({
          fullName: userData.fullName,
          email: userData.email,
          password: userData.password,
        })
      }
    }
  }
}
