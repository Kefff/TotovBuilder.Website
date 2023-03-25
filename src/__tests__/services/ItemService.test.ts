import { instance, mock, spy, verify, when } from 'ts-mockito'
import Services from '../../services/repository/Services'
import { ItemService } from '../../services/ItemService'
import { IInventoryItem } from '../../models/build/IInventoryItem'
import { IPrice } from '../../models/item/IPrice'
import Result, { FailureType } from '../../utils/Result'
import ItemCategories from '../../../test-data/item-categories.json'
import { ItemFetcherService } from '../../services/ItemFetcherService'
import { useWebsiteConfigurationServiceMock } from '../../__mocks__/WebsiteConfigurationServiceMock'
import { useTarkovValuesServiceMock } from '../../__mocks__/TarkovValuesServiceMock'
import { TarkovValuesService } from '../../services/TarkovValuesService'
import { useItemFetcherServiceMock } from '../../__mocks__/ItemFetcherServiceMock'
import { NotificationService, NotificationType } from '../../services/NotificationService'
import { WebsiteConfigurationService } from '../../services/WebsiteConfigurationService'
import MockDate from 'mockdate'
import ItemCategoriesMock from '../../../test-data/item-categories.json'
import ItemsMock from '../../../test-data/items.json'
import PresetsMock from '../../../test-data/presets.json'
import PricesMock from '../../../test-data/prices.json'
import { IItem } from '../../models/item/IItem'


describe('fetchItemCategories()', () => {
  it('should not update item categories when fetching fails', async () => {
    // Arrange
    useTarkovValuesServiceMock()
    useWebsiteConfigurationServiceMock()

    const notificationServiceMock = mock<NotificationService>()
    Services.configure(NotificationService, undefined, instance(notificationServiceMock))

    const itemFetcherServiceMock = mock<ItemFetcherService>()
    when(itemFetcherServiceMock.fetchItemCategories()).thenReturn(Promise.resolve(Result.fail(FailureType.error, undefined, 'API error')))
    when(itemFetcherServiceMock.fetchItems()).thenReturn(Promise.resolve(Result.ok(ItemsMock as IItem[])))
    when(itemFetcherServiceMock.fetchPresets()).thenReturn(Promise.resolve(Result.ok(PresetsMock)))
    when(itemFetcherServiceMock.fetchPrices()).thenReturn(Promise.resolve(Result.ok(PricesMock as IPrice[])))
    Services.configure(ItemFetcherService, undefined, instance(itemFetcherServiceMock))

    // Act
    const itemService = new ItemService()
    const itemCategories = await itemService.getItemCategories()

    // Assert
    verify(notificationServiceMock.notify(NotificationType.error, 'API error', true)).once()
    expect(itemCategories).toStrictEqual([])
  })
})

describe('fetchItems()', () => {
  it('should not update items when fetching fails', async () => {
    // Arrange
    useTarkovValuesServiceMock()
    useWebsiteConfigurationServiceMock()

    const notificationServiceMock = mock<NotificationService>()
    Services.configure(NotificationService, undefined, instance(notificationServiceMock))

    const itemFetcherServiceMock = mock<ItemFetcherService>()
    when(itemFetcherServiceMock.fetchItemCategories()).thenReturn(Promise.resolve(Result.ok(ItemCategoriesMock)))
    when(itemFetcherServiceMock.fetchItems()).thenReturn(Promise.resolve(Result.fail(FailureType.error, undefined, 'API error')))
    when(itemFetcherServiceMock.fetchPresets()).thenReturn(Promise.resolve(Result.ok(PresetsMock)))
    when(itemFetcherServiceMock.fetchPrices()).thenReturn(Promise.resolve(Result.ok(PricesMock as IPrice[])))
    Services.configure(ItemFetcherService, undefined, instance(itemFetcherServiceMock))

    // Act
    const itemService = new ItemService()
    const itemResult = await itemService.getItem('624c0b3340357b5f566e8766')

    // Assert
    verify(notificationServiceMock.notify(NotificationType.error, 'API error', true)).once()
    expect(itemResult.success).toBe(false)
    expect(itemResult.failureMessage).toBe('Item "624c0b3340357b5f566e8766" not found.')
  })
})

describe('fetchPresets()', () => {
  it('should not update presets when fetching fails', async () => {
    // Arrange
    useTarkovValuesServiceMock()
    useWebsiteConfigurationServiceMock()

    const notificationServiceMock = mock<NotificationService>()
    Services.configure(NotificationService, undefined, instance(notificationServiceMock))

    const itemFetcherServiceMock = mock<ItemFetcherService>()
    when(itemFetcherServiceMock.fetchItemCategories()).thenReturn(Promise.resolve(Result.ok(ItemCategoriesMock)))
    when(itemFetcherServiceMock.fetchItems()).thenReturn(Promise.resolve(Result.ok(ItemsMock as IItem[])))
    when(itemFetcherServiceMock.fetchPresets()).thenReturn(Promise.resolve(Result.fail(FailureType.error, undefined, 'API error')))
    when(itemFetcherServiceMock.fetchPrices()).thenReturn(Promise.resolve(Result.ok(PricesMock as IPrice[])))
    Services.configure(ItemFetcherService, undefined, instance(itemFetcherServiceMock))

    // Act
    const itemService = new ItemService()
    const preset = await itemService.getPreset('5ab8e9fcd8ce870019439434')

    // Assert
    verify(notificationServiceMock.notify(NotificationType.error, 'API error', true)).once()
    expect(preset).toBeUndefined()
  })
})

