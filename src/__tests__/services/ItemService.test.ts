import Configuration from '../../../test-data/configuration.json'
import { spy, verify, when } from 'ts-mockito'
import Services from '../../services/repository/Services'
import { ItemService } from '../../services/ItemService'
import { IItemFetcherService } from '../../services/fetchers/IItemFetcherService'
import { IInventoryItem } from '../../models/build/IInventoryItem'
import { IPrice } from '../../models/utils/IPrice'
import Currencies from '../../assets/data/currencies.json'
import { ICurrency } from '../../models/item/ICurrency'
import Result, { FailureType } from '../../utils/Result'

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
        merchant: 'fleaMarket',
        merchantLevel: undefined,
        requiresQuest: false,
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
        merchant: 'fleaMarket',
        merchantLevel: undefined,
        requiresQuest: false,
        value: 22761,
        valueInMainCurrency: 22761
      }] as IPrice[])
  })
})

describe('getItemCategories()', () => {
  it('should get item categories', async () => {
    // Arrange
    const itemService = new ItemService()

    // Act
    const itemCategories = await itemService.getItemCategories()

    // Assert
    expect(itemCategories).toStrictEqual([
      {
        'id': 'ammunition',
        'types': [
          {
            'id': '5485a8684bdc2da71d8b4567',
            'name': 'Ammo'
          }
        ]
      },
      {
        'id': 'armband',
        'types': [
          {
            'id': '5b3f15d486f77432d0509248',
            'name': 'ArmBand'
          }
        ]
      },
      {
        'id': 'armor',
        'types': [
          {
            'id': '5448e54d4bdc2dcc718b4568',
            'name': 'Armor'
          }
        ]
      },
      {
        'id': 'armorMod',
        'types': [
          {
            'id': '57bef4c42459772e8d35a53b',
            'name': 'ArmoredEquipment'
          }
        ]
      },
      {
        'id': 'backpack',
        'types': [
          {
            'id': '5448e53e4bdc2d60728b4567',
            'name': 'Backpack'
          }
        ]
      },
      {
        'id': 'compass',
        'types': [
          {
            'id': '5f4fbaaca5573a5ac31db429',
            'name': 'Compass'
          }
        ]
      },
      {
        'id': 'container',
        'types': [
          {
            'id': '5795f317245977243854e041',
            'name': 'SimpleContainer'
          }
        ]
      },
      {
        'id': 'currency',
        'types': [
          {
            'id': '543be5dd4bdc2deb348b4569',
            'name': 'Money'
          }
        ]
      },
      {
        'id': 'eyewear',
        'types': [
          {
            'id': '5448e5724bdc2ddf718b4568',
            'name': 'Visors'
          }
        ]
      },
      {
        'id': 'faceCover',
        'types': [
          {
            'id': '5a341c4686f77469e155819e',
            'name': 'FaceCover'
          }
        ]
      },
      {
        'id': 'food',
        'types': [
          {
            'id': '5448e8d64bdc2dce718b4568',
            'name': 'Drink'
          },
          {
            'id': '5448e8d04bdc2ddf718b4569',
            'name': 'Food'
          }
        ]
      },
      {
        'id': 'grenade',
        'types': [
          {
            'id': '543be6564bdc2df4348b4568',
            'name': 'ThrowWeap'
          }
        ]
      },
      {
        'id': 'headphones',
        'types': [
          {
            'id': '5645bcb74bdc2ded0b8b4578',
            'name': 'Headphones'
          }
        ]
      },
      {
        'id': 'headwear',
        'types': [
          {
            'id': '5a341c4086f77401f2541505',
            'name': 'Headwear'
          }
        ]
      },
      {
        'id': 'magazine',
        'types': [
          {
            'id': '610720f290b75a49ff2e5e25',
            'name': 'CylinderMagazine'
          },
          {
            'id': '5448bc234bdc2d3c308b4569',
            'name': 'Magazine'
          }
        ]
      },
      {
        'id': 'mainWeapon',
        'types': [
          {
            'id': '5447b5fc4bdc2d87278b4567',
            'name': 'AssaultCarbine'
          },
          {
            'id': '5447b5f14bdc2d61278b4567',
            'name': 'AssaultRifle'
          },
          {
            'id': '5447bedf4bdc2d87278b4568',
            'name': 'GrenadeLauncher'
          },
          {
            'id': '5447bed64bdc2d97278b4568',
            'name': 'MachineGun'
          },
          {
            'id': '5447b6194bdc2d67278b4567',
            'name': 'MarksmanRifle'
          },
          {
            'id': '617f1ef5e8b54b0998387733',
            'name': 'Revolver'
          },
          {
            'id': '5447b6094bdc2dc3278b4567',
            'name': 'Shotgun'
          },
          {
            'id': '5447b5e04bdc2d62278b4567',
            'name': 'Smg'
          },
          {
            'id': '5447b6254bdc2dc3278b4568',
            'name': 'SniperRifle'
          }
        ]
      },
      {
        'id': 'medical',
        'types': [
          {
            'id': '5448f3a14bdc2d27728b4569',
            'name': 'Drugs'
          },
          {
            'id': '5448f3ac4bdc2dce718b4569',
            'name': 'Medical'
          },
          {
            'id': '5448f39d4bdc2d0a728b4568',
            'name': 'MedKit'
          },
          {
            'id': '5448f3a64bdc2d60728b456a',
            'name': 'Stimulator'
          }
        ]
      },
      {
        'id': 'meleeWeapon',
        'types': [
          {
            'id': '5447e1d04bdc2dff2f8b4567',
            'name': 'Knife'
          }
        ]
      },
      {
        'id': 'mod',
        'types': [
          {
            'id': '55818b084bdc2d5b648b4571',
            'name': 'Flashlight'
          },
          {
            'id': '55818b224bdc2dde698b456f',
            'name': 'Mount'
          },
          {
            'id': '5a2c3a9486f774688b05e574',
            'name': 'NightVision'
          },
          {
            'id': '5d21f59b6dbe99052b54ef83',
            'name': 'ThermalVision'
          }
        ]
      },
      {
        'id': 'other',
        'types': [
          {
            'id': '543be5cb4bdc2deb348b4568',
            'name': 'AmmoBox'
          },
          {
            'id': '57864ee62459775490116fc1',
            'name': 'Battery'
          },
          {
            'id': '57864ada245977548638de91',
            'name': 'BuildingMaterial'
          },
          {
            'id': '57864a66245977548f04a81f',
            'name': 'Electronics'
          },
          {
            'id': '5d650c3e815116009f6201d2',
            'name': 'Fuel'
          },
          {
            'id': '57864c322459775490116fbf',
            'name': 'HouseholdGoods'
          },
          {
            'id': '5448ecbe4bdc2d60728b4568',
            'name': 'Info'
          },
          {
            'id': '57864a3d24597754843f8721',
            'name': 'Jewelry'
          },
          {
            'id': '5c164d2286f774194c5e69fa',
            'name': 'Keycard'
          },
          {
            'id': '5c99f98d86f7745c314214b3',
            'name': 'KeyMechanical'
          },
          {
            'id': '57864e4c24597754843f8723',
            'name': 'Lubricant'
          },
          {
            'id': '57864c8c245977548867e7f1',
            'name': 'MedicalSupplies'
          },
          {
            'id': '590c745b86f7743cc433c5f2',
            'name': 'Other'
          },
          {
            'id': '61605ddea09d851a0a0c1bbc',
            'name': 'PortableRangeFinder'
          },
          {
            'id': '57864bb7245977548b3b66c2',
            'name': 'Tool'
          }
        ]
      },
      {
        'id': 'rangedWeaponMod',
        'types': [
          {
            'id': '55818add4bdc2d5b648b456f',
            'name': 'AssaultScope'
          },
          {
            'id': '5a74651486f7744e73386dd1',
            'name': 'AuxiliaryMod'
          },
          {
            'id': '555ef6e44bdc2de9068b457e',
            'name': 'Barrel'
          },
          {
            'id': '55818afb4bdc2dde698b456d',
            'name': 'Bipod'
          },
          {
            'id': '55818a6f4bdc2db9688b456b',
            'name': 'Charge'
          },
          {
            'id': '55818ad54bdc2ddc698b4569',
            'name': 'Collimator'
          },
          {
            'id': '55818acf4bdc2dde698b456b',
            'name': 'CompactCollimator'
          },
          {
            'id': '550aa4bf4bdc2dd6348b456b',
            'name': 'FlashHider'
          },
          {
            'id': '55818af64bdc2d5b648b4570',
            'name': 'Foregrip'
          },
          {
            'id': '56ea9461d2720b67698b456f',
            'name': 'Gasblock'
          },
          {
            'id': '55818a104bdc2db9688b4569',
            'name': 'Handguard'
          },
          {
            'id': '55818ac54bdc2d5b648b456e',
            'name': 'IronSight'
          },
          {
            'id': '55818b014bdc2ddc698b456b',
            'name': 'Launcher'
          },
          {
            'id': '550aa4dd4bdc2dc9348b4569',
            'name': 'MuzzleCombo'
          },
          {
            'id': '55818ae44bdc2dde698b456c',
            'name': 'OpticScope'
          },
          {
            'id': '55818a684bdc2ddd698b456d',
            'name': 'PistolGrip'
          },
          {
            'id': '55818a304bdc2db5418b457d',
            'name': 'Receiver'
          },
          {
            'id': '550aa4cd4bdc2dd8348b456c',
            'name': 'Silencer'
          },
          {
            'id': '55818aeb4bdc2ddc698b456a',
            'name': 'SpecialScope'
          },
          {
            'id': '55818a594bdc2db9688b456a',
            'name': 'Stock'
          },
          {
            'id': '55818b164bdc2ddc698b456c',
            'name': 'TacticalCombo'
          }
        ]
      },
      {
        'id': 'secondaryWeapon',
        'types': [
          {
            'id': '5447b5cf4bdc2d65278b4567',
            'name': 'Pistol'
          }
        ]
      },
      {
        'id': 'securedContainer',
        'types': [
          {
            'id': '5448bf274bdc2dfc2f8b456a',
            'name': 'MobContainer'
          }
        ]
      },
      {
        'id': 'vest',
        'types': [
          {
            'id': '5448e5284bdc2dcb718b4567',
            'name': 'Vest'
          }
        ]
      }
    ])
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
    expect(itemResult.value.map((i) => i.id).sort()).toEqual([
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
    expect(itemResult.value.map((i) => i.id).sort()).toEqual([
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
        itemId: '57dc2fa62459775949412633', // AKS-74U 5.45x39 assault rifle
        modSlots: [
          {
            item: {
              content: [],
              itemId: '57e3dba62459770f0c32322b', // AK-74 textolite pistol grip (6P4 Sb.9)
              modSlots: [],
              quantity: 1
            },
            modSlotName: 'mod_pistol_grip'
          },
          {
            item: {
              content: [],
              itemId: '57dc347d245977596754e7a1', // AKS-74U metal skeleton stock (6P26 Sb.5)
              modSlots: [],
              quantity: 1
            },
            modSlotName: 'mod_stock'
          },
          {
            item: {
              content: [],
              itemId: '564ca99c4bdc2d16268b4589', // AK-74 5.45x39 6L20 30-round magazine
              modSlots: [],
              quantity: 1
            },
            modSlotName: 'mod_magazine'
          },
          {
            item: {
              content: [],
              itemId: '57dc324a24597759501edc20', // AKS-74U 5.45x39 muzzle brake (6P26 0-20)
              modSlots: [],
              quantity: 1
            },
            modSlotName: 'mod_muzzle'
          },
          {
            item: {
              content: [],
              itemId: '57dc334d245977597164366f', // AKS-74U dust cover (6P26 Sb.7)
              modSlots: [],
              quantity: 1
            },
            modSlotName: 'mod_reciever'
          },
          {
            item: {
              content: [],
              itemId: '59d36a0086f7747e673f3946', // AKS-74U gas tube"
              modSlots: [
                {
                  item: {
                    content: [],
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