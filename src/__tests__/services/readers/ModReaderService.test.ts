import { IPrice } from '../../../models/utils/IPrice'
import { ModReaderService } from '../../../services/readers/ModReaderService'

describe('read() and readMarketData()', () => {
  it('should populate a mod properties from Tarkov data', async () => {
    // Arrange
    const service = new ModReaderService()

    // Act
    const item1 = await service.read(tarkovData1, 'mod')
    await service.readMarketData(marketData1, item1)

    const item2 = await service.read(tarkovData2, 'armorMod')
    await service.readMarketData(marketData2, item2)

    // Assert
    expect(item1.ergonomicsModifier).toBe(-2)
    expect(item1.modSlots).toStrictEqual([])

    expect(item1.id).toBe('59d790f486f77403cb06aec6')
    expect(item1.caption).toBe('Armytek Predator Pro v3 XHP35 HI flashlight')
    expect(item1.categoryId).toBe('mod')
    expect(item1.conflictingItemIds).toStrictEqual([])
    expect(item1.description).toBe('Powerful flashlight in a heavy-duty frame, produced by the Armytek company.')
    expect(item1.iconLink).toBe('https://assets.tarkov-tools.com/59d790f486f77403cb06aec6-icon.jpg')
    expect(item1.imageLink).toBe('https://assets.tarkov-tools.com/59d790f486f77403cb06aec6-image.jpg')
    expect(item1.marketLink).toBe('https://tarkov-tools.com/item/armytek-predator-pro-v3-xhp35-hi-flashlight')
    expect(item1.maxStackableAmount).toBe(1)
    expect(item1.name).toBe('flashlight_armytek_predator_pro_v3_xhp35_hi')
    expect(item1.prices).toStrictEqual([
      {
        currencyName: 'RUB',
        merchant: 'skier',
        merchantLevel: 3,
        requiresQuest: false,
        value: 6957,
        valueInMainCurrency: 0
      },
      {
        currencyName: 'RUB',
        merchant: 'fleaMarket',
        merchantLevel: undefined,
        requiresQuest: false,
        value: 6468,
        valueInMainCurrency: 0
      }
    ] as IPrice[])
    expect(item1.shortName).toBe('XHP35')
    expect(item1.weight).toBe(0.12)
    expect(item1.wikiLink).toBe('https://escapefromtarkov.fandom.com/wiki/Armytek_Predator_Pro_v3_XHP35_HI_Flashlight')

    expect(item2.ergonomicsModifier).toBe(0)
    expect(item2.modSlots).toStrictEqual([])

    expect(item2.id).toBe('5ac4c50d5acfc40019262e87')
    expect(item2.caption).toBe('Kolpak-1S visor')
    expect(item2.categoryId).toBe('armorMod')
    expect(item2.conflictingItemIds).toStrictEqual([])
    expect(item2.description).toBe('Weak protection from eye and face damage, used with helmet Cap.')
    expect(item2.iconLink).toBe('https://assets.tarkov-tools.com/5ac4c50d5acfc40019262e87-icon.jpg')
    expect(item2.imageLink).toBe('https://assets.tarkov-tools.com/5ac4c50d5acfc40019262e87-image.jpg')
    expect(item2.marketLink).toBe('https://tarkov-tools.com/item/kolpak-1s-visor')
    expect(item2.maxStackableAmount).toBe(1)
    expect(item2.name).toBe('item_equipment_helmet_k1c_shield')
    expect(item2.prices).toStrictEqual([
      {
        currencyName: 'RUB',
        merchant: 'fleaMarket',
        merchantLevel: undefined,
        requiresQuest: false,
        value: 12141,
        valueInMainCurrency: 0
      }
    ] as IPrice[])
    expect(item2.shortName).toBe('K1S')
    expect(item2.weight).toBe(1)
    expect(item2.wikiLink).toBe('https://escapefromtarkov.fandom.com/wiki/K1S_Visor')
  })
})

const marketData1 = {
  'id': '59d790f486f77403cb06aec6',
  'name': 'Armytek Predator Pro v3 XHP35 HI flashlight',
  'shortName': 'XHP35',
  'iconLink': 'https://assets.tarkov-tools.com/59d790f486f77403cb06aec6-icon.jpg',
  'wikiLink': 'https://escapefromtarkov.fandom.com/wiki/Armytek_Predator_Pro_v3_XHP35_HI_Flashlight',
  'imageLink': 'https://assets.tarkov-tools.com/59d790f486f77403cb06aec6-image.jpg',
  'link': 'https://tarkov-tools.com/item/armytek-predator-pro-v3-xhp35-hi-flashlight',
  'buyFor': [
    {
      'source': 'skier',
      'price': 6957,
      'currency': 'RUB',
      'requirements': [{ 'type': 'loyaltyLevel', 'value': 3 }]
    },
    {
      'source': 'fleaMarket',
      'price': 6468,
      'currency': 'RUB',
      'requirements': [{ 'type': 'playerLevel', 'value': 20 }]
    }
  ]
}

