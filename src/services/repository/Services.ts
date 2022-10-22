import i18n from '../../plugins/vueI18n'
import { IRegisteredService } from './IRegisteredService'
import Configuration from '../../../test-data/configuration.json'
import { TinyEmitter } from 'tiny-emitter'

/**
 * Represents a repository for all the application services.
 */
class ServicesRepository {
  /**
   * Emitter used to signal when the initialization is done.
   */
  public emitter = new TinyEmitter()

  /**
   * Determines whether the services are initializing or not.
   */
  public isInitializing = false

  /**
   * Collection of the configured services.
   */
  public services: IRegisteredService[] = []

  /**
   * Configures a new service, or replaces an registered service with the same type or name.
   * @param type - Type of the service.
   * @param name - Custom identifier in case the type name cannot be used (for example when multiple services can be configured for the same role depending on a configuration).
   * @param instance - Instance to return when the service is requested. Mostly used for mocks while unit testing.
   */
  public configure<T>(type: new () => T, name?: string, instance?: T) {
    const serviceName = name ?? type.name
    const index = this.services.findIndex((s) => s.name === serviceName)

    if (index < 0) {
      this.services.push({
        instance,
        name: name ?? type.name,
        type
      })
    } else {
      this.services[index] = {
        instance,
        name: name ?? type.name,
        type
      }

      const warnWhenServiceReplaced = Configuration.VITE_WARN_WHEN_SERVICE_REPLACED === 'true'

      if (warnWhenServiceReplaced) {
        console.warn(i18n.t('message.serviceAlreadyConfigured', { name: serviceName }))
      }
    }
  }

  /**
   * Gets a configured service.
   * @param type - Type of the service.
   * @returns Instance of the service.
   */
  public get<T>(type: new () => T): T {
    const registeredService = this.services.find((s) => s.name === type.name)

    if (registeredService != null) {
      return this.getInstance(registeredService)
    } else {
      throw i18n.t('message.serviceNotConfigured', { name: type.name })
    }
  }

  /**
   * Gets a configured service by its name.
   * @param name - Name of the service.
   * @returns Instance of the service.
   */
  public getByName<T>(name: string): T {
    const registeredService = this.services.find((s) => s.name === name)

    if (registeredService != null) {
      return this.getInstance(registeredService)
    } else {
      throw i18n.t('message.serviceNotConfigured', { name })
    }
  }

  /**
   * Gets the instance of a service based on a registration.
   * @param registeredService - Service registration.
   * @returns Service instance.
   */
  private getInstance<T>(registeredService: IRegisteredService) {
    if (registeredService.instance === undefined) {
      registeredService.instance = new registeredService.type()
    }

    return registeredService.instance as T
  }
}

export default new ServicesRepository()

