import { Router } from 'vue-router'
import { IBuild } from '../../models/build/IBuild'
import vueI18n from '../../plugins/vueI18n'
import { BuildService } from '../BuildService'
import { GeneralOptionsService } from '../GeneralOptionsService'
import { NotificationService, NotificationType } from '../NotificationService'
import Services from '../repository/Services'
import { WebsiteConfigurationService } from '../WebsiteConfigurationService'

/**
 * Represents a service responsible for managing a BuildComponent.
 */
export class BuildComponentService {
  /**
   * Deletes build
   * @param router - Router used to redirect to the list of builds after the build is deleted.
   * @param build - Build to delete.
   */
  public deleteBuild(router: Router, build: IBuild): void {
    const buildService = Services.get(BuildService)
    const notificationService = Services.get(NotificationService)
    const buildName = build.name

    buildService.delete(build.id)
    notificationService.notify(NotificationType.information, vueI18n.t('message.buildDeleted', { name: buildName }))
    void router.push({ name: 'Builds' })
  }

  /**
   * Gets the build to edit.
   * @param id - ID of the build to get.
   * @returns Found build, or an empty build if creating a new build or an error occurs.
   */
  public getBuild(id: string | undefined): IBuild {
    const buildService = Services.get(BuildService)

    if (id == null) {
      return buildService.create()
    }

    const build = buildService.get(id)

    if (build == null) {
      // If the build cannot be found, we create a new build
      return buildService.create()
    }

    return build
  }

  /**
   * Saves the build.
   * @param router - Router used to redirect to the creation of a new build when the build corresponding to the ID is not found.
   * @param build - Build to save.
   */
  public async saveBuildAsync(router: Router, build: IBuild): Promise<void> {
    const buildService = Services.get(BuildService)
    const lastSharableUrl = build.sharabledUrl

    if (lastSharableUrl != null) {
      build.sharabledUrl = undefined // Resetting the sharable URL because changes may have been made
    }

    if (build.id === '') {
      // New build
      const newBuildId = await buildService.addAsync(build)
      void router.push({ name: 'Build', params: { id: newBuildId } })
    } else {
      // Update
      await buildService.updateAsync(build)
    }

    this.displaySaveNotifications(build.name, lastSharableUrl)
  }

  /**
   * Displays notifications for alerting the user that the build has been saved.
   * @param buildName - buildName Name of the build.
   * @param lastSharableUrl - lastSharableUrl Last sharable URL of the build.
   */
  private displaySaveNotifications(buildName: string, lastSharableUrl: string | undefined): void {
    const notificationService = Services.get(NotificationService)
    notificationService.notify(NotificationType.success, vueI18n.t('message.buildSaved', { name: buildName }))

    if (lastSharableUrl != null) {
      const outdatedSharableUrlWarning = Services.get(GeneralOptionsService).getOutdatedSharableUrlWarningOption()

      if (!outdatedSharableUrlWarning) {
        return
      }

      const websiteConfigurationService = Services.get(WebsiteConfigurationService)
      notificationService.notify(
        NotificationType.warning,
        vueI18n.t('message.buildSharableUrlOutdated'),
        undefined,
        undefined,
        undefined,
        websiteConfigurationService.configuration.outdatedSharableUrlWarningStorageKey
      )
    }
  }
}