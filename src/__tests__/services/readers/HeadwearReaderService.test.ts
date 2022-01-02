import { IPrice } from '../../../models/utils/IPrice'
import { HeadwearReaderService } from '../../../services/readers/HeadwearReaderService'

describe('read() and readMarketData()', () => {
  it('should populate a headwear properties from Tarkov data', async () => {
    // Arrange
    const service = new HeadwearReaderService()

    // Act
    const item1 = await service.read(tarkovData1, 'headwear')
    await service.readMarketData(marketData1, item1)

    const item2 = await service.read(tarkovData2, 'headwear')
    await service.readMarketData(marketData2, item2)

    // Assert
    expect(item1.armorClass).toBe(2)
    expect(item1.armoredAreas).toStrictEqual(['Top'])
    expect(item1.durability).toBe(25)
    expect(item1.ergonomicsPercentageModifier).toBe(-5)
    expect(item1.material).toBe('Aramid')
    expect(item1.modSlots).toStrictEqual([
      {
        compatibleItemIds: [
          '5ac4c50d5acfc40019262e87'
        ],
        id: '5ac4c4ca5acfc43f6724894b',
        name: 'mod_equipment',
        required: false
      }
    ])
    expect(item1.movementSpeedPercentageModifier).toBe(-2)
    expect(item1.ricochetChance).toBe('Low')
    expect(item1.turningSpeedPercentageModifier).toBe(-10)

    expect(item1.id).toBe('59e7711e86f7746cae05fbe1')
    expect(item1.caption).toBe('Kolpak-1S riot helmet')
    expect(item1.categoryId).toBe('headwear')
    expect(item1.conflictingItemIds).toStrictEqual([])
    expect(item1.description).toBe('Kolpak-1S protects the head from the cold piercing-cutting weapons in a special class of protection GOST R50744-95, from fragmentation with an energy of impact up to 50 J, and also serves to reduce the dynamic loads arising from the above-mentioned means of destruction.\n\nProtective helmets Kolpak-1 are recommended by the Interdepartmental Commission for equipping units of the patrol service, traffic police, OMON and other special units of the Ministry of Internal Affairs of Russia.')
    expect(item1.iconLink).toBe('https://assets.tarkov-tools.com/59e7711e86f7746cae05fbe1-icon.jpg')
    expect(item1.imageLink).toBe('https://assets.tarkov-tools.com/59e7711e86f7746cae05fbe1-image.jpg')
    expect(item1.marketLink).toBe('https://tarkov-tools.com/item/kolpak-1s-riot-helmet')
    expect(item1.maxStackableAmount).toBe(1)
    expect(item1.name).toBe('helmet_k1c')
    expect(item1.prices).toStrictEqual([
      {
        currencyName: 'RUB',
        merchant: 'ragman',
        merchantLevel: 1,
        requiresQuest: false,
        value: 8137,
        valueInMainCurrency: 0
      },
      {
        currencyName: 'RUB',
        merchant: 'fleaMarket',
        merchantLevel: undefined,
        requiresQuest: false,
        value: 11999,
        valueInMainCurrency: 0
      }
    ] as IPrice[])
    expect(item1.shortName).toBe('Kolpak')
    expect(item1.weight).toBe(1.9)
    expect(item1.wikiLink).toBe('https://escapefromtarkov.fandom.com/wiki/Kolpak-1S_riot_helmet')

    expect(item2.armorClass).toBe(0)
    expect(item2.armoredAreas).toStrictEqual([])
    expect(item2.durability).toBe(0)
    expect(item2.ergonomicsPercentageModifier).toBe(0)
    expect(item2.material).toBe('UHMWPE')
    expect(item2.modSlots).toStrictEqual([])
    expect(item2.movementSpeedPercentageModifier).toBe(0)
    expect(item2.ricochetChance).toBeUndefined()
    expect(item2.turningSpeedPercentageModifier).toBe(0)

    expect(item2.id).toBe('5ab8f20c86f7745cdb629fb2')
    expect(item2.caption).toBe('Ski hat with holes for eyes')
    expect(item2.categoryId).toBe('headwear')
    expect(item2.conflictingItemIds).toStrictEqual([])
    expect(item2.description).toBe('Wow, man! Here comes the style. As well as warm and comfort.')
    expect(item2.iconLink).toBe('https://assets.tarkov-tools.com/5ab8f20c86f7745cdb629fb2-icon.jpg')
    expect(item2.imageLink).toBe('https://assets.tarkov-tools.com/5ab8f20c86f7745cdb629fb2-image.jpg')
    expect(item2.marketLink).toBe('https://tarkov-tools.com/item/ski-hat-with-holes-for-eyes')
    expect(item2.maxStackableAmount).toBe(1)
    expect(item2.name).toBe('hats_skihat')
    expect(item2.prices).toStrictEqual([
      {
        currencyName: 'RUB',
        merchant: 'fleaMarket',
        merchantLevel: undefined,
        requiresQuest: false,
        value: 27296,
        valueInMainCurrency: 0
      }
    ] as IPrice[])
    expect(item2.shortName).toBe('Shmaska')
    expect(item2.weight).toBe(0.1)
    expect(item2.wikiLink).toBe('https://escapefromtarkov.fandom.com/wiki/Ski_hat_with_holes_for_eyes')
  })
})

