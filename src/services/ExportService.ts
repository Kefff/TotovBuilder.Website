import { TinyEmitter } from 'tiny-emitter'
import { IBuild } from '../models/build/IBuild'
import vueI18n from '../plugins/vueI18n'
import { BuildService } from './BuildService'
import { FileService } from './FileService'
import { NotificationService, NotificationType } from './NotificationService'
import { WebsiteConfigurationService } from './WebsiteConfigurationService'
import Services from './repository/Services'

/**
 * Represents a service responsible for exporting builds.
 */
export class ExportService {
  /**
   * Name of the event fired when builds have been exported.
   */
  public static buildsExportedEvent = 'buildsExported'

  /**
   * Event emitter used to indicate an export has succeeded.
   */
  public emitter = new TinyEmitter()

  /**
   * Exports a list of builds.
   * Displays a notification indicating whether export has succeeded.
   * @param builds - Builds.
   */
  public async export(builds: IBuild[]) {
    const websiteConfigurationService = Services.get(WebsiteConfigurationService)

    const json = JSON.stringify(builds)
    const exportedBuildsName = builds.length === 1 ? builds[0].name : builds.length + ' ' + vueI18n.t('caption.builds')
    const fileName =
      websiteConfigurationService.configuration.exportFileNamePrefix
      + ' - ' + exportedBuildsName + ' - '
      + new Date().toLocaleString()
      + websiteConfigurationService.configuration.exportFileExtension
    const fileSaved = Services.get(FileService).writeFile(fileName, json)

    if (!fileSaved) {
      return
    }

    const buildService = Services.get(BuildService)

    for (const build of builds) {
      build.lastExported = new Date()
      await buildService.update(build)
    }

    this.emitter.emit(ExportService.buildsExportedEvent)
    Services.get(NotificationService).notify(NotificationType.success, vueI18n.t('message.buildsExported'))
  }
}