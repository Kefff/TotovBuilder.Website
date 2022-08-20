import { ItemFetcherService } from '../../services/ItemFetcherService'
import Result, { FailureType } from '../../utils/Result'
import { instance, mock, when } from 'ts-mockito'
import { ApiService } from '../../services/ApiService'
import Services from '../../services/repository/Services'
import Configuration from '../../../test-data/configuration.json'

describe('fetchItemCategories()', () => {
  it('should fetch item categories', async () => {
    // Arrange
    mockApiService()
    const fetcher = new ItemFetcherService()

    // Act
    const itemCategoriesResult = await fetcher.fetchItemCategories()

    // Assert
    expect(itemCategoriesResult.success).toBe(true)
    expect(itemCategoriesResult.value).toStrictEqual(itemCategories)
  })
})

describe('fetchItems()', () => {
  it('should fetch all items', async () => {
    // Arrange
    mockApiService()
    const fetcher = new ItemFetcherService()

    // Act
    const itemsResult = await fetcher.fetchItems()

    // Assert
    expect(itemsResult.success).toBe(true)
    expect(itemsResult.value).toStrictEqual(tarkovData)
  })

  it('should fail when items are not found', async () => {
    // Arrange
    mockNotFoundApiService()
    const fetcher = new ItemFetcherService()

    // Act
    const itemResult = await fetcher.fetchItems()

    // Assert
    expect(itemResult.success).toBe(false)
    expect(itemResult.failureMessage).toBe('No item could be fetched.')
  })

  it('should fail when an error occurs requesting items', async () => {
    // Arrange
    mockErrorApiService()
    const fetcher = new ItemFetcherService()

    // Act
    const itemResult = await fetcher.fetchItems()

    // Assert
    expect(itemResult.success).toBe(false)
    expect(itemResult.failureMessage).toBe('Error')
  })
})

describe('fetchPrices()', () => {
  it('should fetch prices', async () => {
    // Arrange
    mockApiService()
    const fetcher = new ItemFetcherService()

    // Act
    const marketDataResult = await fetcher.fetchPrices()

    // Assert
    expect(marketDataResult.success).toBe(true)
    expect(marketDataResult.value).toStrictEqual(marketData)
  })
})

describe('fetchPresets()', () => {
  it('should fetch presets', async () => {
    // Arrange
    mockApiService()
    const fetcher = new ItemFetcherService()

    // Act
    const presetsResult = await fetcher.fetchPresets()

    // Assert
    expect(presetsResult.success).toBe(true)
    expect(presetsResult.value).toStrictEqual(presets)
  })
})

function mockApiService() {
  const apiServiceMock = mock<ApiService>()
  when(apiServiceMock.get(Configuration.VITE_ITEM_CATEGORIES_API as string)).thenReturn(Promise.resolve(Result.ok(itemCategories)))
  when(apiServiceMock.get(Configuration.VITE_MARKET_DATA_API as string)).thenReturn(Promise.resolve(Result.ok(marketData)))
  when(apiServiceMock.get(Configuration.VITE_ITEMS_API as string)).thenReturn(Promise.resolve(Result.ok(tarkovData)))
  when(apiServiceMock.get(Configuration.VITE_PRESETS_API as string)).thenReturn(Promise.resolve(Result.ok(presets)))
  Services.configure(ApiService, undefined, instance(apiServiceMock))
}

function mockNotFoundApiService() {
  const apiServiceMock = mock<ApiService>()
  when(apiServiceMock.get(Configuration.VITE_MARKET_DATA_API as string)).thenReturn(Promise.resolve(Result.ok([])))
  when(apiServiceMock.get(Configuration.VITE_ITEMS_API as string)).thenReturn(Promise.resolve(Result.ok([])))
  Services.configure(ApiService, undefined, instance(apiServiceMock))
}