const marketData1 = {
  'id': '59e7711e86f7746cae05fbe1',
  'name': 'Kolpak-1S riot helmet',
  'shortName': 'Kolpak',
  'iconLink': 'https://assets.tarkov-tools.com/59e7711e86f7746cae05fbe1-icon.jpg',
  'wikiLink': 'https://escapefromtarkov.fandom.com/wiki/Kolpak-1S_riot_helmet',
  'imageLink': 'https://assets.tarkov-tools.com/59e7711e86f7746cae05fbe1-image.jpg',
  'link': 'https://tarkov-tools.com/item/kolpak-1s-riot-helmet',
  'buyFor': [
    {
      'source': 'ragman',
      'price': 8137,
      'currency': 'RUB',
      'requirements': [{ 'type': 'loyaltyLevel', 'value': 1 }]
    },
    {
      'source': 'fleaMarket',
      'price': 11999,
      'currency': 'RUB',
      'requirements': [{ 'type': 'playerLevel', 'value': 20 }]
    }
  ]
}

const tarkovData1 = {
  '_id': '59e7711e86f7746cae05fbe1',
  '_name': 'helmet_k1c',
  '_parent': '5a341c4086f77401f2541505',
  '_type': 'Item',
  '_props': {
    'Name': 'Kolpak-1S riot helmet',
    'ShortName': 'Kolpak',
    'Description': 'Kolpak-1S protects the head from the cold piercing-cutting weapons in a special class of protection GOST R50744-95, from fragmentation with an energy of impact up to 50 J, and also serves to reduce the dynamic loads arising from the above-mentioned means of destruction.\n\nProtective helmets Kolpak-1 are recommended by the Interdepartmental Commission for equipping units of the patrol service, traffic police, OMON and other special units of the Ministry of Internal Affairs of Russia.',
    'Weight': 1.9,
    'BackgroundColor': 'default',
    'Width': 2,
    'Height': 2,
    'StackMaxSize': 1,
    'Rarity': 'Common',
    'SpawnChance': 6,
    'CreditsPrice': 7330,
    'ItemSound': 'gear_helmet',
    'Prefab': {
      'path': 'assets/content/items/equipment/helmet_k1c/item_equipment_helmet_k1c.bundle',
      'rcid': ''
    },
    'UsePrefab': {
      'path': '',
      'rcid': ''
    },
    'StackObjectsCount': 1,
    'NotShownInSlot': false,
    'ExaminedByDefault': false,
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
    'RepairCost': 125,
    'RepairSpeed': 10,
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
    'Grids': [],
    'Slots': [
      {
        '_name': 'mod_equipment',
        '_id': '5ac4c4ca5acfc43f6724894b',
        '_parent': '59e7711e86f7746cae05fbe1',
        '_props': {
          'filters': [
            {
              'Shift': 0,
              'Filter': [
                '5ac4c50d5acfc40019262e87'
              ]
            }
          ]
        },
        '_required': false,
        '_mergeSlotWithChildren': false,
        '_proto': '55d30c4c4bdc2db4468b457e'
      }
    ],
    'CanPutIntoDuringTheRaid': true,
    'CantRemoveFromSlotsDuringRaid': [],
    'BlocksEarpiece': true,
    'BlocksEyewear': false,
    'BlocksHeadwear': false,
    'BlocksFaceCover': false,
    'Durability': 25,
    'MaxDurability': 25,
    'armorClass': '2',
    'speedPenaltyPercent': -2,
    'mousePenalty': -10,
    'weaponErgonomicPenalty': -5,
    'armorZone': [
      'Head'
    ],
    'Indestructibility': 0.9,
    'headSegments': [
      'Top'
    ],
    'FaceShieldComponent': false,
    'FaceShieldMask': 'NoMask',
    'HasHinge': false,
    'MaterialType': 'Helmet',
    'RicochetParams': {
      'x': 0.2,
      'y': 0.01,
      'z': 90
    },
    'DeafStrength': 'High',
    'BluntThroughput': 0.16,
    'ArmorMaterial': 'Aramid',
    'BlindnessProtection': 0
  },
  '_proto': '5645bc214bdc2d363b8b4571'
}

