import FileSaver from 'file-saver'
import vueI18n from '../plugins/vueI18n'
import { LogService } from './LogService'
import { NotificationService, NotificationType } from './NotificationService'
import Services from './repository/Services'

/**
 * Represents service for handling files.
 */
export class FileService {
  /**
   * Reads a file and returns its content as a string.
   * @param file - File.
   * @returns File content as a string or undefined if an error occurs.
   */
  public readFile(file: File): Promise<string | undefined> {
    const fileReadingPromise = new Promise<string | undefined>(resolve => {
      const fileReader = new FileReader()
      fileReader.onloadend = (): void => {
        const fileContent = this.readFileContent(fileReader)
        resolve(fileContent)
      }
      fileReader.readAsText(file)
    })

    return fileReadingPromise
  }

  /**
   * Writes a file.
   * @param fileName - File name.
   * @param content - File content.
   * @param contentType - File content type. "text/json" by default.
   * @returns - `true` when the file has been saved successfully; otherwise `false`.
   */
  public writeFile(fileName: string, content: string, contentType: string = 'text/json;charset=utf-8'): boolean {
    try {
      const blob = new Blob([content], { type: contentType })
      FileSaver.saveAs(blob, fileName)

      return true
    }
    catch (e) {
      Services.get(LogService).logException('message.fileWritingException', { message: (e as Error).message })
      Services.get(NotificationService).notify(NotificationType.error, vueI18n.t('message.fileWritingError'))

      return false
    }
  }

  /**
 * Reads the content of a file and returns it as a string.
 * @param fileReader - File reader.
 * @returns - File content as a string or undefined if an error occurs.
 */
  private readFileContent(fileReader: FileReader): string | undefined {
    if (fileReader.error != null) {
      Services.get(LogService).logException('message.fileReadingException', { message: fileReader.error })
      Services.get(NotificationService).notify(NotificationType.error, vueI18n.t('message.fileReadingError'))

      return undefined
    }

    return fileReader.result as string
  }
}