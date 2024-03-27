import { anyString, anything, instance, mock, when } from 'ts-mockito'
import ItemCategoriesMock from '../../../public/data/item-categories.json'
import { ICurrency } from '../../models/configuration/ICurrency'
import { IItem } from '../../models/item/IItem'
import { IPrice } from '../../models/item/IPrice'
import { ItemService } from '../../services/ItemService'
import Services from '../../services/repository/Services'
import Result, { FailureType } from '../../utils/Result'
import { ItemMocks, rub } from '../__data__/itemMocks'
import { PriceMocks } from '../__data__/priceMocks'

export function useItemServiceMock(hasMainCurrency = true, customItemList?: IItem[], customPricesList?: IPrice[]): void {
  const itemServiceMock = mock<ItemService>()
  when(itemServiceMock.getItem(anyString())).thenCall((id: string) => getItem(id, customItemList, customPricesList))
  when(itemServiceMock.getItemCategories()).thenResolve(ItemCategoriesMock)
  when(itemServiceMock.getItems(anything(), anything())).thenCall((ids: string[]) => getItems(ids, customItemList))
  when(itemServiceMock.getItemsOfCategories(anything(), anything())).thenCall((ids: string[]) => getItemsOfCategories(ids, customItemList))
  when(itemServiceMock.getMainCurrency()).thenCall(() => getMainCurrency(hasMainCurrency))

  Services.configure(ItemService, undefined, instance(itemServiceMock))
}

function getItem(id: string, customItemList?: IItem[], customPricesList?: IPrice[]): Promise<Result<IItem>> {
  const item = (customItemList ?? ItemMocks).find(i => i.id === id) as IItem

  if (item != null) {
    item.prices = (customPricesList ?? PriceMocks).filter(p => p.itemId === id)

    return Promise.resolve(Result.ok(item))
  }

  return Promise.resolve(Result.fail(FailureType.error, 'ItemService.getItem()', `Item "${id}" not found.`))
}

async function getItems(ids: string[], customItemsList?: IItem[], customPricesList?: IPrice[]): Promise<Result<IItem[]>> {
  const items = (customItemsList ?? ItemMocks).filter(i => ids.some(id => i.id === id))

  for (const item of items) {
    item.prices = (customPricesList ?? PriceMocks).filter(p => p.itemId === item.id)
  }

  return Promise.resolve(Result.ok<IItem[]>(items))
}

async function getItemsOfCategories(ids: string[], customItemsList?: IItem[], customPricesList?: IPrice[]): Promise<Result<IItem[]>> {
  const items = (customItemsList ?? ItemMocks).filter(i => ids.some(id => i.categoryId === id))

  for (const item of items) {
    item.prices = (customPricesList ?? PriceMocks).filter(p => p.itemId === item.id)
  }

  return Promise.resolve(Result.ok<IItem[]>(items))
}

function getMainCurrency(hasMainCurrency: boolean): Promise<Result<ICurrency>> {
  if (hasMainCurrency) {
    return Promise.resolve(Result.ok({
      iconName: 'ruble-sign',
      itemId: rub.id,
      mainCurrency: true,
      name: rub.shortName,
      sortOrder: 3,
      value: 1
    }))
  } else {
    return Promise.resolve(Result.fail(FailureType.error, 'ItemService.getMainCurrency()', 'Main currency not found.'))
  }
}