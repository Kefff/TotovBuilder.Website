import { IBuild } from '../../models/build/IBuild'
import { BuildService } from '../BuildService'
import { NotificationService, NotificationType } from '../NotificationService'
import vueI18n from '../../plugins/vueI18n'
import { Router } from 'vue-router'
import Services from '../repository/Services'
import Result from '../../utils/Result'

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
    router.push({ name: 'Builds' })
  }

  /**
   * Gets a build from an encoded string that can be shared in a URL.
   * @param sharableString - Encoded string that can be shared in a URL.
   * @returns Build.
   */
  public async getBuildFromSharableString(sharableString: string): Promise<Result<IBuild>> {
    const buildService = Services.get(BuildService)
    const buildResult = await buildService.fromSharableString(sharableString)

    if (!buildResult.success) {
      Services.get(NotificationService).notify(NotificationType.error, buildResult.failureMessage)
    }

    return buildResult
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

    const result = buildService.get(id)

    if (!result.success) {
      Services.get(NotificationService).notify(NotificationType.warning, result.failureMessage)

      return buildService.create()
    }

    return result.value
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
      router.push({ name: 'Build', params: { id: newBuildId } })
    } else {
      // Update
      const result = await buildService.update(build.id, build)

      if (!result.success) {
        notificationService.notify(NotificationType.error, result.failureMessage)

        return
      }
    }

    notificationService.notify(NotificationType.success, vueI18n.t('message.buildSaved', { name: build.name }))
  }
}