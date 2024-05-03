import { IBuild } from '../models/build/IBuild'
import vueI18n from '../plugins/vueI18n'
import { BuildService } from './BuildService'
import { LogService } from './LogService'
import Services from './repository/Services'

/**
 * Represents a service responsible for importing builds.
 */
export class ImportService {
  /**
   * Gets the builds from a file.
   * @param file - File.
   * @returns Builds contained in the file.
   */
  /* c8 ignore start */
  public getBuildsFromFile(file: File): Promise<IBuild[] | undefined> {
    const fileReadingPromise = new Promise<IBuild[] | undefined>((resolve) => {
      const fileReader = new FileReader()
      fileReader.onloadend = () => {
        const builds = this.readFile(fileReader)
        resolve(builds)
      }
      fileReader.readAsText(file)
    })

    return fileReadingPromise
  }
  /* c8 ignore stop */

  /**
   * Imports builds.
   * @param builds - Builds to import.
   */
  public async import(builds: IBuild[]): Promise<void> {
    const buildService = Services.get(BuildService)

    for (const build of builds) {
      await buildService.add(build)
    }
  }

  /**
   * Reads builds from a file.
   * @param fileReader - File reader.
   * @returns file - Builds.
   */
  /* c8 ignore start */
  private readFile(fileReader: FileReader): IBuild[] | undefined {
    if (fileReader.error != null) {
      Services.get(LogService).logError(vueI18n.t('message.importError'))

      return undefined
    }

    const builds = JSON.parse(fileReader.result as string) as IBuild[]

    if (builds == null) {
      Services.get(LogService).logError(vueI18n.t('message.importError'))

      return undefined
    }

    const importDate = new Date()

    for (const build of builds) {
      build.lastExported = importDate // Setting the same date for lastExported and lastUpdated so we don't have export warnings
      build.lastUpdated = importDate
    }

    return builds
  }
  /* c8 ignore stop */
}