describe('getCurrency()', () => {
  it.each([
    ['RUB'],
    ['USD'],
    ['EUR']
  ])('should get a currency', async (currencyName: string) => {
    // Arrange
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
    useItemFetcherServiceMock()
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
        quest: null,
        value: 28999,
        valueInMainCurrency: 28999
      }] as IPrice[])
  })

  it('should fail when getting an item that does not exist', async () => {
    // Arrange
    useItemFetcherServiceMock()
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

describe('getItemCategories()', () => {
  it('should get item categories', async () => {
    // Arrange
    useItemFetcherServiceMock()
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
  it('should get the items belonging to categories', async () => {
    // Arrange
    useItemFetcherServiceMock()
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

  it('should fail when no items belong to the category', async () => {
    // Arrange
    useItemFetcherServiceMock()
    useTarkovValuesServiceMock()
    useWebsiteConfigurationServiceMock()

    const itemService = new ItemService()

    // Act
    const itemResult = await itemService.getItemsOfCategories(['invalid, invalid2'])

    // Assert
    expect(itemResult.success).toBe(false)
    expect(itemResult.failureMessage).not.toBe('')
  })
})

describe('getMainCurrency()', () => {
  it('should get the main currency', async () => {
    // Arrange
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
    useTarkovValuesServiceMock()
    Services.get(TarkovValuesService).values.currencies = Services.get(TarkovValuesService).values.currencies.filter(i => !i.mainCurrency)

    const itemService = new ItemService()

    // Act
    const currencyResult = await itemService.getMainCurrency()

    // Assert
    expect(currencyResult.success).toBe(false)
    expect(currencyResult.failureMessage).toBe('Main currency not found.')
  })
})

describe('getPreset()', () => {
  it.each([
    [
      '584147732459775a2b6d9f12', // AKS-74U 5.45x39 assault rifle
      {
        content: [],
        ignorePrice: false,
        itemId: '584147732459775a2b6d9f12', // AKS-74U 5.45x39 assault rifle Default
        modSlots: [
          {
            item: {
              content: [],
              ignorePrice: false,
              itemId: '57e3dba62459770f0c32322b', // AK-74 textolite pistol grip (6P4 Sb.9)
              modSlots: [],
              quantity: 1
            },
            modSlotName: 'mod_pistol_grip'
          },
          {
            item: {
              content: [],
              ignorePrice: false,
              itemId: '57dc347d245977596754e7a1', // AKS-74U metal skeleton stock (6P26 Sb.5)
              modSlots: [],
              quantity: 1
            },
            modSlotName: 'mod_stock'
          },
          {
            item: {
              content: [],
              ignorePrice: false,
              itemId: '564ca99c4bdc2d16268b4589', // AK-74 5.45x39 6L20 30-round magazine
              modSlots: [],
              quantity: 1
            },
            modSlotName: 'mod_magazine'
          },
          {
            item: {
              content: [],
              ignorePrice: false,
              itemId: '57dc324a24597759501edc20', // AKS-74U 5.45x39 muzzle brake (6P26 0-20)
              modSlots: [],
              quantity: 1
            },
            modSlotName: 'mod_muzzle'
          },
          {
            item: {
              content: [],
              ignorePrice: false,
              itemId: '57dc334d245977597164366f', // AKS-74U dust cover (6P26 Sb.7)
              modSlots: [],
              quantity: 1
            },
            modSlotName: 'mod_reciever'
          },
          {
            item: {
              content: [],
              ignorePrice: false,
              itemId: '59d36a0086f7747e673f3946', // AKS-74U gas tube"
              modSlots: [
                {
                  item: {
                    content: [],
                    ignorePrice: false,
                    itemId: '57dc32dc245977596d4ef3d3', // AKS-74U wooden handguard (6P26 Sb.6)
                    modSlots: [],
                    quantity: 1
                  },
                  modSlotName: 'mod_handguard'
                }
              ],
              quantity: 1
            },
            modSlotName: 'mod_gas_block'
          }
        ],
        quantity: 1
      } as IInventoryItem
    ],
    [
      '590c678286f77426c9660122', // IFAK individual first aid kit
      undefined
    ]
  ])('should get a preset', async (id: string, expected: IInventoryItem | undefined) => {
    // Arrange
    useItemFetcherServiceMock()
    useTarkovValuesServiceMock()
    useWebsiteConfigurationServiceMock()

    Services.configure(NotificationService)

    const service = new ItemService()

    // Act
    const preset = await service.getPreset(id)

    // Assert
    if (expected == null) {
      expect(preset).toBeUndefined()
    } else {
      expect(preset).toStrictEqual(expected)
    }
  })
})

describe('initialize', () => {
  it('should update the prices of all the items if the cache has expired', async () => {
    // Arrange
    useItemFetcherServiceMock()
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
    useItemFetcherServiceMock()
    useTarkovValuesServiceMock()
    useWebsiteConfigurationServiceMock()
    Services.configure(NotificationService)

    const itemFetcherServiceSpy = spy(Services.get(ItemFetcherService))

    const itemService = new ItemService()

    // Act
    await itemService.initialize()
    await itemService.initialize()

    // Assert
    verify(itemFetcherServiceSpy.fetchItems()).once()
    verify(itemFetcherServiceSpy.fetchPrices()).once()
  })
})