import { Router } from 'vue-router'
import { IBuild } from '../../models/build/IBuild'
import vueI18n from '../../plugins/vueI18n'
import { BuildService } from '../BuildService'
import { NotificationService, NotificationType } from '../NotificationService'
import Services from '../repository/Services'

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
  public async saveBuild(router: Router, build: IBuild): Promise<void> {
    const buildService = Services.get(BuildService)
    const notificationService = Services.get(NotificationService)

    if (build.id === '') {
      // New build
      const newBuildId = await buildService.add(build)
      void router.push({ name: 'Build', params: { id: newBuildId } })
    } else {
      // Update
      await buildService.update(build)
    }

    notificationService.notify(NotificationType.success, vueI18n.t('message.buildSaved', { name: build.name }))
  }
}