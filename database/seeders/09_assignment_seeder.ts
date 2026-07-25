import Assignment from '#models/assignment'
import { BaseSeeder } from '@adonisjs/lucid/seeders'
import { DateTime } from 'luxon'

export default class extends BaseSeeder {
  async run() {
    await Assignment.firstOrCreate(
      {
        title: 'Patronus Essay',
      },
      {
        courseId: 1,
        title: 'Patronus Essay',
        description: 'Write a 1000 word essay on Patronus Charm.',
        dueDate: DateTime.fromISO('2026-07-15'),
      }
    )

    await Assignment.firstOrCreate(
      {
        title: 'Potion Analysis',
      },
      {
        courseId: 2,
        title: 'Potion Analysis',
        description: 'Analyze the effects of Polyjuice Potion.',
        dueDate: DateTime.fromISO('2026-07-20'),
      }
    )

    await Assignment.firstOrCreate(
      {
        title: 'Wingardium Leviosa Practice',
      },
      {
        courseId: 3,
        title: 'Wingardium Leviosa Practice',
        description: 'Demonstrate proper levitation technique.',
        dueDate: DateTime.fromISO('2026-07-25'),
      }
    )
  }
}