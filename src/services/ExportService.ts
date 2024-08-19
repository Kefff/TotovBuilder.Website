import FileSaver from 'file-saver'
import { IBuild } from '../models/build/IBuild'
import vueI18n from '../plugins/vueI18n'
import { BuildService } from './BuildService'
import { LogService } from './LogService'
import { NotificationService, NotificationType } from './NotificationService'
import { WebsiteConfigurationService } from './WebsiteConfigurationService'
import Services from './repository/Services'

/**
 * Represents a service responsible for exporting builds.
 */
export class ExportService {
  /**
   * Exports a list of builds.
   * Displayes a notification indicating whether export has succeeded.
   * @param builds - Builds.
   */
  public async export(builds: IBuild[]) {
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
      Services.get(LogService).logError('message.buildsExportError')
      Services.get(NotificationService).notify(NotificationType.error, vueI18n.t('message.buildsExportError'))

      return
    }

    const buildService = Services.get(BuildService)

    for (const build of builds) {
      build.lastExported = new Date()
      await buildService.update(build)
    }

    Services.get(NotificationService).notify(NotificationType.success, vueI18n.t('message.buildsExported'))
  }
}