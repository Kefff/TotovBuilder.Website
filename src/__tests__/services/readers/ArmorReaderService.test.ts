import { IPrice } from '../../../models/utils/IPrice'
import { ArmorReaderService } from '../../../services/readers/ArmorReaderService'

describe('read() and readMarketData()', () => {
  it('should populate an armor properties from Tarkov data', async () => {
    // Arrange
    const service = new ArmorReaderService()

    // Act
    const item = await service.read(tarkovData, 'armor')
    await service.readMarketData(marketData, item)

    // Assert
    expect(item.armorClass).toBe(2)
    expect(item.armoredAreas).toStrictEqual(['Chest', 'Stomach'])
    expect(item.durability).toBe(50)
    expect(item.ergonomicsPercentageModifier).toBe(-2)
    expect(item.material).toBe('Aramid')
    expect(item.movementSpeedPercentageModifier).toBe(-3)
    expect(item.turningSpeedPercentageModifier).toBe(-1)

    expect(item.id).toBe('5648a7494bdc2d9d488b4583')
    expect(item.caption).toBe('PACA soft armor')
    expect(item.categoryId).toBe('armor')
    expect(item.conflictingItemIds).toStrictEqual([])
    expect(item.description).toBe(`Light but durable and reliable body armor protecting only the vital areas, fitted with II class armor plates.
`)
    expect(item.iconLink).toBe('https://assets.tarkov-tools.com/5648a7494bdc2d9d488b4583-icon.jpg')
    expect(item.imageLink).toBe('https://assets.tarkov-tools.com/5648a7494bdc2d9d488b4583-image.jpg')
    expect(item.marketLink).toBe('https://tarkov-tools.com/item/paca-soft-armor')
    expect(item.maxStackableAmount).toBe(1)
    expect(item.name).toBe('notHeavy')
    expect(item.prices).toStrictEqual([
      {
        currencyName: 'RUB',
        merchant: 'ragman',
        merchantLevel: 1,
        requiresQuest: false,
        value: 29154,
        valueInMainCurrency: 0
      },
      {
        currencyName: 'RUB',
        merchant: 'fleaMarket',
        merchantLevel: undefined,
        requiresQuest: false,
        value: 31574,
        valueInMainCurrency: 0
      }
    ] as IPrice[])
    expect(item.shortName).toBe('PACA')
    expect(item.weight).toBe(7)
    expect(item.wikiLink).toBe('https://escapefromtarkov.fandom.com/wiki/PACA_soft_armor')
  })
})

const marketData = {
  'id': '5648a7494bdc2d9d488b4583',
  'name': 'PACA soft armor',
  'shortName': 'PACA',
  'iconLink': 'https://assets.tarkov-tools.com/5648a7494bdc2d9d488b4583-icon.jpg',
  'wikiLink': 'https://escapefromtarkov.fandom.com/wiki/PACA_soft_armor',
  'imageLink': 'https://assets.tarkov-tools.com/5648a7494bdc2d9d488b4583-image.jpg',
  'link': 'https://tarkov-tools.com/item/paca-soft-armor',
  'buyFor': [
    {
      'source': 'ragman',
      'price': 29154,
      'currency': 'RUB',
      'requirements': [{ 'type': 'loyaltyLevel', 'value': 1 }]
    },
    {
      'source': 'fleaMarket',
      'price': 31574,
      'currency': 'RUB',
      'requirements': [{ 'type': 'playerLevel', 'value': 20 }]
    }
  ]
}

const tarkovData = {
  '_id': '5648a7494bdc2d9d488b4583',
  '_name': 'notHeavy',
  '_parent': '5448e54d4bdc2dcc718b4568',
  '_type': 'Item',
  '_props': {
    'Name': 'PACA Soft Armor',
    'ShortName': 'PACA',
    'Description': 'Light but durable and reliable body armor protecting only the vital areas, fitted with II class armor plates.\n',
    'Weight': 7,
    'BackgroundColor': 'blue',
    'Width': 3,
    'Height': 3,
    'StackMaxSize': 1,
    'Rarity': 'Rare',
    'SpawnChance': 5,
    'CreditsPrice': 22839,
    'ItemSound': 'gear_armor',
    'Prefab': {
      'path': 'assets/content/items/equipment/armor_paca/item_equipment_armor_paca.bundle',
      'rcid': ''
    },
    'UsePrefab': {
      'path': '',
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
    'LootExperience': 20,
    'ExamineExperience': 2,
    'HideEntrails': false,
    'RepairCost': 100,
    'RepairSpeed': 8,
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
    'BlocksFaceCover': false,
    'Durability': 50,
    'MaxDurability': 50,
    'armorClass': '2',
    'speedPenaltyPercent': -3,
    'mousePenalty': -1,
    'weaponErgonomicPenalty': -2,
    'armorZone': [
      'Chest',
      'Stomach'
    ],
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
    'BluntThroughput': 0.3,
    'ArmorMaterial': 'Aramid',
    'BlindnessProtection': 0
  },
  '_proto': '545cdb794bdc2d3a198b456a'
}