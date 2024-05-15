import { TinyEmitter } from 'tiny-emitter'

/**
 * Represents a service responsible for managing a GeneralOptionsComponent.
 */
export class GeneralOptionsComponentService {
  /**
   * Name of the event fired to ask the general options to open.
   */
  public static openGeneralOptionsEvent = 'openGeneralOptions'

  /**
   * Event emitter used to open the general options.
   */
  public emitter = new TinyEmitter()

  /**
   * Displays the general options.
   */
  public display() {
    this.emitter.emit(GeneralOptionsComponentService.openGeneralOptionsEvent)
  }
}