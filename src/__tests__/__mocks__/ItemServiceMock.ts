import { anyString, anything, instance, mock, when } from 'ts-mockito'
import { ItemService } from '../../services/ItemService'
import ItemsMock from '../__data__/items.json'
import PriceMocks from '../__data__/prices.json'
import Services from '../../services/repository/Services'
import Result, { FailureType } from '../../utils/Result'
import { ICurrency } from '../../models/configuration/ICurrency'
import { IItem } from '../../models/item/IItem'
import ItemCategoriesMock from '../__data__/item-categories.json'
import { IPrice } from '../../models/item/IPrice'

export function useItemServiceMock(hasMainCurrency = true, customItemList?: IItem[], customPricesList?: IPrice[]): void {
  const itemServiceMock = mock<ItemService>()
  when(itemServiceMock.getItem(anyString())).thenCall((id: string) => getItem(id, customItemList, customPricesList))
  when(itemServiceMock.getItemCategories()).thenReturn(Promise.resolve(ItemCategoriesMock))
  when(itemServiceMock.getItems(anything(), anything())).thenCall((ids: string[]) => getItems(ids, customItemList))
  when(itemServiceMock.getItemsOfCategories(anything(), anything())).thenCall((ids: string[]) => getItemsOfCategories(ids, customItemList))
  when(itemServiceMock.getMainCurrency()).thenCall(() => getMainCurrency(hasMainCurrency))

  Services.configure(ItemService, undefined, instance(itemServiceMock))
}

function getItem(id: string, customItemList?: IItem[], customPricesList?: IPrice[]): Promise<Result<IItem>> {
  const item = (customItemList ?? ItemsMock as IItem[]).find(i => i.id === id) as IItem

  if (item != null) {
    item.prices = (customPricesList ?? PriceMocks as IPrice[]).filter(p => p.itemId === id)

    return Promise.resolve(Result.ok(item))
  }

  return Promise.resolve(Result.fail(FailureType.error, 'ItemService.getItem()', `Item "${id}" not found.`))
}

async function getItems(ids: string[], customItemsList?: IItem[], customPricesList?: IPrice[]): Promise<Result<IItem[]>> {
  const items = (customItemsList ?? ItemsMock as IItem[]).filter(i => ids.some(id => i.id === id)) as IItem[]

  for (const item of items) {
    item.prices = (customPricesList ?? PriceMocks as IPrice[]).filter(p => p.itemId === item.id)
  }

  return Promise.resolve(Result.ok<IItem[]>(items))
}

async function getItemsOfCategories(ids: string[], customItemsList?: IItem[], customPricesList?: IPrice[]): Promise<Result<IItem[]>> {
  const items = (customItemsList ?? ItemsMock as IItem[]).filter(i => ids.some(id => i.categoryId === id)) as IItem[]

  for (const item of items) {
    item.prices = (customPricesList ?? PriceMocks as IPrice[]).filter(p => p.itemId === item.id)
  }

  return Promise.resolve(Result.ok<IItem[]>(items))
}

function getMainCurrency(hasMainCurrency: boolean): Promise<Result<ICurrency>> {
  if (hasMainCurrency) {
    return Promise.resolve(Result.ok({
      iconName: 'ruble-sign',
      itemId: '5449016a4bdc2d6f028b456f',
      mainCurrency: true,
      name: 'RUB',
      sortOrder: 3,
      value: 1
    }))
  } else {
    return Promise.resolve(Result.fail(FailureType.error, 'ItemService.getMainCurrency()', 'Main currency not found.'))
  }
}