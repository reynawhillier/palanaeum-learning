import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class File extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare filename: string

  @column()
  declare filepath: string

  @column()
  declare filetype: string

  @column()
  declare filesize: number
}
