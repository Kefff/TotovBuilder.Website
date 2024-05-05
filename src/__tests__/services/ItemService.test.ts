import MockDate from 'mockdate'
import { anything, instance, mock, spy, verify, when } from 'ts-mockito'
import { describe, expect, it } from 'vitest'
import ItemCategoryMocks from '../../../public/data/item-categories.json'
import { IPrice } from '../../models/item/IPrice'
import { GlobalFilterService } from '../../services/GlobalFilterService'
import { ItemFetcherService } from '../../services/ItemFetcherService'
import { ItemPropertiesService } from '../../services/ItemPropertiesService'
import { ItemService } from '../../services/ItemService'
import { NotificationService } from '../../services/NotificationService'
import { PresetService } from '../../services/PresetService'
import { TarkovValuesService } from '../../services/TarkovValuesService'
import { WebsiteConfigurationService } from '../../services/WebsiteConfigurationService'
import { ServiceInitializationState } from '../../services/repository/ServiceInitializationState'
import Services from '../../services/repository/Services'
import Result from '../../utils/Result'
import { ItemMocks, ak12PistolGrip, ak12bt, alpha, armbandBlue, m9a3, mts25512Default, nf30mm, opSksDefault, pso1, rpk16Default, scavVest } from '../__data__/itemMocks'
import { PresetMocks } from '../__data__/presetMocks'
import { PriceMocks, nf30mmPrices, pso1Prices, rpk16DefaultPrices } from '../__data__/priceMocks'
import { useGlobalFilterServiceMock } from '../__mocks__/GlobalFilterServiceMock'
import { useItemFetcherServiceMock } from '../__mocks__/ItemFetcherServiceMock'
import { usePresetServiceMock } from '../__mocks__/PresetServiceMock'
import { useTarkovValuesServiceMock } from '../__mocks__/TarkovValuesServiceMock'
import { useWebsiteConfigurationServiceMock } from '../__mocks__/WebsiteConfigurationServiceMock'

describe('constructor', () => {
  it('should subscribe to the GlobalFilterService "globalFilterChanged" event and update the filtered items list when triggered', async () => {
    // Arrange
    useItemFetcherServiceMock()
    usePresetServiceMock()
    useTarkovValuesServiceMock()
    useWebsiteConfigurationServiceMock()
    Services.configure(GlobalFilterService)
    Services.configure(ItemPropertiesService)

    const itemService = new ItemService()
    Services.configure(ItemService, undefined, itemService) // Registering the tested service because the GlobalFilterService uses it

    const globalFilterService = Services.get(GlobalFilterService)
    globalFilterService.saveMerchantFilters([
      {
        enabled: true,
        merchant: 'prapor',
        merchantLevel: 4
      }
    ])

    // Act / Assert
    let item = await itemService.getItem(ak12bt.id, true)
    expect(item).not.toBeUndefined()

    globalFilterService.saveMerchantFilters([{
      enabled: false,
      merchant: 'prapor',
      merchantLevel: 4
    }])

    item = await itemService.getItem(ak12bt.id, true)
    expect(item).toBeUndefined()
  })
})

describe('fetchItemCategories()', () => {
  it('should not update item categories when fetching fails', async () => {
    // Arrange
    useGlobalFilterServiceMock()
    usePresetServiceMock()
    useTarkovValuesServiceMock()
    useWebsiteConfigurationServiceMock()

    const itemFetcherServiceMock = mock<ItemFetcherService>()
    when(itemFetcherServiceMock.fetchItemCategories()).thenResolve(undefined)
    when(itemFetcherServiceMock.fetchItems()).thenResolve(ItemMocks)
    when(itemFetcherServiceMock.fetchPresets()).thenResolve(PresetMocks)
    when(itemFetcherServiceMock.fetchPrices()).thenResolve(PriceMocks)
    Services.configure(ItemFetcherService, undefined, instance(itemFetcherServiceMock))

    // Act
    const itemService = new ItemService()
    const itemCategories = await itemService.getItemCategories()

    // Assert
    expect(itemCategories).toStrictEqual([])
  })
})

