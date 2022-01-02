import { IPrice } from '../../../models/utils/IPrice'
import { EyewearReaderService } from '../../../services/readers/EyewearReaderService'

describe('read() and readMarketData()', () => {
  it('should populate an eyewear properties from Tarkov data', async () => {
    // Arrange
    const service = new EyewearReaderService()

    // Act
    const item = await service.read(tarkovData, 'eyewear')
    await service.readMarketData(marketData, item)

    // Assert
    expect(item.blindnessProtectionPercentage).toBe(20)

    expect(item.id).toBe('5aa2b923e5b5b000137b7589')
    expect(item.caption).toBe('Round frame sunglasses')
    expect(item.categoryId).toBe('eyewear')
    expect(item.conflictingItemIds).toStrictEqual([])
    expect(item.description).toBe('Sunglasses with round-shaped frame. Cool and stylish!')
    expect(item.iconLink).toBe('https://assets.tarkov-tools.com/5aa2b923e5b5b000137b7589-icon.jpg')
    expect(item.imageLink).toBe('https://assets.tarkov-tools.com/5aa2b923e5b5b000137b7589-image.jpg')
    expect(item.marketLink).toBe('https://tarkov-tools.com/item/round-frame-sunglasses')
    expect(item.maxStackableAmount).toBe(1)
    expect(item.name).toBe('glasses_Aoron')
    expect(item.prices).toStrictEqual([
      {
        currencyName: 'RUB',
        merchant: 'fleaMarket',
        merchantLevel: undefined,
        requiresQuest: false,
        value: 22590,
        valueInMainCurrency: 0
      }
    ] as IPrice[])
    expect(item.shortName).toBe('RGlasses')
    expect(item.weight).toBe(0.1)
    expect(item.wikiLink).toBe('https://escapefromtarkov.fandom.com/wiki/Round_frame_sunglasses')
  })
})

const marketData = {
  'id': '5aa2b923e5b5b000137b7589',
  'name': 'Round frame sunglasses',
  'shortName': 'RGlasses',
  'iconLink': 'https://assets.tarkov-tools.com/5aa2b923e5b5b000137b7589-icon.jpg',
  'wikiLink': 'https://escapefromtarkov.fandom.com/wiki/Round_frame_sunglasses',
  'imageLink': 'https://assets.tarkov-tools.com/5aa2b923e5b5b000137b7589-image.jpg',
  'link': 'https://tarkov-tools.com/item/round-frame-sunglasses',
  'buyFor': [
    {
      'source': 'fleaMarket',
      'price': 22590,
      'currency': 'RUB',
      'requirements': [{ 'type': 'playerLevel', 'value': 20 }]
    }
  ]
}

const tarkovData = {
  '_id': '5aa2b923e5b5b000137b7589',
  '_name': 'glasses_Aoron',
  '_parent': '5448e5724bdc2ddf718b4568',
  '_type': 'Item',
  '_props': {
    'Name': 'Round frame sunglasses',
    'ShortName': 'RGlass',
    'Description': 'Sunglasses with round-shaped frame. Cool and stylish!',
    'Weight': 0.1,
    'BackgroundColor': 'default',
    'Width': 2,
    'Height': 1,
    'StackMaxSize': 1,
    'Rarity': 'Rare',
    'SpawnChance': 2,
    'CreditsPrice': 3084,
    'ItemSound': 'gear_goggles',
    'Prefab': {
      'path': 'assets/content/items/equipment/glasses_round/item_equipment_glasses_round.bundle',
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
    'BlocksFaceCover': false,
    'Durability': 0,
    'MaxDurability': 0,
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
    'BlindnessProtection': 0.2
  },
  '_proto': '557ff21e4bdc2d89578b4586'
}