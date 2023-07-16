import { ItemFetcherService } from '../../services/ItemFetcherService'
import Result, { FailureType } from '../../utils/Result'
import { instance, mock, when } from 'ts-mockito'
import { ApiService } from '../../services/ApiService'
import Services from '../../services/repository/Services'
import WebsiteConfigurationMock from '../../../test-data/website-configuration.json'
import { useApiServiceMock } from '../../__mocks__/ApiServiceMock'
import ItemCategoriesMock from '../../../test-data/item-categories.json'
import ItemsMock from '../../../test-data/items.json'
import PricesMock from '../../../test-data/prices.json'
import PresetsMock from '../../../test-data/presets.json'
import { useWebsiteConfigurationServiceMock } from '../../__mocks__/WebsiteConfigurationServiceMock'
import { describe, expect, it } from 'vitest'

describe('fetchItemCategories()', () => {
  it('should fetch item categories', async () => {
    // Arrange
    useApiServiceMock(ItemCategoriesMock)
    useWebsiteConfigurationServiceMock()

    const fetcher = new ItemFetcherService()

    // Act
    const itemCategoriesResult = await fetcher.fetchItemCategories()

    // Assert
    expect(itemCategoriesResult.success).toBe(true)
    expect(itemCategoriesResult.value).to.deep.equal(ItemCategoriesMock)
  })

  it('should fail when item categories are not found', async () => {
    // Arrange
    useApiServiceMock([])
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
    const apiServiceMock = mock<ApiService>()
    when(apiServiceMock.get(WebsiteConfigurationMock.itemCategoriesApi)).thenReturn(Promise.resolve(Result.fail(FailureType.hidden, '', 'Error')))
    Services.configure(ApiService, undefined, instance(apiServiceMock))
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
    useApiServiceMock(ItemsMock)
    useWebsiteConfigurationServiceMock()

    const fetcher = new ItemFetcherService()

    // Act
    const itemsResult = await fetcher.fetchItems()

    // Assert
    expect(itemsResult.success).toBe(true)
    expect(itemsResult.value).to.deep.equal(ItemsMock)
  })

  it('should fail when items are not found', async () => {
    // Arrange
    useApiServiceMock([])
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
    const apiServiceMock = mock<ApiService>()
    when(apiServiceMock.get(WebsiteConfigurationMock.itemsApi)).thenReturn(Promise.resolve(Result.fail(FailureType.hidden, '', 'Error')))
    Services.configure(ApiService, undefined, instance(apiServiceMock))
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
  it('should fetch prices', async () => {
    // Arrange
    useApiServiceMock(PricesMock)
    useWebsiteConfigurationServiceMock()

    const fetcher = new ItemFetcherService()

    // Act
    const marketDataResult = await fetcher.fetchPrices()

    // Assert
    expect(marketDataResult.success).toBe(true)
    expect(marketDataResult.value).to.deep.equal(PricesMock)
  })

  it('should fail when prices are not found', async () => {
    // Arrange
    useApiServiceMock([])
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
    const apiServiceMock = mock<ApiService>()
    when(apiServiceMock.get(WebsiteConfigurationMock.pricesApi)).thenReturn(Promise.resolve(Result.fail(FailureType.hidden, '', 'Error')))
    Services.configure(ApiService, undefined, instance(apiServiceMock))
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
  it('should fetch presets', async () => {
    // Arrange
    useApiServiceMock(PresetsMock)
    useWebsiteConfigurationServiceMock()

    const fetcher = new ItemFetcherService()

    // Act
    const presetsResult = await fetcher.fetchPresets()

    // Assert
    expect(presetsResult.success).toBe(true)
    expect(presetsResult.value).to.deep.equal(PresetsMock)
  })

  it('should fail when presets are not found', async () => {
    // Arrange
    useApiServiceMock([])
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
    const apiServiceMock = mock<ApiService>()
    when(apiServiceMock.get(WebsiteConfigurationMock.presetsApi)).thenReturn(Promise.resolve(Result.fail(FailureType.hidden, '', 'Error')))
    Services.configure(ApiService, undefined, instance(apiServiceMock))
    useWebsiteConfigurationServiceMock()

    const fetcher = new ItemFetcherService()

    // Act
    const presetsResult = await fetcher.fetchPresets()

    // Assert
    expect(presetsResult.success).toBe(false)
    expect(presetsResult.failureMessage).toBe('No preset could be fetched.')
  })
})