describe('fetchItems()', () => {
  it('should not update items when fetching fails', async () => {
    // Arrange
    useGlobalFilterServiceMock()
    usePresetServiceMock()
    useTarkovValuesServiceMock()
    useWebsiteConfigurationServiceMock()

    const itemFetcherServiceMock = mock<ItemFetcherService>()
    when(itemFetcherServiceMock.fetchItemCategories()).thenResolve(ItemCategoryMocks)
    when(itemFetcherServiceMock.fetchItems()).thenResolve(undefined)
    when(itemFetcherServiceMock.fetchPresets()).thenResolve(PresetMocks)
    when(itemFetcherServiceMock.fetchPrices()).thenResolve(PriceMocks as IPrice[])
    Services.configure(ItemFetcherService, undefined, instance(itemFetcherServiceMock))

    // Act
    const itemService = new ItemService()
    const item = await itemService.getItem('624c0b3340357b5f566e8766')

    // Assert
    expect(item).toBeUndefined()
  })
})

describe('getCurrency()', () => {
  it.each([
    ['RUB'],
    ['USD'],
    ['EUR']
  ])('should get a currency', async (currencyName: string) => {
    // Arrange
    useGlobalFilterServiceMock()
    useTarkovValuesServiceMock()
    const itemService = new ItemService()

    // Act
    const curency = itemService.getCurrency(currencyName)

    // Assert
    expect(curency?.name).toBe(currencyName)
  })

  it('should return nothing when the currency is not found', async () => {
    // Arrange
    useGlobalFilterServiceMock()
    useTarkovValuesServiceMock()
    const itemService = new ItemService()

    // Act
    const currency = await itemService.getCurrency('invalid')

    // Assert
    expect(currency.success).toBe(false)
    expect(currency.failureMessage).toBe('Currency "invalid" not found')
  })
})

describe('getItem()', () => {
  it('should get an item from the cache', async () => {
    // Arrange
    useGlobalFilterServiceMock()
    useItemFetcherServiceMock()
    usePresetServiceMock()
    useTarkovValuesServiceMock()
    useWebsiteConfigurationServiceMock()

    const itemService = new ItemService()

    // Act
    const itemResult = await itemService.getItem(rpk16Default.id)

    // Assert
    expect(itemResult.success).toBe(true)
    expect(itemResult.value).toStrictEqual({
      ...rpk16Default,
      prices: rpk16DefaultPrices
    })
  })

  it('should fail when getting an item that does not exist', async () => {
    // Arrange
    useGlobalFilterServiceMock()
    useItemFetcherServiceMock()
    usePresetServiceMock()
    useTarkovValuesServiceMock()
    useWebsiteConfigurationServiceMock()

    const itemService = new ItemService()

    // Act
    const itemResult = await itemService.getItem('invalid')

    // Assert
    expect(itemResult.success).toBe(false)
    expect(itemResult.failureMessage).toBe('Item "invalid" not found.')
  })

  it('should fail when fetching fails', async () => {
    // Arrange
    useGlobalFilterServiceMock()
    usePresetServiceMock()
    useWebsiteConfigurationServiceMock()

    Services.configure(NotificationService)

    const itemFetcherServiceMock = mock<ItemFetcherService>()
    when(itemFetcherServiceMock.fetchItemCategories()).thenResolve(Result.fail(FailureType.error))
    when(itemFetcherServiceMock.fetchItems()).thenResolve(Result.fail(FailureType.error))
    when(itemFetcherServiceMock.fetchPrices()).thenResolve(Result.fail(FailureType.error))
    when(itemFetcherServiceMock.fetchPresets()).thenResolve(Result.fail(FailureType.error))
    Services.configure(ItemFetcherService, undefined, instance(itemFetcherServiceMock))

    const itemService = new ItemService()

    // Act
    const itemResult = await itemService.getItem(rpk16Default.id)

    // Assert
    expect(itemResult.success).toBe(false)
    expect(itemResult.failureMessage).toBe(`Item "${rpk16Default.id}" not found.`)
  })
})

