import { IBuildSummary } from '../../models/utils/IBuildSummary'
import { IBuildsImportResult } from '../../models/utils/IBuildsImportResult'
import vueI18n from '../../plugins/vueI18n'
import { BuildPropertiesService } from '../BuildPropertiesService'
import { ImportService } from '../ImportService'
import { LogService } from '../LogService'
import { NotificationService, NotificationType } from '../NotificationService'
import { VersionService } from '../VersionService'
import Services from '../repository/Services'

/**
 * Represents a service responsible for managing a BuildsImportComponent.
 */
export class BuildsImportComponentService {
  /**
   * Reads builds from a file.
   * Displays an error notification when builds could not be imported.
   * @param buildFile - File.
   * @returns Imported builds.
   */
  public async readBuilds(buildFile: File | undefined): Promise<IBuildsImportResult | undefined> {
    if (buildFile == null) {
      Services.get(LogService).logError('message.invalidBuildFile')
      Services.get(NotificationService).notify(NotificationType.error, vueI18n.t('message.importError'))

      return undefined
    }

    const buildPropertiesService = Services.get(BuildPropertiesService)

    const readenBuildSummaries: IBuildSummary[] = []
    const builds = await Services.get(ImportService).getBuildsFromFile(buildFile)

    if (builds == null) {
      Services.get(NotificationService).notify(NotificationType.error, vueI18n.t('message.importError'))

      return undefined
    }

    for (const build of builds) {
      await Services.get(VersionService).executeBuildMigrations(build) // Executing migrations on the build in case it is obsolete
      const summary = await buildPropertiesService.getSummary(build)

      readenBuildSummaries.push(summary)
    }

    return {
      builds: builds,
      buildSummaries: readenBuildSummaries
    }
  }
}