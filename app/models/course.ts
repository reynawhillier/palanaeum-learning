import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class Course extends BaseModel {
  static table = 'courses'

  @column({ isPrimary: true })
  declare courseId: number

  @column()
  declare courseCode: string

  @column()
  declare courseName: string

  @column()
  declare term: string | null

  @column()
  declare status: string | null

  @column()
  declare professorId: number

  @column()
  declare programId: number
}