describe('getItems()', () => {
  it('should get items from the cache', async () => {
    // Arrange
    useGlobalFilterServiceMock()
    useItemFetcherServiceMock()
    usePresetServiceMock()
    useTarkovValuesServiceMock()
    useWebsiteConfigurationServiceMock()

    const itemService = new ItemService()

    // Act
    const itemsResult = await itemService.getItems([rpk16Default.id, nf30mm.id])

    // Assert
    expect(itemsResult.success).toBe(true)
    expect(itemsResult.value).toStrictEqual(
      [
        {
          ...rpk16Default,
          prices: rpk16DefaultPrices
        },
        {
          ...nf30mm,
          prices: nf30mmPrices
        }
      ]
    )
  })

  it('should filter items according to the global filter', async () => {
    // Arrange
    useItemFetcherServiceMock()
    usePresetServiceMock()
    useTarkovValuesServiceMock()
    useWebsiteConfigurationServiceMock()
    Services.configure(ItemPropertiesService)
    Services.configure(GlobalFilterService)

    const itemService = new ItemService()
    Services.configure(ItemService, undefined, itemService) // Registering the tested service because the GlobalFilterService uses it

    const globalFitlerService = Services.get(GlobalFilterService)
    globalFitlerService.saveMerchantFilters([
      {
        enabled: true,
        merchant: 'prapor',
        merchantLevel: 1
      },
      {
        enabled: true,
        merchant: 'peacekeeper',
        merchantLevel: 1
      }
    ])

    // Act
    const itemsResult = await itemService.getItems([
      pso1.id, // Praport 1
      nf30mm.id, // Jaeger 3 (excluded)
      ak12PistolGrip.id, //Prapor 2 (excluded)
      m9a3.id // Peacekeeper 1 (excluded because is preset base item)
    ], true)

    // Assert
    expect(itemsResult.success).toBe(true)
    expect(itemsResult.value).toStrictEqual([
      {
        ...pso1,
        prices: pso1Prices
      }
    ])
  })

  it('should fail when and item is not found and the global filter is not used', async () => {
    // Arrange
    useGlobalFilterServiceMock()
    useItemFetcherServiceMock()
    usePresetServiceMock()
    useTarkovValuesServiceMock()
    useWebsiteConfigurationServiceMock()

    const itemService = new ItemService()

    // Act
    const itemsResult = await itemService.getItems(['invalid1', nf30mm.id, 'invalid2'], false)

    // Assert
    expect(itemsResult.success).toBe(false)
    expect(itemsResult.failureMessage).toBe('Items "invalid1", "invalid2" not found.')
  })

  it('should fail when fetching fails', async () => {
    // Arrange
    useGlobalFilterServiceMock()
    usePresetServiceMock()
    useWebsiteConfigurationServiceMock()

    Services.configure(NotificationService)

    const itemFetcherServiceMock = mock<ItemFetcherService>()
    when(itemFetcherServiceMock.fetchItemCategories()).thenResolve(Result.fail(FailureType.error))
    when(itemFetcherServiceMock.fetchItems()).thenResolve(Result.fail(FailureType.error))
    when(itemFetcherServiceMock.fetchPrices()).thenResolve(Result.fail(FailureType.error))
    when(itemFetcherServiceMock.fetchPresets()).thenResolve(Result.fail(FailureType.error))
    Services.configure(ItemFetcherService, undefined, instance(itemFetcherServiceMock))

    const itemService = new ItemService()

    // Act
    const itemsResult = await itemService.getItems([rpk16Default.id, nf30mm.id])

    // Assert
    expect(itemsResult.success).toBe(false)
    expect(itemsResult.failureMessage).toBe(`Items "${rpk16Default.id}", "${nf30mm.id}" not found.`)
  })
})

