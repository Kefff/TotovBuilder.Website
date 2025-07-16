import { TinyEmitter } from 'tiny-emitter'
import { IBuild } from '../models/build/IBuild'
import vueI18n from '../plugins/vueI18n'
import { BuildService } from './BuildService'
import { FileService } from './FileService'
import { LogService } from './LogService'
import { NotificationService, NotificationType } from './NotificationService'
import Services from './repository/Services'
import { VersionService } from './VersionService'

/**
 * Represents a service responsible for importing builds.
 */
export class ImportService {
  /**
   * Name of the event fired when builds have been imported.
   */
  public static buildsImportedEvent = 'buildsImported'

  /**
   * Event emitter used to indicate an export has succeeded.
   */
  public emitter = new TinyEmitter()

  /**
   * Gets the builds from a file.
   * @param file - File.
   * @returns Builds contained in the file.
   */
  public async getBuildsFromFileAsync(file: File | undefined): Promise<IBuild[] | undefined> {
    if (file == null) {
      Services.get(LogService).logError('message.invalidBuildFile')
      Services.get(NotificationService).notify(NotificationType.error, vueI18n.t('message.importError'))

      return undefined
    }

    const fileContent = await Services.get(FileService).readFile(file)

    if (fileContent == null) {
      return undefined
    }

    const builds = this.parseBuilds(fileContent)

    if (builds == null || builds.length === 0) {
      return undefined
    }

    const versionService = Services.get(VersionService)

    for (const build of builds) {
      await versionService.executeBuildMigrationsAsync(build)
    }

    return builds
  }

  /**
   * Imports builds.
   * @param builds - Builds to import.
   */
  public async importAsync(builds: IBuild[]): Promise<void> {
    const buildService = Services.get(BuildService)

    for (const build of builds) {
      await buildService.addAsync(build)
    }

    this.emitter.emit(ImportService.buildsImportedEvent)
    Services.get(NotificationService).notify(NotificationType.success, vueI18n.t('message.buildsImported'))
  }

  /**
   * Reads builds from a file.
   * @param fileReader - File reader.
   * @returns file - Builds.
   */
  private parseBuilds(fileContent: string): IBuild[] | undefined {
    let builds: IBuild[] | undefined

    try {
      builds = JSON.parse(fileContent) as IBuild[]
    }
    catch {
      // Do nothing
    }

    if (builds == null || builds.length == null) {
      Services.get(LogService).logError('message.importError')
      Services.get(NotificationService).notify(NotificationType.error, vueI18n.t('message.importError'))

      return undefined
    }

    const importDate = new Date()

    for (const build of builds) {
      build.lastExported = importDate // Setting the same date for lastExported and lastUpdated so we don't have export warnings
      build.lastUpdated = importDate
    }

    return builds
  }
}