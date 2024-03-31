import { instance, mock, when } from 'ts-mockito'
import { describe, expect, it } from 'vitest'
import ItemCategoriesMock from '../../../public/data/item-categories.json'
import { FetchService } from '../../services/FetchService'
import { ItemFetcherService } from '../../services/ItemFetcherService'
import { ItemPropertiesService } from '../../services/ItemPropertiesService'
import { ReductionService } from '../../services/ReductionService'
import Services from '../../services/repository/Services'
import Result, { FailureType } from '../../utils/Result'
import { ItemMocks } from '../__data__/itemMocks'
import { PresetMocks } from '../__data__/presetMocks'
import { PriceMocks } from '../__data__/priceMocks'
import ReducedItemMocks from '../__data__/reduced-items.json'
import ReducedPresetMocks from '../__data__/reduced-presets.json'
import ReducedPriceMocks from '../__data__/reduced-prices.json'
import WebsiteConfigurationMock from '../__data__/websiteConfigurationMock'
import { useFetchServiceMock } from '../__mocks__/FetchServiceMock'
import { useWebsiteConfigurationServiceMock } from '../__mocks__/WebsiteConfigurationServiceMock'

describe('fetchItemCategories()', () => {
  it('should fetch item categories', async () => {
    // Arrange
    useFetchServiceMock(ItemCategoriesMock)
    useWebsiteConfigurationServiceMock()

    const fetcher = new ItemFetcherService()

    // Act
    const itemCategoriesResult = await fetcher.fetchItemCategories()

    // Assert
    expect(itemCategoriesResult.success).toBe(true)
    expect(itemCategoriesResult.value).toStrictEqual(ItemCategoriesMock)
  })

  it('should fail when item categories are not found', async () => {
    // Arrange
    useFetchServiceMock([])
    useWebsiteConfigurationServiceMock()

    const fetcher = new ItemFetcherService()

    // Act
    const itemCategoriesResult = await fetcher.fetchItemCategories()

    // Assert
    expect(itemCategoriesResult.success).toBe(false)
    expect(itemCategoriesResult.failureMessage).toBe('No item category could be fetched.')
  })

  it('should fail when an error occurs requesting item categories', async () => {
    // Arrange
    const fetchServiceMock = mock<FetchService>()
    when(fetchServiceMock.get('/' + WebsiteConfigurationMock.endpointItemCategories)).thenResolve(Result.fail(FailureType.hidden, '', 'Error'))
    Services.configure(FetchService, undefined, instance(fetchServiceMock))
    useWebsiteConfigurationServiceMock()

    const fetcher = new ItemFetcherService()

    // Act
    const itemCategoriesResult = await fetcher.fetchItemCategories()

    // Assert
    expect(itemCategoriesResult.success).toBe(false)
    expect(itemCategoriesResult.failureMessage).toBe('No item category could be fetched.')
  })
})

describe('fetchItems()', () => {
  it('should fetch all items', async () => {
    // Arrange
    useFetchServiceMock(ReducedItemMocks)
    useWebsiteConfigurationServiceMock()
    Services.configure(ItemPropertiesService)
    Services.configure(ReductionService)

    const fetcher = new ItemFetcherService()

    // Act
    const itemsResult = await fetcher.fetchItems()

    // Assert
    expect(itemsResult.success).toBe(true)
    expect(itemsResult.value.length).toBe(3512)

    for (const itemMock of ItemMocks) {
      const fetchedItem = itemsResult.value.find(i => i.id === itemMock.id)
      expect(fetchedItem).toStrictEqual(itemMock)
    }
  })

  it('should fail when items are not found', async () => {
    // Arrange
    useFetchServiceMock([])
    useWebsiteConfigurationServiceMock()

    const fetcher = new ItemFetcherService()

    // Act
    const itemResult = await fetcher.fetchItems()

    // Assert
    expect(itemResult.success).toBe(false)
    expect(itemResult.failureMessage).toBe('No item could be fetched.')
  })

  it('should fail when an error occurs requesting items', async () => {
    // Arrange
    const fetchServiceMock = mock<FetchService>()
    when(fetchServiceMock.get('/' + WebsiteConfigurationMock.endpointItems)).thenResolve(Result.fail(FailureType.hidden, '', 'Error'))
    Services.configure(FetchService, undefined, instance(fetchServiceMock))
    useWebsiteConfigurationServiceMock()

    const fetcher = new ItemFetcherService()

    // Act
    const itemResult = await fetcher.fetchItems()

    // Assert
    expect(itemResult.success).toBe(false)
    expect(itemResult.failureMessage).toBe('No item could be fetched.')
  })
})