describe('getItemCategories()', () => {
  it('should get item categories', async () => {
    // Arrange
    useGlobalFilterServiceMock()
    useItemFetcherServiceMock()
    usePresetServiceMock()
    useTarkovValuesServiceMock()
    useWebsiteConfigurationServiceMock()

    const itemService = new ItemService()

    // Act
    const itemCategories = await itemService.getItemCategories()

    // Assert
    expect(itemCategories).toStrictEqual(ItemCategoryMocks)
  })
})

describe('getItemsOfCategories()', () => {
  it('should get the items belonging to the categories', async () => {
    // Arrange
    useGlobalFilterServiceMock()
    useItemFetcherServiceMock()
    usePresetServiceMock()
    useTarkovValuesServiceMock()
    useWebsiteConfigurationServiceMock()

    const itemService = new ItemService()

    // Act
    const itemResult = await itemService.getItemsOfCategories(['armband', 'securedContainer'])

    // Assert
    expect(itemResult.success).toBe(true)
    expect(itemResult.value.map((i) => i.id).sort()).toStrictEqual([
      alpha.id,
      armbandBlue.id
    ])
  })

  it('should filter items according to the global filter', async () => {
    // Arrange
    useItemFetcherServiceMock()
    usePresetServiceMock()
    useTarkovValuesServiceMock()
    useWebsiteConfigurationServiceMock()
    Services.configure(ItemPropertiesService)
    Services.configure(GlobalFilterService)

    const itemService = new ItemService()
    Services.configure(ItemService, undefined, itemService) // Registering the tested service because the GlobalFilterService uses it

    const globalFitlerService = Services.get(GlobalFilterService)
    globalFitlerService.saveMerchantFilters([
      {
        enabled: true,
        merchant: 'jaeger',
        merchantLevel: 1
      }
    ])

    // Act
    const itemResult = await itemService.getItemsOfCategories(['mainWeapon', 'secondaryWeapon', 'vest'], true)

    // Assert
    expect(itemResult.success).toBe(true)
    expect(itemResult.value.map((i) => i.id).sort()).toStrictEqual([
      scavVest.id,
      opSksDefault.id,
      mts25512Default.id
    ])
  })

  it('should fail when no items belong to the categories', async () => {
    // Arrange
    useGlobalFilterServiceMock()
    useItemFetcherServiceMock()
    usePresetServiceMock()
    useTarkovValuesServiceMock()
    useWebsiteConfigurationServiceMock()

    const itemService = new ItemService()

    // Act
    const itemResult = await itemService.getItemsOfCategories(['invalid, invalid2'])

    // Assert
    expect(itemResult.success).toBe(false)
    expect(itemResult.failureMessage).not.toBe('')
  })

  it('should fail when no items are found an the merchant filter is not used', async () => {
    // Arrange
    useGlobalFilterServiceMock()
    useItemFetcherServiceMock()
    usePresetServiceMock()
    useTarkovValuesServiceMock()
    useWebsiteConfigurationServiceMock()

    const itemService = new ItemService()

    // Act
    const itemsResult = await itemService.getItemsOfCategories(['invalid1', 'invalid2'], false)

    // Assert
    expect(itemsResult.success).toBe(false)
    expect(itemsResult.failureMessage).toBe('No items found for the "invalid1", "invalid2" item categories.')
  })
})

