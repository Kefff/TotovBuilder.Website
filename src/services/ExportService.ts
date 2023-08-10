import { IBuild } from '../models/build/IBuild'
import FileSaver from 'file-saver'
import vueI18n from '../plugins/vueI18n'
import Result, { FailureType } from '../utils/Result'
import Services from './repository/Services'
import { BuildService } from './BuildService'
import { WebsiteConfigurationService } from './WebsiteConfigurationService'

/**
 * Represents a service responsible for exporting builds.
 */
export class ExportService {
  /**
   * Exports a list of builds.
   * @param builds - Builds.
   */
  public async export(builds: IBuild[]): Promise<Result> {
    if (builds.length === 0) {
      // Should never occur
      return Result.fail(FailureType.error, 'ExportService.export()', vueI18n.t('message.noBuildsToExport'))
    }

    const websiteConfigurationService = Services.get(WebsiteConfigurationService)

    try {
      const json = JSON.stringify(builds)
      const blob = new Blob([json], { type: 'text/json;charset=utf-8' })
      const exportedBuildsName = builds.length === 1 ? builds[0].name : builds.length + ' ' + vueI18n.t('caption.builds')
      const fileName =
        websiteConfigurationService.configuration.exportFileNamePrefix
        + ' - ' + exportedBuildsName + ' - '
        + new Date().toLocaleString()
        + websiteConfigurationService.configuration.exportFileExtension
      FileSaver.saveAs(blob, fileName)
    }
    catch {
      return Result.fail(FailureType.error, 'ExportService.export()', vueI18n.t('message.buildsExportError'))
    }

    const buildService = Services.get(BuildService)

    for (const build of builds) {
      build.lastExported = new Date()
      const updateResult = await buildService.update(build.id, build)

      if (!updateResult.success) {
        return updateResult
      }
    }

    return Result.ok()
  }
}