import MockDate from 'mockdate'
import { anything, instance, mock, spy, verify, when } from 'ts-mockito'
import { describe, expect, it } from 'vitest'
import { ICurrency } from '../../models/configuration/ICurrency'
import { IItem, ItemCategoryId } from '../../models/item/IItem'
import { GlobalFilterService } from '../../services/GlobalFilterService'
import { ItemFetcherService } from '../../services/ItemFetcherService'
import { ItemPropertiesService } from '../../services/ItemPropertiesService'
import { ItemService } from '../../services/ItemService'
import { LogService } from '../../services/LogService'
import { NotificationService, NotificationType } from '../../services/NotificationService'
import { PresetService } from '../../services/PresetService'
import { TarkovValuesService } from '../../services/TarkovValuesService'
import { WebsiteConfigurationService } from '../../services/WebsiteConfigurationService'
import { ServiceInitializationState } from '../../services/repository/ServiceInitializationState'
import Services from '../../services/repository/Services'
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

    // Act / Assert
    await itemService.initialize()

    const globalFilterService = Services.get(GlobalFilterService)
    globalFilterService.saveMerchantFilters([
      {
        enabled: true,
        merchant: 'prapor',
        merchantLevel: 4
      }
    ])

    let items = await itemService.getItems([ak12bt.id], true)
    expect(items.length).toBe(1)
    expect(items[0]).toStrictEqual(ak12bt)

    globalFilterService.saveMerchantFilters([{
      enabled: false,
      merchant: 'prapor',
      merchantLevel: 4
    }])

    items = await itemService.getItems([ak12bt.id], true)
    expect(items.length).toBe(0)
  })
})

