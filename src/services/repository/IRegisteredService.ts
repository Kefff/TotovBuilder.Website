/**
 * Provides the functionalities of a service registered in the services repository.
 */
export interface IRegisteredService {
  /**
   * Instance of the service. Defined only when the service is a singleton.
   */
  instance: unknown | undefined

  /**
   * Name identifying the service.
   */
  name: string

  /**
   * Type of the service.
   */
  type: new () => unknown
}