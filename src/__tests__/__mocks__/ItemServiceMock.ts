import { anyString, anything, instance, mock, when } from 'ts-mockito'
import TarkovValuesMock from '../../../public/data/tarkov-values.json'
import { ICurrency } from '../../models/configuration/ICurrency'
import { ITarkovValues } from '../../models/configuration/ITarkovValues'
import { IItem, ItemCategoryId } from '../../models/item/IItem'
import { IPrice } from '../../models/item/IPrice'
import vueI18n from '../../plugins/vueI18n'
import { ItemService } from '../../services/ItemService'
import Services from '../../services/repository/Services'
import { ItemMocks, rub } from '../__data__/itemMocks'
import { PriceMocks } from '../__data__/priceMocks'

export function useItemServiceMock(hasMainCurrency = true, customItemList?: IItem[], customPricesList?: IPrice[]): void {
  const itemServiceMock = mock<ItemService>()
  when(itemServiceMock.getCurrency(anyString())).thenCall(currencyName => getCurrency(currencyName))
  when(itemServiceMock.getItemAsync(anyString())).thenCall((id: string) => getItem(id, customItemList, customPricesList))
  when(itemServiceMock.getItemsAsync(anything(), anything())).thenCall((ids: string[]) => getItems(ids, customItemList))
  when(itemServiceMock.getItemsOfCategoriesAsync(anything(), anything())).thenCall((categoryIds: ItemCategoryId[]) => getItemsOfCategories(categoryIds, customItemList))
  when(itemServiceMock.getMainCurrency()).thenCall(() => getMainCurrency(hasMainCurrency))

  Services.configure(ItemService, undefined, instance(itemServiceMock))
}

function getCurrency(currencyName: string): ICurrency {
  const currency = (TarkovValuesMock as ITarkovValues).currencies.find(c => c.name === currencyName)

  if (currency == null) {
    throw new Error(vueI18n.t('message.currencyNotFound', { currency: name }))
  }

  return currency
}

function getItem(id: string, customItemList?: IItem[], customPricesList?: IPrice[]): Promise<IItem> {
  let item = (customItemList ?? ItemMocks).find(i => i.id === id) as IItem

  if (item == null) {
    item = ItemService.getNotFoundItem(id)
  } else {
    item.prices = (customPricesList ?? PriceMocks).filter(p => p.itemId === id)
  }

  return Promise.resolve(item)
}

function getItems(ids: string[], customItemsList?: IItem[], customPricesList?: IPrice[]): Promise<IItem[]> {
  const items = (customItemsList ?? ItemMocks).filter(i => ids.some(id => i.id === id))

  for (const item of items) {
    item.prices = (customPricesList ?? PriceMocks).filter(p => p.itemId === item.id)
  }

  return Promise.resolve(items)
}

function getItemsOfCategories(categoryIds: ItemCategoryId[], customItemsList?: IItem[], customPricesList?: IPrice[]): Promise<IItem[]> {
  const items = (customItemsList ?? ItemMocks).filter(i => categoryIds.some(categoryId => i.categoryId === categoryId))

  for (const item of items) {
    item.prices = (customPricesList ?? PriceMocks).filter(p => p.itemId === item.id)
  }

  return Promise.resolve(items)
}

function getMainCurrency(hasMainCurrency: boolean): ICurrency {
  if (!hasMainCurrency) {
    throw new Error(vueI18n.t('message.mainCurrencyNotFound'))
  }

  return {
    iconName: 'ruble-sign',
    itemId: rub.id,
    mainCurrency: true,
    name: rub.shortName,
    sortOrder: 3,
    symbol: '₽',
    value: 1
  }
}