describe('getCurrency()', () => {
  it.each([
    ['RUB'],
    ['USD'],
    ['EUR']
  ])('should get a currency', (currencyName: string) => {
    // Arrange
    useGlobalFilterServiceMock()
    useTarkovValuesServiceMock()
    const itemService = new ItemService()

    // Act
    const currency = itemService.getCurrency(currencyName)

    // Assert
    expect(currency.name).toBe(currencyName)
  })

  it('should throw when the currency is not found', () => {
    // Arrange
    useGlobalFilterServiceMock()
    useTarkovValuesServiceMock()

    const itemService = new ItemService()

    // Act
    const act = (): ICurrency => itemService.getCurrency('invalid')

    // Assert
    expect(act).toThrowError('Currency "invalid" not found')
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
    const item = await itemService.getItem(rpk16Default.id)

    // Assert
    expect(item).toStrictEqual({
      ...rpk16Default,
      prices: rpk16DefaultPrices
    })
  })

  it('should return the not found item and log an error when getting an item that does not exist', async () => {
    // Arrange
    useGlobalFilterServiceMock()
    useItemFetcherServiceMock()
    usePresetServiceMock()
    useTarkovValuesServiceMock()
    useWebsiteConfigurationServiceMock()

    const logServiceMock = mock<LogService>()
    Services.configure(LogService, undefined, instance(logServiceMock))

    const itemService = new ItemService()

    // Act
    const item = await itemService.getItem('invalid')

    // Assert
    const expected = ItemService.getNotFoundItem('invalid')

    expect(item).toStrictEqual(expected)
    verify(logServiceMock.logError('message.itemsNotFound', anything()))
  })

  it('should throw when accessing items after fetching failed', async () => {
    // Arrange
    useGlobalFilterServiceMock()
    usePresetServiceMock()
    useWebsiteConfigurationServiceMock()

    const logServiceMock = mock<LogService>()
    Services.configure(LogService, undefined, instance(logServiceMock))


    const itemFetcherServiceMock = mock<ItemFetcherService>()
    when(itemFetcherServiceMock.fetchItems()).thenResolve(undefined)
    when(itemFetcherServiceMock.fetchPrices()).thenResolve(PriceMocks)
    when(itemFetcherServiceMock.fetchPresets()).thenResolve(undefined)
    Services.configure(ItemFetcherService, undefined, instance(itemFetcherServiceMock))

    const itemService = new ItemService()

    // Act
    const act = (): Promise<IItem> => itemService.getItem(rpk16Default.id)

    // Assert
    await expect(act).rejects.toThrowError('No item could be fetched.')
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
    const items = await itemService.getItems([rpk16Default.id, nf30mm.id], false)

    // Assert
    expect(items).toStrictEqual(
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

    // Act
    await itemService.initialize()

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

    const items = await itemService.getItems([
      pso1.id, // Prapor 1
      nf30mm.id, // Jaeger 3 (excluded)
      ak12PistolGrip.id, // Prapor 2 (excluded)
      m9a3.id // Peacekeeper 1 (excluded because is preset base item)
    ], true)

    // Assert
    expect(items).toStrictEqual([
      {
        ...pso1,
        prices: pso1Prices
      }
    ])
  })

  it('should return the not found item and log an error when an item is not found and the global filter is not used', async () => {
    // Arrange
    useGlobalFilterServiceMock()
    useItemFetcherServiceMock()
    usePresetServiceMock()
    useTarkovValuesServiceMock()
    useWebsiteConfigurationServiceMock()

    const logServiceMock = mock<LogService>()
    Services.configure(LogService, undefined, instance(logServiceMock))

    const itemService = new ItemService()

    // Act
    const items = await itemService.getItems(['invalid1', nf30mm.id, 'invalid2'], false)

    // Assert
    const expected1 = ItemService.getNotFoundItem('invalid1')
    const expected2 = ItemService.getNotFoundItem('invalid2')

    expect(items).toStrictEqual([nf30mm, expected1, expected2])
    verify(logServiceMock.logError('message.itemsNotFound', anything()))
  })

  it('should throw when accessing items after fetching failed', async () => {
    // Arrange
    useGlobalFilterServiceMock()
    usePresetServiceMock()
    useWebsiteConfigurationServiceMock()
    Services.configure(NotificationService)

    const itemFetcherServiceMock = mock<ItemFetcherService>()
    when(itemFetcherServiceMock.fetchItems()).thenResolve(undefined)
    when(itemFetcherServiceMock.fetchPrices()).thenResolve(PriceMocks)
    when(itemFetcherServiceMock.fetchPresets()).thenResolve(undefined)
    Services.configure(ItemFetcherService, undefined, instance(itemFetcherServiceMock))

    const logServiceMock = mock<LogService>()
    Services.configure(LogService, undefined, instance(logServiceMock))

    const itemService = new ItemService()

    // Act
    const act = (): Promise<IItem[]> => itemService.getItems([rpk16Default.id], false)

    // Assert
    await expect(act).rejects.toThrowError('No item could be fetched.')
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
    const items = await itemService.getItemsOfCategories([ItemCategoryId.armband, ItemCategoryId.securedContainer])

    // Assert
    expect(items.map((i) => i.id).sort()).toStrictEqual([
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

    // Act
    await itemService.initialize()

    const globalFitlerService = Services.get(GlobalFilterService)
    globalFitlerService.saveMerchantFilters([
      {
        enabled: true,
        merchant: 'jaeger',
        merchantLevel: 1
      }
    ])

    const items = await itemService.getItemsOfCategories([ItemCategoryId.mainWeapon, ItemCategoryId.secondaryWeapon, ItemCategoryId.vest], true)

    // Assert
    expect(items.map((i) => i.id).sort()).toStrictEqual([
      scavVest.id,
      opSksDefault.id,
      mts25512Default.id
    ])
  })

  it('should return no items when no items belong to the categories', async () => {
    // Arrange
    useGlobalFilterServiceMock()
    useItemFetcherServiceMock()
    usePresetServiceMock()
    useTarkovValuesServiceMock()
    useWebsiteConfigurationServiceMock()

    const logServiceMock = mock<LogService>()
    Services.configure(LogService, undefined, instance(logServiceMock))

    const itemService = new ItemService()

    // Act
    const items = await itemService.getItemsOfCategories(['invalid' as unknown as ItemCategoryId, 'invalid2' as unknown as ItemCategoryId])

    // Assert
    expect(items.length).toBe(0)
  })

  it('should return no items and log an error when no items are found an the global filter is not used', async () => {
    // Arrange
    useGlobalFilterServiceMock()
    useItemFetcherServiceMock()
    usePresetServiceMock()
    useTarkovValuesServiceMock()
    useWebsiteConfigurationServiceMock()

    const logServiceMock = mock<LogService>()
    Services.configure(LogService, undefined, instance(logServiceMock))

    const itemService = new ItemService()

    // Act
    const items = await itemService.getItemsOfCategories(['invalid1' as unknown as ItemCategoryId, 'invalid2' as unknown as ItemCategoryId], false)

    // Assert
    expect(items.length).toBe(0)
    verify(logServiceMock.logError('message.itemsOfCategoriesNotFound', anything()))
  })
})

describe('getMainCurrency()', () => {
  it('should get the main currency', () => {
    // Arrange
    useGlobalFilterServiceMock()
    useTarkovValuesServiceMock()

    const itemService = new ItemService()

    // Act
    const currency = itemService.getMainCurrency()

    // Assert
    expect(currency.name).toBe('RUB')
  })

  it('should throw if the main currency cannot be found', () => {
    // Arrange
    useGlobalFilterServiceMock()
    useTarkovValuesServiceMock()

    const tarkovValuesServiceMock = Services.get(TarkovValuesService)
    const originalCurrencies = tarkovValuesServiceMock.values.currencies
    tarkovValuesServiceMock.values.currencies = tarkovValuesServiceMock.values.currencies.filter(i => !i.mainCurrency)

    const itemService = new ItemService()

    // Act
    const act = (): ICurrency => itemService.getMainCurrency()

    // Assert
    expect(act).toThrowError('Main currency not found.')

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

  it('should notify when price fetching fails and set the last price fetch date in the future to avoid fetching prices again immediatly', async () => {
    // Arrange
    useGlobalFilterServiceMock()
    useItemFetcherServiceMock()
    usePresetServiceMock()
    useTarkovValuesServiceMock()
    useWebsiteConfigurationServiceMock()

    const itemFetcherServiceMock = mock<ItemFetcherService>()
    when(itemFetcherServiceMock.fetchItems()).thenResolve(ItemMocks)
    when(itemFetcherServiceMock.fetchPresets()).thenResolve(PresetMocks)
    when(itemFetcherServiceMock.fetchPrices()).thenResolve(undefined)
    Services.configure(ItemFetcherService, undefined, instance(itemFetcherServiceMock))

    const notificationServiceMock = mock<NotificationService>()
    Services.configure(NotificationService, undefined, instance(notificationServiceMock))

    const itemService = new ItemService()

    // Act
    await itemService.initialize()

    // Assert
    verify(notificationServiceMock.notify(NotificationType.error, 'Something went wrong while updating prices.\nTry waiting a bit and reloading the page.')).once()
  })
})