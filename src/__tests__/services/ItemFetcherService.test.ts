import { ItemFetcherService } from '../../services/ItemFetcherService'
import Result, { FailureType } from '../../utils/Result'
import { instance, mock, when } from 'ts-mockito'
import { FetchService } from '../../services/FetchService'
import Services from '../../services/repository/Services'
import WebsiteConfigurationMock from '../__data__/website-configuration.json'
import { useFetchServiceMock } from '../__mocks__/FetchServiceMock'
import ItemCategoriesMock from '../__data__/item-categories.json'
import ItemsMock from '../__data__/items.json'
import PricesMock from '../__data__/prices.json'
import PresetsMock from '../__data__/presets.json'
import ReducedItemsMock from '../__data__/reduced-items.json'
import ReducedPricesMock from '../__data__/reduced-prices.json'
import ReducedPresetsMock from '../__data__/reduced-presets.json'
import { useWebsiteConfigurationServiceMock } from '../__mocks__/WebsiteConfigurationServiceMock'
import { describe, expect, it } from 'vitest'
import { ReductionService } from '../../services/ReductionService'
import { ItemPropertiesService } from '../../services/ItemPropertiesService'

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
    when(fetchServiceMock.get('/' + WebsiteConfigurationMock.endpointItemCategories)).thenReturn(Promise.resolve(Result.fail(FailureType.hidden, '', 'Error')))
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
    useFetchServiceMock(ReducedItemsMock)
    useWebsiteConfigurationServiceMock()
    Services.configure(ItemPropertiesService)
    Services.configure(ReductionService)

    const fetcher = new ItemFetcherService()

    // Act
    const itemsResult = await fetcher.fetchItems()

    // Assert
    expect(itemsResult.success).toBe(true)
    expect(itemsResult.value).toStrictEqual(ItemsMock)
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
    when(fetchServiceMock.get('/' + WebsiteConfigurationMock.endpointItems)).thenReturn(Promise.resolve(Result.fail(FailureType.hidden, '', 'Error')))
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
    useFetchServiceMock(ReducedPricesMock)
    useWebsiteConfigurationServiceMock()
    Services.configure(ReductionService)

    const fetcher = new ItemFetcherService()

    // Act
    const pricesResult = await fetcher.fetchPrices()

    // Assert
    expect(pricesResult.success).toBe(true)
    expect(pricesResult.value).toStrictEqual(PricesMock)
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
    when(fetchServiceMock.get('/' + WebsiteConfigurationMock.endpointPrices)).thenReturn(Promise.resolve(Result.fail(FailureType.hidden, '', 'Error')))
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
    useFetchServiceMock(ReducedPresetsMock)
    useWebsiteConfigurationServiceMock()
    Services.configure(ReductionService)

    const fetcher = new ItemFetcherService()

    // Act
    const presetsResult = await fetcher.fetchPresets()

    // Assert
    expect(presetsResult.success).toBe(true)
    expect(presetsResult.value).toStrictEqual(PresetsMock)
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
    when(fetchServiceMock.get('/' + WebsiteConfigurationMock.endpointPresets)).thenReturn(Promise.resolve(Result.fail(FailureType.hidden, '', 'Error')))
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