function mockErrorApiService() {
  const apiServiceMock = mock<ApiService>()
  when(apiServiceMock.get(Configuration.VITE_MARKET_DATA_API as string)).thenReturn(Promise.resolve(Result.fail(FailureType.hidden, '', 'Error')))
  when(apiServiceMock.get(Configuration.VITE_ITEMS_API as string)).thenReturn(Promise.resolve(Result.fail(FailureType.hidden, '', 'Error')))
  Services.configure(ApiService, undefined, instance(apiServiceMock))
}

const itemCategories = [
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
        'id': '5a74651486f7744e73386dd1',
        'name': 'AuxiliaryMod'
      },
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
    'id': 'rangedWeaponMod',
    'types': [
      {
        'id': '55818add4bdc2d5b648b456f',
        'name': 'AssaultScope'
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
]

const marketData = [
  {
    'id': '590c678286f77426c9660122',
    'name': 'IFAK individual first aid kit',
    'shortName': 'IFAK',
    'iconLink': 'https://assets.tarkov-tools.com/590c678286f77426c9660122-icon.jpg',
    'wikiLink': 'https://escapefromtarkov.fandom.com/wiki/IFAK_personal_tactical_first_aid_kit',
    'imageLink': 'https://assets.tarkov-tools.com/590c678286f77426c9660122-image.jpg',
    'link': 'https://tarkov-tools.com/item/ifak-individual-first-aid-kit',
    'buyFor': [
      {
        'source': 'therapist',
        'price': 27202,
        'currency': 'RUB',
        'requirements': [
          { 'type': 'loyaltyLevel', 'value': 1 },
          { 'type': 'questCompleted', 'value': 1 }
        ]
      },
      {
        'source': 'flea-market',
        'price': 12109,
        'currency': 'RUB',
        'requirements': [{ 'type': 'playerLevel', 'value': 20 }]
      }
    ]
  },
  {
    'id': '590c5d4b86f774784e1b9c45',
    'name': 'Iskra ration pack',
    'shortName': 'Iskra',
    'iconLink': 'https://assets.tarkov-tools.com/590c5d4b86f774784e1b9c45-icon.jpg',
    'wikiLink': 'https://escapefromtarkov.fandom.com/wiki/Iskra_lunch_box',
    'imageLink': 'https://assets.tarkov-tools.com/590c5d4b86f774784e1b9c45-image.jpg',
    'link': 'https://tarkov-tools.com/item/iskra-ration-pack',
    'buyFor': [
      {
        'source': 'flea-market',
        'price': 13201,
        'currency': 'RUB',
        'requirements': [{ 'type': 'playerLevel', 'value': 20 }]
      }
    ]
  }
]

const presets = [{
  'content': [],
  'itemId': '57dc2fa62459775949412633',
  'modSlots': [
    {
      'item': {
        'content': [],
        'itemId': '57e3dba62459770f0c32322b',
        'modSlots': [],
        'quantity': 1
      },
      'modSlotName': 'mod_pistol_grip'
    },
    {
      'item': {
        'content': [],
        'itemId': '57dc347d245977596754e7a1',
        'modSlots': [],
        'quantity': 1
      },
      'modSlotName': 'mod_stock'
    },
    {
      'item': {
        'content': [],
        'itemId': '564ca99c4bdc2d16268b4589',
        'modSlots': [
          {
            'item': {
              'content': [],
              'itemId': '56dfef82d2720bbd668b4567',
              'modSlots': [],
              'quantity': 1
            },
            'modSlotName': 'cartridges'
          }
        ],
        'quantity': 1
      },
      'modSlotName': 'mod_magazine'
    },
    {
      'item': {
        'content': [],
        'itemId': '57dc324a24597759501edc20',
        'modSlots': [],
        'quantity': 1
      },
      'modSlotName': 'mod_muzzle'
    },
    {
      'item': {
        'content': [],
        'itemId': '57dc334d245977597164366f',
        'modSlots': [],
        'quantity': 1
      },
      'modSlotName': 'mod_reciever'
    },
    {
      'item': {
        'content': [],
        'itemId': '59d36a0086f7747e673f3946',
        'modSlots': [
          {
            'item': {
              'content': [],
              'itemId': '57dc32dc245977596d4ef3d3',
              'modSlots': [],
              'quantity': 1
            },
            'modSlotName': 'mod_handguard'
          }
        ],
        'quantity': 1
      },
      'modSlotName': 'mod_gas_block'
    }
  ],
  'quantity': 1
},
{
  'content': [],
  'itemId': '56d59856d2720bd8418b456a',
  'modSlots': [
    {
      'item': {
        'content': [],
        'itemId': '56d5a1f7d2720bb3418b456a',
        'modSlots': [],
        'quantity': 1
      },
      'modSlotName': 'mod_barrel'
    },
    {
      'item': {
        'content': [],
        'itemId': '56d5a2bbd2720bb8418b456a',
        'modSlots': [],
        'quantity': 1
      },
      'modSlotName': 'mod_pistol_grip'
    },
    {
      'item': {
        'content': [],
        'itemId': '56d5a407d2720bb3418b456b',
        'modSlots': [
          {
            'item': {
              'content': [],
              'itemId': '56d5a77ed2720b90418b4568',
              'modSlots': [],
              'quantity': 1
            },
            'modSlotName': 'mod_sight_rear'
          },
          {
            'item': {
              'content': [],
              'itemId': '56d5a661d2720bd8418b456b',
              'modSlots': [],
              'quantity': 1
            },
            'modSlotName': 'mod_sight_front'
          }
        ],
        'quantity': 1
      },
      'modSlotName': 'mod_reciever'
    },
    {
      'item': {
        'content': [],
        'itemId': '56d59948d2720bb7418b4582',
        'modSlots': [],
        'quantity': 1
      },
      'modSlotName': 'mod_magazine'
    }
  ],
  'quantity': 1
}]

const tarkovData = [
  {
    '_id': '590c5d4b86f774784e1b9c45',
    '_name': 'item_food_ration',
    '_parent': '5448e8d04bdc2ddf718b4569',
    '_type': 'Item',
    '_props': {
      'Name': 'ration',
      'ShortName': 'ration',
      'Description': 'ration',
      'Weight': 1.6,
      'BackgroundColor': 'orange',
      'Width': 1,
      'Height': 2,
      'StackMaxSize': 1,
      'Rarity': 'Common',
      'SpawnChance': 9,
      'CreditsPrice': 7358,
      'ItemSound': 'food_snack',
      'Prefab': {
        'path': 'assets/content/weapons/usable_items/item_ifr/item_ifr_loot.bundle',
        'rcid': ''
      },
      'UsePrefab': {
        'path': 'assets/content/weapons/usable_items/item_ifr/item_irf_container.bundle',
        'rcid': ''
      },
      'StackObjectsCount': 1,
      'NotShownInSlot': false,
      'ExaminedByDefault': true,
      'ExamineTime': 1,
      'IsUndiscardable': false,
      'IsUnsaleable': false,
      'IsUnbuyable': false,
      'IsUngivable': false,
      'IsLockedafterEquip': false,
      'QuestItem': false,
      'LootExperience': 30,
      'ExamineExperience': 10,
      'HideEntrails': false,
      'RepairCost': 0,
      'RepairSpeed': 0,
      'ExtraSizeLeft': 0,
      'ExtraSizeRight': 0,
      'ExtraSizeUp': 0,
      'ExtraSizeDown': 0,
      'ExtraSizeForceAdd': false,
      'MergesWithChildren': false,
      'CanSellOnRagfair': true,
      'CanRequireOnRagfair': true,
      'ConflictingItems': [],
      'FixedPrice': false,
      'Unlootable': false,
      'UnlootableFromSlot': 'FirstPrimaryWeapon',
      'UnlootableFromSide': [],
      'ChangePriceCoef': 1,
      'AllowSpawnOnLocations': [],
      'SendToClient': false,
      'AnimationVariantsNumber': 0,
      'DiscardingBlock': false,
      'RagFairCommissionModifier': 1,
      'IsAlwaysAvailableForInsurance': false,
      'foodUseTime': 5,
      'foodEffectType': 'afterUse',
      'MaxResource': 1,
      'StimulatorBuffs': '',
      'effects_health': { 'Energy': { 'value': 80 } },
      'effects_damage': []
    },
    '_proto': '5448ff904bdc2d6f028b456e'
  },
  {
    '_id': '590c678286f77426c9660122',
    '_name': 'item_meds_medkit_ifak',
    '_parent': '5448f39d4bdc2d0a728b4568',
    '_type': 'Item',
    '_props': {
      'Name': 'ifak',
      'ShortName': 'ifak',
      'Description': 'ifak',
      'Weight': 0.5,
      'BackgroundColor': 'orange',
      'Width': 1,
      'Height': 1,
      'StackMaxSize': 1,
      'Rarity': 'Rare',
      'SpawnChance': 2,
      'CreditsPrice': 14852,
      'ItemSound': 'med_medkit',
      'Prefab': {
        'path': 'assets/content/weapons/usable_items/item_ifak/item_ifak_loot.bundle',
        'rcid': ''
      },
      'UsePrefab': {
        'path': 'assets/content/weapons/usable_items/item_ifak/item_ifak_container.bundle',
        'rcid': ''
      },
      'StackObjectsCount': 1,
      'NotShownInSlot': false,
      'ExaminedByDefault': true,
      'ExamineTime': 1,
      'IsUndiscardable': false,
      'IsUnsaleable': false,
      'IsUnbuyable': false,
      'IsUngivable': false,
      'IsLockedafterEquip': false,
      'QuestItem': false,
      'LootExperience': 25,
      'ExamineExperience': 10,
      'HideEntrails': false,
      'RepairCost': 0,
      'RepairSpeed': 0,
      'ExtraSizeLeft': 0,
      'ExtraSizeRight': 0,
      'ExtraSizeUp': 0,
      'ExtraSizeDown': 0,
      'ExtraSizeForceAdd': false,
      'MergesWithChildren': false,
      'CanSellOnRagfair': true,
      'CanRequireOnRagfair': true,
      'ConflictingItems': [],
      'FixedPrice': false,
      'Unlootable': false,
      'UnlootableFromSlot': 'FirstPrimaryWeapon',
      'UnlootableFromSide': [],
      'ChangePriceCoef': 1,
      'AllowSpawnOnLocations': [],
      'SendToClient': false,
      'AnimationVariantsNumber': 2,
      'DiscardingBlock': false,
      'RagFairCommissionModifier': 1,
      'IsAlwaysAvailableForInsurance': false,
      'medUseTime': 3,
      'medEffectType': 'duringUse',
      'MaxHpResource': 300,
      'hpResourceRate': 50,
      'StimulatorBuffs': '',
      'effects_health': [],
      'effects_damage': {
        'LightBleeding': {
          'delay': 0,
          'duration': 0,
          'fadeOut': 0,
          'cost': 30,
          'healthPenaltyMin': 0,
          'healthPenaltyMax': 0
        },
        'RadExposure': {
          'delay': 0,
          'duration': 0,
          'fadeOut': 0,
          'cost': 0,
          'healthPenaltyMin': 0,
          'healthPenaltyMax': 0
        },
        'HeavyBleeding': {
          'delay': 0,
          'duration': 0,
          'fadeOut': 0,
          'cost': 210,
          'healthPenaltyMin': 0,
          'healthPenaltyMax': 0
        }
      }
    },
    '_proto': '544fb45d4bdc2dee738b4568'
  },
  {
    '_id': '57dc2fa62459775949412633',
    '_name': 'weapon_izhmash_aks74u_545x39',
    '_parent': '5447b5f14bdc2d61278b4567',
    '_type': 'Item',
    '_props': {
      'Name': 'weapon_izhmash_aks74u_545x39',
      'ShortName': 'weapon_izhmash_aks74u_545x39',
      'Description': 'weapon_izhmash_aks74u_545x39',
      'Weight': 1.809,
      'BackgroundColor': 'black',
      'Width': 3,
      'Height': 1,
      'StackMaxSize': 1,
      'Rarity': 'Rare',
      'SpawnChance': 15,
      'CreditsPrice': 13643,
      'ItemSound': 'weap_ar',
      'Prefab': {
        'path': 'assets/content/weapons/aks74u/weapon_izhmash_aks74u_545x39_container.bundle',
        'rcid': ''
      },
      'UsePrefab': { 'path': '', 'rcid': '' },
      'StackObjectsCount': 1,
      'NotShownInSlot': false,
      'ExaminedByDefault': true,
      'ExamineTime': 1,
      'IsUndiscardable': false,
      'IsUnsaleable': false,
      'IsUnbuyable': false,
      'IsUngivable': false,
      'IsLockedafterEquip': false,
      'QuestItem': false,
      'LootExperience': 20,
      'ExamineExperience': 4,
      'HideEntrails': false,
      'RepairCost': 68,
      'RepairSpeed': 4,
      'ExtraSizeLeft': 0,
      'ExtraSizeRight': 0,
      'ExtraSizeUp': 0,
      'ExtraSizeDown': 0,
      'ExtraSizeForceAdd': false,
      'MergesWithChildren': true,
      'CanSellOnRagfair': true,
      'CanRequireOnRagfair': true,
      'ConflictingItems': [],
      'FixedPrice': false,
      'Unlootable': false,
      'UnlootableFromSlot': 'FirstPrimaryWeapon',
      'UnlootableFromSide': [],
      'ChangePriceCoef': 1,
      'AllowSpawnOnLocations': [],
      'SendToClient': false,
      'AnimationVariantsNumber': 0,
      'DiscardingBlock': false,
      'RagFairCommissionModifier': 1,
      'IsAlwaysAvailableForInsurance': false,
      'Grids': [],
      'Slots': [
        {
          '_name': 'mod_pistol_grip',
          '_id': '57dc31bc245977596d4ef3d2',
          '_parent': '57dc2fa62459775949412633',
          '_props': {
            'filters': [
              {
                'Shift': 0,
                'Filter': [
                  '5f6341043ada5942720e2dc5',
                  '6087e663132d4d12c81fd96b',
                  '5beec8ea0db834001a6f9dbf',
                  '5649ad3f4bdc2df8348b4585',
                  '5649ade84bdc2d1b2b8b4587',
                  '59e62cc886f77440d40b52a1',
                  '5a0071d486f77404e23a12b2',
                  '57e3dba62459770f0c32322b',
                  '5cf54404d7f00c108840b2ef',
                  '5e2192a498a36665e8337386',
                  '5b30ac585acfc433000eb79c',
                  '59e6318286f77444dd62c4cc',
                  '5cf50850d7f00c056e24104c',
                  '5cf508bfd7f00c056e24104e',
                  '5947f92f86f77427344a76b1',
                  '5947fa2486f77425b47c1a9b',
                  '5c6bf4aa2e2216001219b0ae',
                  '5649ae4a4bdc2d1b2b8b4588',
                  '5998517986f7746017232f7e'
                ]
              }
            ]
          },
          '_required': true,
          '_mergeSlotWithChildren': false,
          '_proto': '55d30c4c4bdc2db4468b457e'
        },
        {
          '_name': 'mod_stock',
          '_id': '57dc31ce245977593d4e1453',
          '_parent': '57dc2fa62459775949412633',
          '_props': {
            'filters': [
              {
                'Shift': 0,
                'Filter': [
                  '59ecc28286f7746d7a68aa8c',
                  '5ab626e4d8ce87272e4c6e43',
                  '57dc347d245977596754e7a1'
                ]
              }
            ]
          },
          '_required': false,
          '_mergeSlotWithChildren': false,
          '_proto': '55d30c4c4bdc2db4468b457e'
        },
        {
          '_name': 'mod_charge',
          '_id': '57dc31e1245977597164366e',
          '_parent': '57dc2fa62459775949412633',
          '_props': {
            'filters': [{ 'Shift': 0, 'Filter': ['5648ac824bdc2ded0b8b457d'] }]
          },
          '_required': false,
          '_mergeSlotWithChildren': false,
          '_proto': '55d30c4c4bdc2db4468b457e'
        },
        {
          '_name': 'mod_magazine',
          '_id': '57dc31f2245977596c274b4f',
          '_parent': '57dc2fa62459775949412633',
          '_props': {
            'filters': [
              {
                'AnimationIndex': -1,
                'Filter': [
                  '564ca9df4bdc2d35148b4569',
                  '564ca99c4bdc2d16268b4589',
                  '55d480c04bdc2d1d4e8b456a',
                  '5cbdaf89ae9215000e5b9c94',
                  '55d481904bdc2d8c2f8b456a',
                  '55d482194bdc2d1d4e8b456b',
                  '55d4837c4bdc2d1d4e8b456c',
                  '5aaa4194e5b5b055d06310a5',
                  '5bed61680db834001d2c45ab',
                  '5bed625c0db834001c062946'
                ]
              }
            ]
          },
          '_required': false,
          '_mergeSlotWithChildren': false,
          '_proto': '55d30c394bdc2dae468b4577'
        },
        {
          '_name': 'mod_muzzle',
          '_id': '57dc35ce2459775971643671',
          '_parent': '57dc2fa62459775949412633',
          '_props': {
            'filters': [
              {
                'Shift': 0,
                'Filter': [
                  '5ac72e945acfc43f3b691116',
                  '5ac7655e5acfc40016339a19',
                  '5649aa744bdc2ded0b8b457e',
                  '5f633f791b231926f2329f13',
                  '5943eeeb86f77412d6384f6b',
                  '5cc9a96cd7f00c011c04e04a',
                  '5649ab884bdc2ded0b8b457f',
                  '57dc324a24597759501edc20',
                  '59bffc1f86f77435b128b872',
                  '593d493f86f7745e6b2ceb22',
                  '564caa3d4bdc2d17108b458e',
                  '57ffb0e42459777d047111c5'
                ]
              }
            ]
          },
          '_required': false,
          '_mergeSlotWithChildren': false,
          '_proto': '55d30c4c4bdc2db4468b457e'
        },
        {
          '_name': 'mod_reciever',
          '_id': '57dc35fb245977596d4ef3d7',
          '_parent': '57dc2fa62459775949412633',
          '_props': {
            'filters': [
              {
                'Shift': 0,
                'Filter': [
                  '57dc334d245977597164366f',
                  '5839a7742459773cf9693481'
                ]
              }
            ]
          },
          '_required': false,
          '_mergeSlotWithChildren': false,
          '_proto': '55d30c4c4bdc2db4468b457e'
        },
        {
          '_name': 'mod_gas_block',
          '_id': '59d368ce86f7747e6a5beb03',
          '_parent': '57dc2fa62459775949412633',
          '_props': {
            'filters': [{ 'Shift': 0, 'Filter': ['59d36a0086f7747e673f3946'] }]
          },
          '_required': true,
          '_mergeSlotWithChildren': false,
          '_proto': '55d30c4c4bdc2db4468b457e'
        }
      ],
      'CanPutIntoDuringTheRaid': true,
      'CantRemoveFromSlotsDuringRaid': [],
      'weapClass': 'assaultRifle',
      'weapUseType': 'primary',
      'ammoCaliber': 'Caliber545x39',
      'Durability': 95,
      'MaxDurability': 100,
      'OperatingResource': 4700,
      'RepairComplexity': 0,
      'durabSpawnMin': 25,
      'durabSpawnMax': 75,
      'isFastReload': true,
      'RecoilForceUp': 146,
      'RecoilForceBack': 445,
      'Convergence': 1,
      'RecoilAngle': 90,
      'weapFireType': ['single', 'fullauto'],
      'RecolDispersion': 35,
      'bFirerate': 650,
      'Ergonomics': 44,
      'Velocity': -17.9,
      'bEffDist': 300,
      'bHearDist': 80,
      'isChamberLoad': true,
      'chamberAmmoCount': 1,
      'isBoltCatch': false,
      'defMagType': '55d480c04bdc2d1d4e8b456a',
      'defAmmo': '56dff3afd2720bba668b4567',
      'AdjustCollimatorsToTrajectory': false,
      'shotgunDispersion': 0,
      'Chambers': [
        {
          '_name': 'patron_in_weapon',
          '_id': '57dc318524597759805c1581',
          '_parent': '57dc2fa62459775949412633',
          '_props': {
            'filters': [
              {
                'Filter': [
                  '5c0d5e4486f77478390952fe',
                  '56dfef82d2720bbd668b4567',
                  '56dff026d2720bb8668b4567',
                  '56dff061d2720bb5668b4567',
                  '56dff0bed2720bb0668b4567',
                  '56dff216d2720bbd668b4568',
                  '56dff2ced2720bb4668b4567',
                  '56dff338d2720bbd668b4569',
                  '56dff3afd2720bba668b4567',
                  '56dff421d2720b5f5a8b4567',
                  '56dff4a2d2720bbd668b456a',
                  '56dff4ecd2720b5f5a8b4568'
                ],
                'MaxStackCount': 0
              }
            ]
          },
          '_required': false,
          '_mergeSlotWithChildren': false,
          '_proto': '55d4af244bdc2d962f8b4571'
        }
      ],
      'CameraRecoil': 0.165,
      'CameraSnap': 3.5,
      'ReloadMode': 'ExternalMagazine',
      'CenterOfImpact': 0.1,
      'AimPlane': 0.15,
      'DeviationCurve': 1,
      'DeviationMax': 100,
      'Foldable': true,
      'Retractable': false,
      'TacticalReloadStiffnes': { 'x': 0.95, 'y': 0.33, 'z': 0.95 },
      'TacticalReloadFixation': 0.95,
      'RecoilCenter': { 'x': 0, 'y': -0.25, 'z': 0 },
      'RotationCenter': { 'x': 0, 'y': -0.1, 'z': -0.03 },
      'RotationCenterNoStock': { 'x': 0, 'y': -0.27, 'z': -0.08 },
      'SizeReduceRight': 0,
      'FoldedSlot': 'mod_stock',
      'CompactHandling': true,
      'SightingRange': 100,
      'MinRepairDegradation': 0,
      'MaxRepairDegradation': 0.04,
      'IronSightRange': 100,
      'MustBoltBeOpennedForExternalReload': false,
      'MustBoltBeOpennedForInternalReload': false,
      'BoltAction': false,
      'HipAccuracyRestorationDelay': 0.2,
      'HipAccuracyRestorationSpeed': 7,
      'HipInnaccuracyGain': 0.16,
      'ManualBoltCatch': false,
      'AimSensitivity': 0.65,
      'BurstShotsCount': 3,
      'BaseMalfunctionChance': 0.14,
      'AllowJam': false,
      'AllowFeed': false,
      'AllowMisfire': true,
      'AllowSlide': false,
      'DurabilityBurnRatio': 1,
      'HeatFactor': 1,
      'CoolFactor': 1,
      'AllowOverheat': false
    },
    '_proto': '5644bd2b4bdc2d3b4c8b4572'
  }
]