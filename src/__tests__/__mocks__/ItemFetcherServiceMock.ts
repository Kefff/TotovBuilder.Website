import { instance, mock, when } from 'ts-mockito'
import { ItemFetcherService } from '../../services/ItemFetcherService'
import Services from '../../services/repository/Services'
import Result from '../../utils/Result'
import ItemCategoriesMock from '../__data__/item-categories.json'
import ItemsMock from '../__data__/items'
import PresetsMock from '../__data__/presets'
import PricesMock from '../__data__/prices'
import { IItem } from '../../models/item/IItem'
import { IPrice } from '../../models/item/IPrice'

export function useItemFetcherServiceMock(): void {
  const itemFetcherServiceMock = mock<ItemFetcherService>()
  when(itemFetcherServiceMock.fetchItemCategories()).thenReturn(Promise.resolve(Result.ok(ItemCategoriesMock)))
  when(itemFetcherServiceMock.fetchItems()).thenReturn(Promise.resolve(Result.ok(ItemsMock as IItem[])))
  when(itemFetcherServiceMock.fetchPresets()).thenReturn(Promise.resolve(Result.ok(PresetsMock)))
  when(itemFetcherServiceMock.fetchPrices()).thenReturn(Promise.resolve(Result.ok(PricesMock as IPrice[])))

  Services.configure(ItemFetcherService, undefined, instance(itemFetcherServiceMock))
}