const tarkovData1 = {
  '_id': '59d790f486f77403cb06aec6',
  '_name': 'flashlight_armytek_predator_pro_v3_xhp35_hi',
  '_parent': '55818b084bdc2d5b648b4571',
  '_type': 'Item',
  '_props': {
    'Name': 'Armytek Predator Pro v3 XHP35 HI Flashlight',
    'ShortName': 'Predator Pro v3 XHP35',
    'Description': 'Powerful flashlight in a heavy-duty frame, produced by the Armytek company.',
    'Weight': 0.12,
    'BackgroundColor': 'blue',
    'Width': 1,
    'Height': 1,
    'StackMaxSize': 1,
    'Rarity': 'Rare',
    'SpawnChance': 3,
    'CreditsPrice': 6049,
    'ItemSound': 'generic',
    'Prefab': {
      'path': 'assets/content/items/mods/flashlights/flashlight_armytek_predator_pro_v3_xhp35_hi.bundle',
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
    'ExamineExperience': 6,
    'HideEntrails': false,
    'RepairCost': 0,
    'RepairSpeed': 0,
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
    'Slots': [],
    'CanPutIntoDuringTheRaid': true,
    'CantRemoveFromSlotsDuringRaid': [],
    'Durability': 100,
    'Accuracy': 0,
    'Recoil': 0,
    'Loudness': 0,
    'EffectiveDistance': 0,
    'Ergonomics': -2,
    'Velocity': 0,
    'RaidModdable': true,
    'ToolModdable': true,
    'BlocksFolding': false,
    'BlocksCollapsible': false,
    'IsAnimated': false,
    'HasShoulderContact': false,
    'SightingRange': 0,
    'ModesCount': 2
  },
  '_proto': '57d17c5e2459775a5c57d17d'
}

const marketData2 = {
  'id': '5ac4c50d5acfc40019262e87',
  'name': 'Kolpak-1S visor',
  'shortName': 'K1S',
  'iconLink': 'https://assets.tarkov-tools.com/5ac4c50d5acfc40019262e87-icon.jpg',
  'wikiLink': 'https://escapefromtarkov.fandom.com/wiki/K1S_Visor',
  'imageLink': 'https://assets.tarkov-tools.com/5ac4c50d5acfc40019262e87-image.jpg',
  'link': 'https://tarkov-tools.com/item/kolpak-1s-visor',
  'buyFor': [
    {
      'source': 'fleaMarket',
      'price': 12141,
      'currency': 'RUB',
      'requirements': [{ 'type': 'playerLevel', 'value': 20 }]
    }
  ]
}

const tarkovData2 = {
  '_id': '5ac4c50d5acfc40019262e87',
  '_name': 'item_equipment_helmet_k1c_shield',
  '_parent': '57bef4c42459772e8d35a53b',
  '_type': 'Item',
  '_props': {
    'Name': 'K1S Visor',
    'ShortName': 'Visor',
    'Description': 'Weak protection from eye and face damage, used with helmet Cap.',
    'Weight': 1,
    'BackgroundColor': 'default',
    'Width': 2,
    'Height': 1,
    'StackMaxSize': 1,
    'Rarity': 'Common',
    'SpawnChance': 9,
    'CreditsPrice': 4851,
    'ItemSound': 'gear_goggles',
    'Prefab': {
      'path': 'assets/content/items/equipment/helmet_k1c_shield/item_equipment_helmet_k1c_shield.bundle',
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
    'RepairCost': 70,
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
    'BlocksEyewear': true,
    'BlocksHeadwear': false,
    'BlocksFaceCover': false,
    'Durability': 30,
    'MaxDurability': 30,
    'armorClass': '2',
    'speedPenaltyPercent': 0,
    'mousePenalty': 0,
    'weaponErgonomicPenalty': 0,
    'armorZone': [
      'Head'
    ],
    'Indestructibility': 0.9,
    'headSegments': [
      'Eyes',
      'Jaws'
    ],
    'FaceShieldComponent': true,
    'FaceShieldMask': 'NoMask',
    'HasHinge': true,
    'MaterialType': 'GlassVisor',
    'RicochetParams': {
      'x': 0,
      'y': 0,
      'z': 80
    },
    'DeafStrength': 'None',
    'BluntThroughput': 0.1,
    'ArmorMaterial': 'Glass',
    'BlindnessProtection': 0.15
  },
  '_proto': '557ff21e4bdc2d89578b4586'
}