import vueI18n from '../../plugins/vueI18n'
import { IRegisteredService } from './IRegisteredService'

/**
 * Represents a repository for all the application services.
 */
class ServicesRepository {
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

      const warnWhenServiceReplaced = import.meta.env.VITE_WARN_WHEN_SERVICE_REPLACED === 'true'

      if (warnWhenServiceReplaced) {
        console.warn(vueI18n.t('message.serviceAlreadyConfigured', { name: serviceName }))
      }
    }
  }

  /**
   * Gets a configured service.
   * @param type - Type of the service.
   * @returns Instance of the service.
   * @throws When the service is not configured.
   */
  public get<T>(type: new () => T): T {
    let registeredService = this.services.find((s) => s.name === type.name)

    if (registeredService == null) {
      console.log(vueI18n.t('message.configuringService', { name: type.name }))
      this.configure(type)
      registeredService = this.services.find((s) => s.name === type.name)!
    }

    return this.getInstance(registeredService)
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
      throw vueI18n.t('message.serviceNotConfigured', { name })
    }
  }

  /**
   * Gets the instance of a service based on a registration.
   * @param registeredService - Service registration.
   * @returns Service instance.
   */
  private getInstance<T>(registeredService: IRegisteredService) {
    if (registeredService.instance == null) {
      registeredService.instance = new registeredService.type()
    }

    return registeredService.instance as T
  }
}

export default new ServicesRepository()

