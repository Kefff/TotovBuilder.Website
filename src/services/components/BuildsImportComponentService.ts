import { IBuildSummary } from '../../models/utils/IBuildSummary'
import { IBuildsImportResult } from '../../models/utils/IBuildsImportResult'
import vueI18n from '../../plugins/vueI18n'
import Result from '../../utils/Result'
import { BuildPropertiesService } from '../BuildPropertiesService'
import { ImportService } from '../ImportService'
import { VersionService } from '../VersionService'
import Services from '../repository/Services'

/**
 * Represents a service responsible for managing a BuildsImportComponent.
 */
export class BuildsImportComponentService {
  public async readBuilds(buildFile: File | undefined): Promise<Result<IBuildsImportResult>> {
    const readenBuildSummaries: IBuildSummary[] = []

    if (buildFile == null) {
      return Result.ok()
    }

    const buildPropertiesService = Services.get(BuildPropertiesService)
    const builds = await Services.get(ImportService).getBuildsFromFile(buildFile)

    if (builds == null) {
      return Result.fail(vueI18n.t('message.importError'))
    }

    for (const build of builds) {
      await Services.get(VersionService).executeBuildMigrations(build) // Executing migrations on the build in case it is obsolete
      const summary = await buildPropertiesService.getSummary(build)

      readenBuildSummaries.push(summary)
    }

    return Result.ok({
      builds: builds,
      buildSummaries: readenBuildSummaries
    })
  }
}