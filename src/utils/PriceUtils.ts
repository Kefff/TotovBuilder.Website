import { IPrice } from '../models/item/IPrice'
import Services from '../services/repository/Services'
import { TarkovValuesService } from '../services/TarkovValuesService'

/**
 * Represents an utility class for managing prices.
 */
export class PriceUtils {
  /**
   * Sorts by currency
   * @param prices - Prices to sort.
   * @returns Sorted prices.
   */
  public static sortByCurrency(prices: IPrice[]): IPrice[] {
    prices = prices.sort((p1, p2) => {
      const tarkovValuesService = Services.get(TarkovValuesService)
      const p1Currency = tarkovValuesService.values.currencies.find(c => c.name === p1.currencyName)
      const p2Currency = tarkovValuesService.values.currencies.find(c => c.name === p2.currencyName)

      return (p1Currency?.sortOrder ?? 0) - (p2Currency?.sortOrder ?? 0)
    })

    return prices
  }
}