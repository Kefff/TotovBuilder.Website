import { TinyEmitter } from 'tiny-emitter'

/**
 * Represents a service responsible for managing a MerchantItemsOptionsComponent.
 */
export class MerchantItemsOptionsComponentService {
  /**
   * Name of the event fired to ask the merchant and items options to open.
   */
  public static openMerchantItemsOptionsEvent = 'openMerchantItemsOptions'

  /**
   * Event emitter used to open the merchant and items options.
   */
  public emitter = new TinyEmitter()

  /**
   * Displays the merchant and items options.
   */
  public display() {
    this.emitter.emit(MerchantItemsOptionsComponentService.openMerchantItemsOptionsEvent)
  }
}