describe('getMainCurrency()', () => {
  it('should get the main currency', async () => {
    // Arrange
    useGlobalFilterServiceMock()
    useTarkovValuesServiceMock()

    const itemService = new ItemService()

    // Act
    const currency = await itemService.getMainCurrency()

    // Assert
    expect(currency.success).toBe(true)
    expect(currency.value.name).toBe('RUB')
  })

  it('should fail if the main currency cannot be found', async () => {
    // Arrange
    useGlobalFilterServiceMock()
    useTarkovValuesServiceMock()

    const tarkovValuesServiceMock = Services.get(TarkovValuesService)
    const originalCurrencies = tarkovValuesServiceMock.values.currencies
    tarkovValuesServiceMock.values.currencies = tarkovValuesServiceMock.values.currencies.filter(i => !i.mainCurrency)

    const itemService = new ItemService()

    // Act
    const currencyResult = await itemService.getMainCurrency()

    // Assert
    expect(currencyResult.success).toBe(false)
    expect(currencyResult.failureMessage).toBe('Main currency not found.')

    // Clean
    tarkovValuesServiceMock.values.currencies = originalCurrencies
  })
})

describe('initialize', () => {
  it('should fetch presets, update preset items properties, set its initialization state as initialized and emit an initialization finished event', async () => {
    // Arrange
    useGlobalFilterServiceMock()
    useItemFetcherServiceMock()
    usePresetServiceMock()
    useTarkovValuesServiceMock()
    useWebsiteConfigurationServiceMock()

    const presetServiceSpy = spy(Services.get(PresetService))

    const itemService = new ItemService()

    // Act
    await itemService.initialize()

    // Assert
    verify(presetServiceSpy.fetchPresets()).once()
    verify(presetServiceSpy.updatePresetProperties(anything())).once()
  })

  it('should update the prices of all the items if the cache has expired', async () => {
    // Arrange
    useGlobalFilterServiceMock()
    useItemFetcherServiceMock()
    usePresetServiceMock()
    useTarkovValuesServiceMock()
    useWebsiteConfigurationServiceMock()
    Services.configure(NotificationService)

    const date1 = new Date(2000, 1, 1).getTime()
    const date2 = date1 + (Services.get(WebsiteConfigurationService).configuration.cacheDuration + 1) * 1000 // In ms
    MockDate.set(date1) // Used to mock dates because the hasValidCache() method checks the time ellapsed since the las time prices where fetched. Cf https://stackoverflow.com/a/57599680

    const itemFetcherServiceSpy = spy(Services.get(ItemFetcherService))

    const itemService = new ItemService()

    // Act
    await itemService.initialize()
    MockDate.set(date2)
    await itemService.initialize()

    // Assert
    verify(itemFetcherServiceSpy.fetchItems()).once()
    verify(itemFetcherServiceSpy.fetchPrices()).twice()

    MockDate.reset()
  })

  it('should do nothing if the cached data is up to date', async () => {
    // Arrange
    useGlobalFilterServiceMock()
    useItemFetcherServiceMock()
    usePresetServiceMock()
    useTarkovValuesServiceMock()
    useWebsiteConfigurationServiceMock()

    const itemFetcherServiceSpy = spy(Services.get(ItemFetcherService))

    const itemService = new ItemService()

    // Act
    await itemService.initialize()
    await itemService.initialize()

    // Assert
    verify(itemFetcherServiceSpy.fetchItems()).once()
    verify(itemFetcherServiceSpy.fetchPrices()).once()
  })

  it('should do nothing when services failed to initialize', async () => {
    // Arrange
    useGlobalFilterServiceMock()
    useItemFetcherServiceMock()
    usePresetServiceMock()
    useTarkovValuesServiceMock()
    useWebsiteConfigurationServiceMock()

    const itemFetcherServiceSpy = spy(Services.get(ItemFetcherService))
    Services.get(WebsiteConfigurationService).initializationState = ServiceInitializationState.error

    const itemService = new ItemService()

    // Act
    await itemService.initialize()

    // Assert
    verify(itemFetcherServiceSpy.fetchItems()).never()
    verify(itemFetcherServiceSpy.fetchPrices()).never()
    verify(itemFetcherServiceSpy.fetchPresets()).never()
    expect(itemService.initializationState).toBe(ServiceInitializationState.error)
  })
})