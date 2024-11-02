import { instance, mock, verify, when } from 'ts-mockito'
import { describe, expect, it } from 'vitest'
import { FetchService } from '../../services/FetchService'
import { ItemFetcherService } from '../../services/ItemFetcherService'
import { ItemPropertiesService } from '../../services/ItemPropertiesService'
import { LogService } from '../../services/LogService'
import { ReductionService } from '../../services/ReductionService'
import Services from '../../services/repository/Services'
import { ItemMocks } from '../__data__/itemMocks'
import { PresetMocks } from '../__data__/presetMocks'
import { PriceMocks } from '../__data__/priceMocks'
import ReducedItemMocks from '../__data__/reduced-items.json'
import ReducedPresetMocks from '../__data__/reduced-presets.json'
import ReducedPriceMocks from '../__data__/reduced-prices.json'
import WebsiteConfigurationMock from '../__data__/websiteConfigurationMock'
import { useFetchServiceMock } from '../__mocks__/FetchServiceMock'
import { useWebsiteConfigurationServiceMock } from '../__mocks__/WebsiteConfigurationServiceMock'

describe('fetchItemsAsync()', () => {
  it('should fetch all items', async () => {
    // Arrange
    useFetchServiceMock(ReducedItemMocks)
    useWebsiteConfigurationServiceMock()
    Services.configure(ItemPropertiesService)
    Services.configure(ReductionService)

    const fetcher = new ItemFetcherService()

    // Act
    const items = await fetcher.fetchItemsAsync()

    // Assert
    expect(items).not.toBeUndefined()
    expect(items!.length).toBe(3804)

    for (const itemMock of ItemMocks) {
      const fetchedItem = items!.find(i => i.id === itemMock.id)
      expect(fetchedItem).toStrictEqual(itemMock)
    }
  })

  it('should return undefined and log exception when items are not found', async () => {
    // Arrange
    useFetchServiceMock([])
    useWebsiteConfigurationServiceMock()

    const logServiceMock = mock<LogService>()
    Services.configure(LogService, undefined, instance(logServiceMock))

    const fetcher = new ItemFetcherService()

    // Act
    const items = await fetcher.fetchItemsAsync()

    // Assert
    expect(items).toBeUndefined()
    verify(logServiceMock.logException('message.itemsNotFetched')).once()
  })

  it('should return undefined and log exception when an error occurs requesting items', async () => {
    // Arrange
    useWebsiteConfigurationServiceMock()

    const fetchServiceMock = mock<FetchService>()
    when(fetchServiceMock.getAsync('/' + WebsiteConfigurationMock.endpointItems)).thenResolve(undefined)
    Services.configure(FetchService, undefined, instance(fetchServiceMock))

    const logServiceMock = mock<LogService>()
    Services.configure(LogService, undefined, instance(logServiceMock))

    const fetcher = new ItemFetcherService()

    // Act
    const items = await fetcher.fetchItemsAsync()

    // Assert
    expect(items).toBeUndefined()
    verify(logServiceMock.logException('message.itemsNotFetched')).once()
  })
})

describe('fetchPricesAsync()', () => {
  it('should fetch all prices', async () => {
    // Arrange
    useFetchServiceMock(ReducedPriceMocks)
    useWebsiteConfigurationServiceMock()
    Services.configure(ReductionService)

    const fetcher = new ItemFetcherService()

    // Act
    const prices = await fetcher.fetchPricesAsync()

    // Assert
    expect(prices).not.toBeUndefined()
    expect(prices!.length).toBe(5196)

    for (const priceMock of PriceMocks) {
      const fetchedPrice = prices!.find(p =>
        p.itemId === priceMock.itemId
        && p.merchant === priceMock.merchant
        && p.merchantLevel === priceMock.merchantLevel
        && p.currencyName === priceMock.currencyName
        && p.barterItems.map(bi => bi.itemId).join(',') === priceMock.barterItems.map(bi => bi.itemId).join(',')) // Needed because some items have multiple barters for the same merchant

      expect(fetchedPrice).toStrictEqual(priceMock)
    }
  })

  it('should return undefined and log exception when prices are not found', async () => {
    // Arrange
    useFetchServiceMock([])
    useWebsiteConfigurationServiceMock()

    const logServiceMock = mock<LogService>()
    Services.configure(LogService, undefined, instance(logServiceMock))

    const fetcher = new ItemFetcherService()

    // Act
    const prices = await fetcher.fetchPricesAsync()

    // Assert
    expect(prices).toBeUndefined()
    verify(logServiceMock.logException('message.pricesNotFetched')).once()
  })

  it('should return undefined and log exception when an error occurs requesting prices', async () => {
    // Arrange
    useWebsiteConfigurationServiceMock()

    const fetchServiceMock = mock<FetchService>()
    when(fetchServiceMock.getAsync('/' + WebsiteConfigurationMock.endpointPrices)).thenResolve(undefined)
    Services.configure(FetchService, undefined, instance(fetchServiceMock))

    const logServiceMock = mock<LogService>()
    Services.configure(LogService, undefined, instance(logServiceMock))

    const fetcher = new ItemFetcherService()

    // Act
    const prices = await fetcher.fetchPricesAsync()

    // Assert
    expect(prices).toBeUndefined()
    verify(logServiceMock.logException('message.pricesNotFetched')).once()
  })
})

describe('fetchPresetsAsync()', () => {
  it('should fetch all presets', async () => {
    // Arrange
    useFetchServiceMock(ReducedPresetMocks)
    useWebsiteConfigurationServiceMock()
    Services.configure(ReductionService)

    const fetcher = new ItemFetcherService()

    // Act
    const presets = await fetcher.fetchPresetsAsync()

    // Assert
    expect(presets).not.toBeUndefined()
    expect(presets!.length).toBe(381)

    for (const presetMock of PresetMocks) {
      const fetchedItem = presets!.find(i => i.itemId === presetMock.itemId)
      expect(fetchedItem).toStrictEqual(presetMock)
    }
  })

  it('should return undefined and log exception when presets are not found', async () => {
    // Arrange
    useFetchServiceMock([])
    useWebsiteConfigurationServiceMock()

    const logServiceMock = mock<LogService>()
    Services.configure(LogService, undefined, instance(logServiceMock))

    const fetcher = new ItemFetcherService()

    // Act
    const presets = await fetcher.fetchPresetsAsync()

    // Assert
    expect(presets).toBeUndefined()
    verify(logServiceMock.logException('message.presetsNotFetched')).once()
  })

  it('should return undefined and log exception when an error occurs requesting presets', async () => {
    // Arrange
    useWebsiteConfigurationServiceMock()

    const fetchServiceMock = mock<FetchService>()
    when(fetchServiceMock.getAsync('/' + WebsiteConfigurationMock.endpointPresets)).thenResolve(undefined)
    Services.configure(FetchService, undefined, instance(fetchServiceMock))

    const logServiceMock = mock<LogService>()
    Services.configure(LogService, undefined, instance(logServiceMock))

    const fetcher = new ItemFetcherService()

    // Act
    const presets = await fetcher.fetchPresetsAsync()

    // Assert
    expect(presets).toBeUndefined()
    verify(logServiceMock.logException('message.presetsNotFetched')).once()
  })
})