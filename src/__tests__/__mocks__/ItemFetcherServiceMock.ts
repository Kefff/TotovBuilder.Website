import { instance, mock, when } from 'ts-mockito'
import { IInventoryItem } from '../../models/build/IInventoryItem'
import { IItem } from '../../models/item/IItem'
import { IPrice } from '../../models/item/IPrice'
import { ItemFetcherService } from '../../services/ItemFetcherService'
import Services from '../../services/repository/Services'
import { ItemMocks } from '../__data__/itemMocks'
import { PresetMocks } from '../__data__/presetMocks'
import { PriceMocks } from '../__data__/priceMocks'

export function useItemFetcherServiceMock(customItemList?: IItem[], customPresetsList?: IInventoryItem[], customPricesList?: IPrice[]): void {
  const itemFetcherServiceMock = mock<ItemFetcherService>()
  when(itemFetcherServiceMock.fetchItems()).thenResolve(customItemList ?? ItemMocks)
  when(itemFetcherServiceMock.fetchPresets()).thenResolve(customPresetsList ?? PresetMocks)
  when(itemFetcherServiceMock.fetchPrices()).thenResolve(customPricesList ?? PriceMocks)

  Services.configure(ItemFetcherService, undefined, instance(itemFetcherServiceMock))
}