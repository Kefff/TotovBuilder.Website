import { IItem } from '../../models/item/IItem'
import { IPrice } from '../../models/utils/IPrice'
import { IItemReaderService } from './IItemReaderService'

/**
 * Represents a base class for a reader that populates an item properties from Tarkov item data.
 */
export abstract class BaseItemReaderService<T extends IItem> implements IItemReaderService<T> {
  /**
   * {@inheritDoc IItemReaderService.read}
   */
  public async read(tarkovItem: Record<string, unknown>, categoryId: string, itemToPopulate?: IItem): Promise<T> {
    let item: T

    if (itemToPopulate !== undefined) {
      item = itemToPopulate as T
    } else {
      item = {} as T
    }

    const props = tarkovItem['_props'] as Record<string, unknown>

    item.caption = props['Name'] as string
    item.categoryId = categoryId
    item.conflictingItemIds = props['ConflictingItems'] as string[]
    item.description = props['Description'] as string
    item.id = tarkovItem['_id'] as string
    item.maxStackableAmount = props['StackMaxSize'] as number
    item.name = tarkovItem['_name'] as string
    item.prices = []
    item.weight = props['Weight'] as number

    return item
  }

  /**
   * {@inheritDoc IItemReaderService.readMarketData}
   */
  public async readMarketData(marketData: Record<string, unknown>, itemToPopulate: T): Promise<T> {
    itemToPopulate.hasMarketData = true
    itemToPopulate.caption = marketData['name'] as string
    itemToPopulate.iconLink = marketData['iconLink'] as string
    itemToPopulate.imageLink = marketData['imageLink'] as string
    itemToPopulate.marketLink = marketData['link'] as string
    itemToPopulate.shortName = marketData['shortName'] as string
    itemToPopulate.wikiLink = marketData['wikiLink'] as string

    const prices: IPrice[] = []

    for (const marketPrice of marketData['buyFor'] as Record<string, unknown>[]) {
      const value = marketPrice['price'] as number
      const price: IPrice = {
        currencyName: marketPrice['currency'] as string,
        merchant: marketPrice['source'] as string,
        merchantLevel: undefined,
        requiresQuest: false,
        value,
        valueInMainCurrency: 0
      }

      if (price.merchant !== 'fleaMarket') {
        const merchantRequirement = (marketPrice['requirements'] as Record<string, unknown>[]).find(r => r['type'] === 'loyaltyLevel') as Record<string, unknown>
        const merchantLevel = merchantRequirement['value'] as number
        price.merchantLevel = merchantLevel

        const questRequirement = (marketPrice['requirements'] as Record<string, unknown>[]).find(r => r['type'] === 'questCompleted') as Record<string, unknown> | undefined
        price.requiresQuest = questRequirement != undefined
      }

      prices.push(price)
    }

    if (prices.length > 0) {
      itemToPopulate.prices = prices
    }

    return itemToPopulate
  }
}