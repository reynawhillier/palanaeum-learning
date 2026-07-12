// Basic model that represents an assignment record in the database
import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class Assignment extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public title: string

  @column()
  public description: string

  @column.date()
  public dueDate: Date
}