describe('fetchPrices()', () => {
  it('should fetch all prices', async () => {
    // Arrange
    useFetchServiceMock(ReducedPriceMocks)
    useWebsiteConfigurationServiceMock()
    Services.configure(ReductionService)

    const fetcher = new ItemFetcherService()

    // Act
    const pricesResult = await fetcher.fetchPrices()

    // Assert
    expect(pricesResult.success).toBe(true)
    expect(pricesResult.value.length).toBe(5195)

    for (const priceMock of PriceMocks) {
      const fetchedPrice = pricesResult.value.find(p =>
        p.itemId === priceMock.itemId
        && p.merchant === priceMock.merchant
        && p.merchantLevel === priceMock.merchantLevel
        && p.currencyName === priceMock.currencyName
        && p.barterItems.map(bi => bi.itemId).join(',') === priceMock.barterItems.map(bi => bi.itemId).join(',')) // Needed because some items have multiple barters for the same merchant
      expect(fetchedPrice).toStrictEqual(priceMock)
    }
  })

  it('should fail when prices are not found', async () => {
    // Arrange
    useFetchServiceMock([])
    useWebsiteConfigurationServiceMock()

    const fetcher = new ItemFetcherService()

    // Act
    const pricesResult = await fetcher.fetchPrices()

    // Assert
    expect(pricesResult.success).toBe(false)
    expect(pricesResult.failureMessage).toBe('No price could be fetched.')
  })

  it('should fail when an error occurs requesting prices', async () => {
    // Arrange
    const fetchServiceMock = mock<FetchService>()
    when(fetchServiceMock.get('/' + WebsiteConfigurationMock.endpointPrices)).thenResolve(Result.fail(FailureType.hidden, '', 'Error'))
    Services.configure(FetchService, undefined, instance(fetchServiceMock))
    useWebsiteConfigurationServiceMock()

    const fetcher = new ItemFetcherService()

    // Act
    const pricesResult = await fetcher.fetchPrices()

    // Assert
    expect(pricesResult.success).toBe(false)
    expect(pricesResult.failureMessage).toBe('No price could be fetched.')
  })
})

describe('fetchPresets()', () => {
  it('should fetch all presets', async () => {
    // Arrange
    useFetchServiceMock(ReducedPresetMocks)
    useWebsiteConfigurationServiceMock()
    Services.configure(ReductionService)

    const fetcher = new ItemFetcherService()

    // Act
    const presetsResult = await fetcher.fetchPresets()

    // Assert
    expect(presetsResult.success).toBe(true)
    expect(presetsResult.value.length).toBe(309)

    for (const presetMock of PresetMocks) {
      const fetchedItem = presetsResult.value.find(i => i.itemId === presetMock.itemId)
      expect(fetchedItem).toStrictEqual(presetMock)
    }
  })

  it('should fail when presets are not found', async () => {
    // Arrange
    useFetchServiceMock([])
    useWebsiteConfigurationServiceMock()

    const fetcher = new ItemFetcherService()

    // Act
    const presetsResult = await fetcher.fetchPresets()

    // Assert
    expect(presetsResult.success).toBe(false)
    expect(presetsResult.failureMessage).toBe('No preset could be fetched.')
  })

  it('should fail when an error occurs requesting presets', async () => {
    // Arrange
    const fetchServiceMock = mock<FetchService>()
    when(fetchServiceMock.get('/' + WebsiteConfigurationMock.endpointPresets)).thenResolve(Result.fail(FailureType.hidden, '', 'Error'))
    Services.configure(FetchService, undefined, instance(fetchServiceMock))
    useWebsiteConfigurationServiceMock()

    const fetcher = new ItemFetcherService()

    // Act
    const presetsResult = await fetcher.fetchPresets()

    // Assert
    expect(presetsResult.success).toBe(false)
    expect(presetsResult.failureMessage).toBe('No preset could be fetched.')
  })
})