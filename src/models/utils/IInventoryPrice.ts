import { IPrice } from '../item/IPrice'

/**
 * Provides the functionalities of an inventory price.
 */
export interface IInventoryPrice {

  /**
   * Indicates whether the price or one of its components is missing due to the merchant filters.
   */
  missingPrice: boolean

  /**
   * Price detailed by currency.
   */
  priceByCurrency: IPrice[]

  /**
   * Price in main currency.
   */
  priceInMainCurrency: IPrice
}