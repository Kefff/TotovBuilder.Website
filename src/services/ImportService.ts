import { IBuild } from '../models/build/IBuild'
import { BuildService } from './BuildService'
import Services from './repository/Services'
import vueI18n from '../plugins/vueI18n'
import Result, { FailureType } from '../utils/Result'
import { VersionService } from './VersionService'

/**
 * Represents a service responsible for importing builds.
 */
export class ImportService {
  /**
   * Gets the builds from a file.
   * @param file - File.
   * @returns Builds contained in the file.
   */
  /* istanbul ignore next */
  public async getBuildsFromFile(file: File): Promise<Result<IBuild[]>> {
    return new Promise<Result<IBuild[]>>((resolve) => {
      const fileReader = new FileReader()
      fileReader.onloadend = () => {
        const buildsResult = this.readFile(fileReader)
        resolve(buildsResult)
      }
      fileReader.readAsText(file)
    })
  }

  /**
   * Imports builds.
   * @param builds - Builds to import.
   */
  public async import(builds: IBuild[]): Promise<void> {
    const buildService = Services.get(BuildService)
    const importDate = new Date()

    for (const build of builds) {
      Services.get(VersionService).executeBuildMigrations(build) // Executing migrations on the build in case it is obsolete
      build.lastExported = importDate
      await buildService.add(build)
    }
  }

  /**
   * Reads builds from a file.
   * @param fileReader - File reader.
   * @returns file - Builds.
   */
  /* istanbul ignore next */
  private readFile(fileReader: FileReader): Result<IBuild[]> {
    if (fileReader.error != null) {
      return Result.fail(FailureType.error, vueI18n.t('message.importReadFileError'))
    }

    const builds = JSON.parse(fileReader.result as string) as IBuild[]

    if (builds == null) {
      return Result.fail(FailureType.error, vueI18n.t('message.importReadFileError'))
    }

    return Result.ok(builds)
  }
}