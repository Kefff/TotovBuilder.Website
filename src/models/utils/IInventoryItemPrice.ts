import { IPrice } from '../item/IPrice'
import { IgnoredUnitPrice } from './IgnoredUnitPrice'

/**
 * Provides the functionalities of an inventory price.
 * Specifically for inventory items, includes the dinstinction between with and without content / mods.
 */
export interface IInventoryItemPrice {

  /**
   * Indicates whether the price or one of its components is missing due to the merchant filters.
   */
  missingPrice: boolean

  /**
   * Price.
   */
  price: IPrice

  /**
   * Price with content and mods.
   */
  pricesWithContent: IPrice[]

  /**
   * Price with content and mods in main currency.
   */
  priceWithContentInMainCurrency: number

  /**
   * Unit price.
   */
  unitPrice: IPrice

  /**
   * Status indicating why the unit price is ignored.
   */
  unitPriceIgnoreStatus: IgnoredUnitPrice
}