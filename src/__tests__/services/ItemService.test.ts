import { anything, instance, mock, spy, verify, when } from 'ts-mockito'
import Services from '../../services/repository/Services'
import { ItemService } from '../../services/ItemService'
import { IPrice } from '../../models/item/IPrice'
import Result, { FailureType } from '../../utils/Result'
import ItemCategories from '../__data__/item-categories.json'
import { ItemFetcherService } from '../../services/ItemFetcherService'
import { useWebsiteConfigurationServiceMock } from '../__mocks__/WebsiteConfigurationServiceMock'
import { useTarkovValuesServiceMock } from '../__mocks__/TarkovValuesServiceMock'
import { TarkovValuesService } from '../../services/TarkovValuesService'
import { useItemFetcherServiceMock } from '../__mocks__/ItemFetcherServiceMock'
import { NotificationService } from '../../services/NotificationService'
import { WebsiteConfigurationService } from '../../services/WebsiteConfigurationService'
import MockDate from 'mockdate'
import ItemCategoriesMock from '../__data__/item-categories.json'
import ItemsMock from '../__data__/items'
import PresetsMock from '../__data__/presets'
import PricesMock from '../__data__/prices'
import { IItem } from '../../models/item/IItem'
import { usePresetServiceMock } from '../__mocks__/PresetPropertiesServiceMock'
import { GlobalFilterService } from '../../services/GlobalFilterService'
import { PresetService } from '../../services/PresetService'
import { ItemPropertiesService } from '../../services/ItemPropertiesService'
import { useGlobalFilterServiceMock } from '../__mocks__/GlobalFilterServiceMock'
import { describe, expect, it } from 'vitest'
import { ServiceInitializationState } from '../../services/repository/ServiceInitializationState'

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
    globalFilterService.saveMerchantFilters([{
      enabled: true,
      merchant: 'prapor',
      merchantLevel: 4
    }])

    // Act / Assert
    let itemResult = await itemService.getItem('5c0d668f86f7747ccb7f13b2', true) // 9x39mm SPP gs
    expect(itemResult.success).toBe(true)

    globalFilterService.saveMerchantFilters([{
      enabled: false,
      merchant: 'prapor',
      merchantLevel: 4
    }])

    itemResult = await itemService.getItem('5c0d668f86f7747ccb7f13b2', true) // 9x39mm SPP gs
    expect(itemResult.success).toBe(false)
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
    when(itemFetcherServiceMock.fetchItemCategories()).thenReturn(Promise.resolve(Result.fail(FailureType.error, undefined, 'Fetch error')))
    when(itemFetcherServiceMock.fetchItems()).thenReturn(Promise.resolve(Result.ok(ItemsMock as IItem[])))
    when(itemFetcherServiceMock.fetchPresets()).thenReturn(Promise.resolve(Result.ok(PresetsMock)))
    when(itemFetcherServiceMock.fetchPrices()).thenReturn(Promise.resolve(Result.ok(PricesMock as IPrice[])))
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
    when(itemFetcherServiceMock.fetchItemCategories()).thenReturn(Promise.resolve(Result.ok(ItemCategoriesMock)))
    when(itemFetcherServiceMock.fetchItems()).thenReturn(Promise.resolve(Result.fail(FailureType.error, undefined, 'Fetch error')))
    when(itemFetcherServiceMock.fetchPresets()).thenReturn(Promise.resolve(Result.ok(PresetsMock)))
    when(itemFetcherServiceMock.fetchPrices()).thenReturn(Promise.resolve(Result.ok(PricesMock as IPrice[])))
    Services.configure(ItemFetcherService, undefined, instance(itemFetcherServiceMock))

    // Act
    const itemService = new ItemService()
    const itemResult = await itemService.getItem('624c0b3340357b5f566e8766')

    // Assert
    expect(itemResult.success).toBe(false)
    expect(itemResult.failureMessage).toBe('Item "624c0b3340357b5f566e8766" not found.')
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
    const currencyResult = await itemService.getCurrency(currencyName)

    // Assert
    expect(currencyResult.success).toBe(true)
    expect(currencyResult.value.name).toBe(currencyName)
  })

  it('should fail when the currency is not found', async () => {
    // Arrange
    useGlobalFilterServiceMock()
    useTarkovValuesServiceMock()
    const itemService = new ItemService()

    // Act
    const currencyResult = await itemService.getCurrency('invalid')

    // Assert
    expect(currencyResult.success).toBe(false)
    expect(currencyResult.failureMessage).toBe('Currency "invalid" not found')
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
    const itemResult = await itemService.getItem('584147732459775a2b6d9f12')

    // Assert
    expect(itemResult.success).toBe(true)
    expect(itemResult.value.id).toBe('584147732459775a2b6d9f12')
    expect(itemResult.value.name).toBe('Kalashnikov AKS-74U 5.45x39 assault rifle Default')
    expect(itemResult.value.prices).toStrictEqual([
      {
        barterItems: [],
        currencyName: 'RUB',
        itemId: '584147732459775a2b6d9f12', // Kalashnikov AKS-74U 5.45x39 assault rifle Default
        merchant: 'prapor',
        merchantLevel: 1,
        quest: {
          id: '5936d90786f7742b1420ba5b',
          name: 'Debut',
          wikiLink: 'https://escapefromtarkov.fandom.com/wiki/Debut'
        },
        value: 24605,
        valueInMainCurrency: 24605
      },
      {
        barterItems: [],
        currencyName: 'RUB',
        itemId: '584147732459775a2b6d9f12',
        merchant: 'flea-market',
        merchantLevel: 0,
        quest: undefined,
        value: 28999,
        valueInMainCurrency: 28999
      }] as IPrice[])
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
    const itemResult = await itemService.getItem('57dc2fa62459775949412633')

    // Assert
    expect(itemResult.success).toBe(false)
    expect(itemResult.failureMessage).toBe('Item "57dc2fa62459775949412633" not found.')
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
    const itemsResult = await itemService.getItems(['584147732459775a2b6d9f12', '5c1d0f4986f7744bb01837fa'])

    // Assert
    expect(itemsResult.success).toBe(true)
    expect(itemsResult.value).toHaveLength(2)
    expect(itemsResult.value[0].id).toBe('584147732459775a2b6d9f12')
    expect(itemsResult.value[0].name).toBe('Kalashnikov AKS-74U 5.45x39 assault rifle Default')
    expect(itemsResult.value[0].prices).toStrictEqual([
      {
        barterItems: [],
        currencyName: 'RUB',
        itemId: '584147732459775a2b6d9f12', // Kalashnikov AKS-74U 5.45x39 assault rifle Default
        merchant: 'prapor',
        merchantLevel: 1,
        quest: {
          id: '5936d90786f7742b1420ba5b',
          name: 'Debut',
          wikiLink: 'https://escapefromtarkov.fandom.com/wiki/Debut'
        },
        value: 24605,
        valueInMainCurrency: 24605
      },
      {
        barterItems: [],
        currencyName: 'RUB',
        itemId: '584147732459775a2b6d9f12',
        merchant: 'flea-market',
        merchantLevel: 0,
        quest: undefined,
        value: 28999,
        valueInMainCurrency: 28999
      }] as IPrice[])
    expect(itemsResult.value[1].id).toBe('5c1d0f4986f7744bb01837fa')
    expect(itemsResult.value[1].name).toBe('TerraGroup Labs keycard (Black)')
    expect(itemsResult.value[1].prices).toStrictEqual([
      {
        barterItems: [
          {
            itemId: '5d03794386f77420415576f5',
            quantity: 5
          },
          {
            itemId: '5e2aee0a86f774755a234b62',
            quantity: 8
          },
          {
            itemId: '5c052fb986f7746b2101e909',
            quantity: 2
          },
          {
            itemId: '61bf7c024770ee6f9c6b8b53',
            quantity: 1
          }
        ],
        currencyName: 'barter',
        itemId: '5c1d0f4986f7744bb01837fa',
        merchant: 'mechanic',
        merchantLevel: 4,
        quest: undefined,
        value: 0,
        valueInMainCurrency: 0
      }
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
        merchant: 'prapor',
        merchantLevel: 1
      }
    ])

    // Act
    const itemsResult = await itemService.getItems([
      '584147732459775a2b6d9f12', // AKS-74U Default (Prapor 1)
      '5c1d0f4986f7744bb01837fa', // TerraGroup Labs keycard (Black) (Mechanic 4)
      '5dd7f8c524e5d7504a4e3077', // Kalashnikov AK-74 5.45x39 assault rifle Plum (Prapor 2),
      '57dc2fa62459775949412633' // Kalashnikov AKS-74U 5.45x39 assault rifle (Prapor 1), excluded because is preset base item
    ], true)

    // Assert
    expect(itemsResult.success).toBe(true)
    expect(itemsResult.value).toHaveLength(1)
    expect(itemsResult.value[0].id).toBe('584147732459775a2b6d9f12')
    expect(itemsResult.value[0].name).toBe('Kalashnikov AKS-74U 5.45x39 assault rifle Default')
    expect(itemsResult.value[0].prices).toStrictEqual([
      {
        barterItems: [],
        currencyName: 'RUB',
        itemId: '584147732459775a2b6d9f12', // Kalashnikov AKS-74U 5.45x39 assault rifle Default
        merchant: 'prapor',
        merchantLevel: 1,
        quest: {
          id: '5936d90786f7742b1420ba5b',
          name: 'Debut',
          wikiLink: 'https://escapefromtarkov.fandom.com/wiki/Debut'
        },
        value: 24605,
        valueInMainCurrency: 24605
      },
      {
        barterItems: [],
        currencyName: 'RUB',
        itemId: '584147732459775a2b6d9f12',
        merchant: 'flea-market',
        merchantLevel: 0,
        quest: undefined,
        value: 28999,
        valueInMainCurrency: 28999
      }] as IPrice[])
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
    const itemsResult = await itemService.getItems(['invalid1', '5c1d0f4986f7744bb01837fa', 'invalid2'], false)

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
    const itemsResult = await itemService.getItems(['57dc2fa62459775949412633', '5c1d0f4986f7744bb01837fa'])

    // Assert
    expect(itemsResult.success).toBe(false)
    expect(itemsResult.failureMessage).toBe('Items "57dc2fa62459775949412633", "5c1d0f4986f7744bb01837fa" not found.')
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
    expect(itemCategories).toStrictEqual(ItemCategories)
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
      '544a11ac4bdc2d470e8b456a',
      '5732ee6a24597719ae0c0281',
      '5857a8b324597729ab0a0e7d',
      '5857a8bc2459772bad15db29',
      '59db794186f77448bc595262',
      '5b3f16c486f7747c327f55f7',
      '5b3f3ade86f7746b6b790d8e',
      '5b3f3af486f774679e752c1f',
      '5b3f3b0186f774021a2afef7',
      '5b3f3b0e86f7746752107cda',
      '5c093ca986f7740a1867ab12',
      '5f9949d869e2777a0e779ba5',
      '60b0f988c4449e4cb624c1da',
      '619bc61e86e01e16f839a999',
      '619bdd8886e01e16f839a99c',
      '619bddc6c9546643a67df6ee',
      '619bddffc9546643a67df6f0',
      '619bde3dc9546643a67df6f2',
      '619bde7fc9546643a67df6f4',
      '619bdeb986e01e16f839a99e',
      '619bdef8c9546643a67df6f6',
      '619bdf9cc9546643a67df6f8',
      '619bdfd4c9546643a67df6fa'
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
        merchant: 'prapor',
        merchantLevel: 1
      }
    ])

    // Act
    const itemResult = await itemService.getItemsOfCategories(['mainWeapon', 'secondaryWeapon'], true)

    // Assert
    expect(itemResult.success).toBe(true)
    expect(itemResult.value.map((i) => i.id).sort()).toStrictEqual([
      '584147732459775a2b6d9f12', // Kalashnikov AKS-74U 5.45x39 assault rifle Default
      'mosinscopedbarter0000001' // Mosin 7.62x54R bolt-action rifle (Sniper) PU 3.5x
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