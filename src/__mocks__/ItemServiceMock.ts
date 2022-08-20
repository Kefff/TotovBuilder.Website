import { anyString, instance, mock, when } from 'ts-mockito'
import { ItemService } from '../services/ItemService'
import ItemMocks from '../../test-data/items.json'
import PriceMocks from '../../test-data/prices.json'
import Services from '../services/repository/Services'
import Result, { FailureType } from '../utils/Result'
import { ICurrency } from '../models/configuration/ICurrency'
import { IItem } from '../models/item/IItem'
import ItemCategoriesMock from '../../test-data/item-categories.json'

export function useItemServiceMock(hasMainCurrency = true): void {
  const itemServiceMock = mock<ItemService>()
  when(itemServiceMock.getItem(anyString())).thenCall((id: string) => getItem(id))
  when(itemServiceMock.getMainCurrency()).thenCall(() => getMainCurrency(hasMainCurrency))
  when(itemServiceMock.getItemCategories()).thenReturn(Promise.resolve(ItemCategoriesMock))

  Services.configure(ItemService, undefined, instance(itemServiceMock))
}

function getItem(id: string): Promise<Result<IItem>> {
  const item = ItemMocks.find(i => i.id === id) as IItem

  if (item !== undefined) {
    const prices = PriceMocks.filter(p => p.itemId === id)

    if (prices !== undefined) {
      item.prices = prices
    }

    return Promise.resolve(Result.ok(item))
  }

  return Promise.resolve(Result.fail(FailureType.error, 'ItemService.getItem()', `Item "${id}" not found.`))
}

function getMainCurrency(hasMainCurrency: boolean): Promise<Result<ICurrency>> {
  if (hasMainCurrency) {
    return Promise.resolve(Result.ok({
      iconName: 'ruble-sign',
      itemId: '5449016a4bdc2d6f028b456f',
      mainCurrency: true,
      name: 'RUB',
      value: 1
    }))
  } else {
    return Promise.resolve(Result.fail(FailureType.error, 'ItemService.getMainCurrency()', 'Main currency not found.'))
  }
}