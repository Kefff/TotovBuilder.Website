import Configuration from '../../../test-data/configuration.json'
import { spy, verify, when } from 'ts-mockito'
import Services from '../../services/repository/Services'
import { ItemService } from '../../services/ItemService'
import { IItemFetcherService } from '../../services/fetchers/IItemFetcherService'
import { IInventoryItem } from '../../models/build/IInventoryItem'
import { IPrice } from '../../models/item/IPrice'
import Currencies from '../../assets/data/currencies.json'
import { ICurrency } from '../../models/configuration/ICurrency'
import Result, { FailureType } from '../../utils/Result'
import ItemCategories from '../../../test-data/item-categories.json'

describe('getCurrency()', () => {
  it.each([
    ['RUB'],
    ['USD'],
    ['EUR']
  ])('should get a currency', async (currencyName: string) => {
    // Arrange
    const itemService = new ItemService()

    // Act
    const currencyResult = await itemService.getCurrency(currencyName)

    // Assert
    expect(currencyResult.success).toBe(true)
    expect(currencyResult.value.name).toBe(currencyName)
  })

  it('should fail when the currency is not found', async () => {
    // Arrange
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
    const itemService = new ItemService()

    // Act
    const itemResult = await itemService.getItem('57dc2fa62459775949412633')

    // Assert
    expect(itemResult.success).toBe(true)
    expect(itemResult.value.id).toBe('57dc2fa62459775949412633')
    expect(itemResult.value.caption).toBe('AKS-74U 5.45x39 assault rifle')
    expect(itemResult.value.prices).toStrictEqual([
      {
        currencyName: 'RUB',
        merchant: 'prapor',
        merchantLevel: 1,
        requiresQuest: true,
        value: 28823,
        valueInMainCurrency: 28823
      },
      {
        currencyName: 'RUB',
        merchant: 'flea-market',
        merchantLevel: 0,
        questId: '',
        value: 22761,
        valueInMainCurrency: 22761
      }] as IPrice[])
  })

  it('should fail when getting an item that does not exist', async () => {
    // Arrange
    const itemService = new ItemService()

    // Act
    const itemResult = await itemService.getItem('invalid')

    // Assert
    expect(itemResult.success).toBe(false)
    expect(itemResult.failureMessage).toBe('Item "invalid" not found.')
  })

  it('should fail when fetching fails', async () => {
    // Arrange
    const ItemFetcherService = Services.getByName<IItemFetcherService>('ItemFetcherService')
    const itemFetcherServiceSpy = spy(ItemFetcherService)
    when(itemFetcherServiceSpy.fetchItemCategories()).thenResolve(Result.fail(FailureType.error))
    when(itemFetcherServiceSpy.fetchItems()).thenResolve(Result.fail(FailureType.error))
    when(itemFetcherServiceSpy.fetchMarketData()).thenResolve(Result.fail(FailureType.error))
    when(itemFetcherServiceSpy.fetchPresets()).thenResolve(Result.fail(FailureType.error))

    const itemService = new ItemService()

    // Act
    const itemResult = await itemService.getItem('57dc2fa62459775949412633')

    // Assert
    expect(itemResult.success).toBe(false)
    expect(itemResult.failureMessage).toBe('Item "57dc2fa62459775949412633" not found.')
  })

  it('should update the cache of all the items if the cache has expired', async () => {
    // Arrange
    const oldCacheDuration = Configuration.VITE_CACHE_DURATION
    Configuration.VITE_CACHE_DURATION = '0.1'

    const ItemFetcherService = Services.getByName<IItemFetcherService>('ItemFetcherService')
    const itemFetcherServiceSpy = spy(ItemFetcherService)
    const itemService = new ItemService()
    await new Promise((resolve) => setTimeout(resolve, 150))

    // Act
    const itemResult = await itemService.getItem('57dc2fa62459775949412633')

    // Assert
    verify(itemFetcherServiceSpy.fetchItems()).twice()
    expect(itemResult.success).toBe(true)
    expect(itemResult.value.id).toBe('57dc2fa62459775949412633')
    expect(itemResult.value.caption).toBe('AKS-74U 5.45x39 assault rifle')
    expect(itemResult.value.prices).toStrictEqual([
      {
        currencyName: 'RUB',
        merchant: 'prapor',
        merchantLevel: 1,
        requiresQuest: true,
        value: 28823,
        valueInMainCurrency: 28823
      },
      {
        currencyName: 'RUB',
        merchant: 'flea-market',
        merchantLevel: 0,
        questId: '',
        value: 22761,
        valueInMainCurrency: 22761
      }] as IPrice[])

    // Clean
    Configuration.VITE_CACHE_DURATION = oldCacheDuration
  })
})

