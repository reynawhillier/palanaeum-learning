import factory from '@adonisjs/lucid/factories'
import User from '#models/user'

export const UserFactory = factory
  .define(User, async ({ faker }) => {
    // static $columns = ['createdAt', 'email', 'fullName', 'id', 'password', 'updatedAt'] as const
    return {
      fullName: faker.person.fullName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
    }
  })
  .build()