const marketData2 = {
  'id': '5ab8f20c86f7745cdb629fb2',
  'name': 'Ski hat with holes for eyes',
  'shortName': 'Shmaska',
  'iconLink': 'https://assets.tarkov-tools.com/5ab8f20c86f7745cdb629fb2-icon.jpg',
  'wikiLink': 'https://escapefromtarkov.fandom.com/wiki/Ski_hat_with_holes_for_eyes',
  'imageLink': 'https://assets.tarkov-tools.com/5ab8f20c86f7745cdb629fb2-image.jpg',
  'link': 'https://tarkov-tools.com/item/ski-hat-with-holes-for-eyes',
  'buyFor': [
    {
      'source': 'fleaMarket',
      'price': 27296,
      'currency': 'RUB',
      'requirements': [{ 'type': 'playerLevel', 'value': 20 }]
    }
  ]
}

const tarkovData2 = {
  '_id': '5ab8f20c86f7745cdb629fb2',
  '_name': 'hats_skihat',
  '_parent': '5a341c4086f77401f2541505',
  '_type': 'Item',
  '_props': {
    'Name': 'Ski hat with holes for eyes',
    'ShortName': 'Shmaska',
    'Description': 'Wow, man! Here comes the style. As well as warm and comfort.',
    'Weight': 0.1,
    'BackgroundColor': 'default',
    'Width': 1,
    'Height': 1,
    'StackMaxSize': 1,
    'Rarity': 'Rare',
    'SpawnChance': 2,
    'CreditsPrice': 5556,
    'ItemSound': 'gear_generic',
    'Prefab': {
      'path': 'assets/content/items/equipment/head_skihat/item_equipment_head_skihat.bundle',
      'rcid': ''
    },
    'UsePrefab': {
      'path': '',
      'rcid': ''
    },
    'StackObjectsCount': 1,
    'NotShownInSlot': false,
    'ExaminedByDefault': false,
    'ExamineTime': 1,
    'IsUndiscardable': false,
    'IsUnsaleable': false,
    'IsUnbuyable': false,
    'IsUngivable': false,
    'IsLockedafterEquip': false,
    'QuestItem': false,
    'LootExperience': 20,
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
    'Grids': [],
    'Slots': [],
    'CanPutIntoDuringTheRaid': true,
    'CantRemoveFromSlotsDuringRaid': [],
    'BlocksEarpiece': false,
    'BlocksEyewear': false,
    'BlocksHeadwear': false,
    'BlocksFaceCover': true,
    'Durability': 10,
    'MaxDurability': 10,
    'armorClass': '0',
    'speedPenaltyPercent': 0,
    'mousePenalty': 0,
    'weaponErgonomicPenalty': 0,
    'armorZone': [],
    'Indestructibility': 0.9,
    'headSegments': [],
    'FaceShieldComponent': false,
    'FaceShieldMask': 'NoMask',
    'HasHinge': false,
    'MaterialType': 'BodyArmor',
    'RicochetParams': {
      'x': 0,
      'y': 0,
      'z': 80
    },
    'DeafStrength': 'None',
    'BluntThroughput': 0,
    'ArmorMaterial': 'UHMWPE',
    'BlindnessProtection': 0
  },
  '_proto': '5645bc214bdc2d363b8b4571'
}