describe('getItemCategories()', () => {
  it('should get item categories', async () => {
    // Arrange
    const itemService = new ItemService()

    // Act
    const itemCategories = await itemService.getItemCategories()

    // Assert
    expect(itemCategories).toStrictEqual(ItemCategories)
  })
})

describe('getItemsOfCategory()', () => {
  it('should get the items belonging to a category', async () => {
    // Arrange
    const itemService = new ItemService()

    // Act
    const itemResult = await itemService.getItemsOfCategory('securedContainer')

    // Assert
    expect(itemResult.success).toBe(true)
    expect(itemResult.value.map((i) => i.id).sort()).toStrictEqual([
      '544a11ac4bdc2d470e8b456a',
      '5732ee6a24597719ae0c0281',
      '5857a8b324597729ab0a0e7d',
      '5857a8bc2459772bad15db29',
      '59db794186f77448bc595262',
      '5c093ca986f7740a1867ab12',
      '5c0a5a5986f77476aa30ae64',
      '5c0a794586f77461c458f892'
    ])
  })

  it('should fail when no items belong to the category', async () => {
    // Arrange
    const itemService = new ItemService()

    // Act
    const itemResult = await itemService.getItemsOfCategory('invalid')

    // Assert
    expect(itemResult.success).toBe(false)
    expect(itemResult.failureMessage).not.toBe('')
  })

  it('should update all items if the cache has expired', async () => {
    // Arrange
    const oldCacheDuration = Configuration.VITE_CACHE_DURATION
    Configuration.VITE_CACHE_DURATION = '0.1'

    const ItemFetcherService = Services.getByName<IItemFetcherService>(
      'ItemFetcherService'
    )
    const itemService = new ItemService()
    const ItemFetcherServiceSpy = spy(ItemFetcherService)
    await new Promise<void>((resolve) => setTimeout(() => resolve(), 150))

    // Act
    const itemResult = await itemService.getItemsOfCategory('securedContainer')

    // Assert
    verify(ItemFetcherServiceSpy.fetchItems()).twice()
    expect(itemResult.success).toBe(true)
    expect(itemResult.value.map((i) => i.id).sort()).toStrictEqual([
      '544a11ac4bdc2d470e8b456a',
      '5732ee6a24597719ae0c0281',
      '5857a8b324597729ab0a0e7d',
      '5857a8bc2459772bad15db29',
      '59db794186f77448bc595262',
      '5c093ca986f7740a1867ab12',
      '5c0a5a5986f77476aa30ae64',
      '5c0a794586f77461c458f892'
    ])

    // Clean
    Configuration.VITE_CACHE_DURATION = oldCacheDuration
  })
})

describe('getMainCurrency()', () => {
  it('should get the main currency', async () => {
    // Arrange
    const itemService = new ItemService()

    // Act
    const currency = await itemService.getMainCurrency()

    // Assert
    expect(currency.success).toBe(true)
    expect(currency.value.name).toBe('RUB')
  })

  it('should fail when the main currency is not found', async () => {
    // Arrange
    const itemService = new ItemService()
    const mainCurrency = Currencies.find(c => c.name === 'RUB') as ICurrency
    mainCurrency.mainCurrency = false

    // Act
    const currencyResult = await itemService.getMainCurrency()

    // Assert
    expect(currencyResult.success).toBe(false)
    expect(currencyResult.failureMessage).toBe('Main currency not found.')

    // Clean
    mainCurrency.mainCurrency = true
  })
})

describe('getPreset()', () => {
  it.each([
    [
      '57dc2fa62459775949412633', // AKS-74U 5.45x39 assault rifle
      {
        content: [],
        ignorePrice: false,
        itemId: '57dc2fa62459775949412633', // AKS-74U 5.45x39 assault rifle
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
    // Act
    const service = new ItemService()
    const preset = await service.getPreset(id)

    // Assert
    if (expected === undefined) {
      expect(preset).toBeUndefined()
    } else {
      expect(preset).toStrictEqual(expected)
    }
  })
})