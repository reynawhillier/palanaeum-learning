import type { HttpContext } from '@adonisjs/core/http'
import File from '#models/file'

export default class UploadController {
  async store({ request, response }: HttpContext) {
    try {
      const file = request.file('file', {
        size: '5mb',
        extnames: ['jpg', 'png', 'pdf', 'docx'],
      })

      if (!file) {
        return response.status(400).json({ error: 'No file uploaded' })
      }

      if (!file.isValid) {
        return response.status(400).json({ error: file.errors })
      }

      await file.moveToDisk('./uploads')

      const savedFile = await File.create({
        filename: file.clientName,
        filepath: file.filePath || '',
        filetype: file.extname || '',
        filesize: file.size || 0,
      })

      return response.status(200).json({
        message: 'File uploaded successfully',
        file: savedFile,
      })
    } catch (error) {
      console.error(error)
      return response.status(500).json({ error: 'Unexpected server error' })
    }
  }
}
