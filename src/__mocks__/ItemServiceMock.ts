import { anyString, instance, mock, when } from 'ts-mockito'
import { ItemService } from '../services/ItemService'
import ItemsMock from '../../test-data/items.json'
import PriceMocks from '../../test-data/prices.json'
import Services from '../services/repository/Services'
import Result, { FailureType } from '../utils/Result'
import { ICurrency } from '../models/configuration/ICurrency'
import { IItem } from '../models/item/IItem'
import ItemCategoriesMock from '../../test-data/item-categories.json'
import PresetsMock from '../../test-data/presets.json'
import { IInventoryItem } from '../models/build/IInventoryItem'

export function useItemServiceMock(hasMainCurrency = true): void {
  const itemServiceMock = mock<ItemService>()
  when(itemServiceMock.getItem(anyString())).thenCall((id: string) => getItem(id))
  when(itemServiceMock.getItemCategories()).thenReturn(Promise.resolve(ItemCategoriesMock))
  when(itemServiceMock.getItemsOfCategory(anyString())).thenCall((id: string) => getItemsOfCategory(id))
  when(itemServiceMock.getMainCurrency()).thenCall(() => getMainCurrency(hasMainCurrency))
  when(itemServiceMock.getPreset(anyString())).thenCall((id: string) => getPreset(id))

  Services.configure(ItemService, undefined, instance(itemServiceMock))
}

function getItem(id: string): Promise<Result<IItem>> {
  const item = ItemsMock.find(i => i.id === id) as IItem

  if (item !== undefined) {
    item.prices = PriceMocks.filter(p => p.itemId === id)

    return Promise.resolve(Result.ok(item))
  }

  return Promise.resolve(Result.fail(FailureType.error, 'ItemService.getItem()', `Item "${id}" not found.`))
}

async function getItemsOfCategory(id: string): Promise<Result<IItem[]>> {
  const items = ItemsMock.filter(i => i.categoryId === id) as IItem[]

  for (const item of items) {
    item.prices = PriceMocks.filter(p => p.itemId === item.id)
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
      value: 1
    }))
  } else {
    return Promise.resolve(Result.fail(FailureType.error, 'ItemService.getMainCurrency()', 'Main currency not found.'))
  }
}

function getPreset(id: string): Promise<IInventoryItem | undefined> {
  const preset = PresetsMock.find(p => p.itemId === id)

  return Promise.resolve(preset)
}