import { anyString, anything, instance, mock, when } from 'ts-mockito'
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
import { IPrice } from '../models/item/IPrice'

export function useItemServiceMock(hasMainCurrency = true, customItemList?: IItem[], customPricesList?: IPrice[], customPresetsList?: IInventoryItem[]): void {
  const itemServiceMock = mock<ItemService>()
  when(itemServiceMock.getItem(anyString())).thenCall((id: string) => getItem(id, customItemList, customPricesList))
  when(itemServiceMock.getItemCategories()).thenReturn(Promise.resolve(ItemCategoriesMock))
  when(itemServiceMock.getItemsOfCategories(anything())).thenCall((ids: string[]) => getItemsOfCategories(ids, customItemList))
  when(itemServiceMock.getMainCurrency()).thenCall(() => getMainCurrency(hasMainCurrency))
  when(itemServiceMock.getPreset(anyString())).thenCall((id: string) => getPreset(id, customPresetsList))

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

async function getItemsOfCategories(ids: string[], customItemList?: IItem[], customPricesList?: IPrice[]): Promise<Result<IItem[]>> {
  const items = (customItemList ?? ItemsMock as IItem[]).filter(i => ids.some(id => i.categoryId === id)) as IItem[]

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

function getPreset(id: string, customPresetsList?: IInventoryItem[]): Promise<IInventoryItem | undefined> {
  const preset = (customPresetsList ?? PresetsMock).find(p => p.itemId === id)

  return Promise.resolve(preset)
}