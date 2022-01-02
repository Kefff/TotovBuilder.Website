import { IPrice } from '../../../models/utils/IPrice'
import { GrenadeReaderService } from '../../../services/readers/GrenadeReaderService'

describe('read() and readMarketData()', () => {
  it('should populate a grenade properties from Tarkov data', async () => {
    // Arrange
    const service = new GrenadeReaderService()

    // Act
    const item1 = await service.read(tarkovData1, 'grenade')
    await service.readMarketData(marketData1, item1)

    const item2 = await service.read(tarkovData2, 'grenade')
    await service.readMarketData(marketData2, item2)

    // Assert
    expect(item1.explosionDelay).toBe(5)
    expect(item1.fragmentAmmunitionId).toBe('5996f6fc86f7745e585b4de3')
    expect(item1.fragmentsAmount).toBe(75)
    expect(item1.maximumExplosionRange).toBe(8)
    expect(item1.minimumExplosionRange).toBe(3)

    expect(item1.id).toBe('58d3db5386f77426186285a0')
    expect(item1.caption).toBe('M67 Hand grenade')
    expect(item1.categoryId).toBe('grenade')
    expect(item1.conflictingItemIds).toStrictEqual([])
    expect(item1.description).toBe('M67 grenade (M67 Fragmentation Hand Grenade) is an American hand grenade, designed for antipersonnel combat purposes and adopted in 1969 by the army of the United States.')
    expect(item1.iconLink).toBe('https://assets.tarkov-tools.com/58d3db5386f77426186285a0-icon.jpg')
    expect(item1.imageLink).toBe('https://assets.tarkov-tools.com/58d3db5386f77426186285a0-image.jpg')
    expect(item1.marketLink).toBe('https://tarkov-tools.com/item/m67-hand-grenade')
    expect(item1.maxStackableAmount).toBe(1)
    expect(item1.name).toBe('weapon_grenade_m67')
    expect(item1.prices).toStrictEqual([
      {
        currencyName: 'USD',
        merchant: 'peacekeeper',
        merchantLevel: 1,
        requiresQuest: true,
        value: 78,
        valueInMainCurrency: 0
      },
      {
        currencyName: 'RUB',
        merchant: 'fleaMarket',
        merchantLevel: undefined,
        requiresQuest: false,
        value: 20992,
        valueInMainCurrency: 0
      }
    ] as IPrice[])
    expect(item1.shortName).toBe('M67')
    expect(item1.weight).toBe(0.396)
    expect(item1.wikiLink).toBe('https://escapefromtarkov.fandom.com/wiki/M67_Hand_grenade')

    expect(item2.explosionDelay).toBe(2)
    expect(item2.fragmentAmmunitionId).toBe('5996f6cb86f774678763a6ca')
    expect(item2.fragmentsAmount).toBe(0)
    expect(item2.maximumExplosionRange).toBe(10)
    expect(item2.minimumExplosionRange).toBe(10)

    expect(item2.id).toBe('5a0c27731526d80618476ac4')
    expect(item2.caption).toBe('Zarya stun grenade')
    expect(item2.categoryId).toBe('grenade')
    expect(item2.conflictingItemIds).toStrictEqual([])
    expect(item2.description).toBe('Intended to suppress the mental stability by creating a sudden sound effect and a bright flash. Used in special operations for apprehension of criminals and in riot suppression.')
    expect(item2.iconLink).toBe('https://assets.tarkov-tools.com/5a0c27731526d80618476ac4-icon.jpg')
    expect(item2.imageLink).toBe('https://assets.tarkov-tools.com/5a0c27731526d80618476ac4-image.jpg')
    expect(item2.marketLink).toBe('https://tarkov-tools.com/item/zarya-stun-grenade')
    expect(item2.maxStackableAmount).toBe(1)
    expect(item2.name).toBe('weapon_grenade_zarya')
    expect(item2.prices).toStrictEqual([
      {
        currencyName: 'RUB',
        merchant: 'prapor',
        merchantLevel: 2,
        requiresQuest: false,
        value: 7320,
        valueInMainCurrency: 0
      },
      {
        currencyName: 'RUB',
        merchant: 'fleaMarket',
        merchantLevel: undefined,
        requiresQuest: false,
        value: 8499,
        valueInMainCurrency: 0
      }
    ] as IPrice[])
    expect(item2.shortName).toBe('Zarya')
    expect(item2.weight).toBe(0.175)
    expect(item2.wikiLink).toBe('https://escapefromtarkov.fandom.com/wiki/Zarya_stun_grenade')
  })
})

const marketData1 = {
  'id': '58d3db5386f77426186285a0',
  'name': 'M67 Hand grenade',
  'shortName': 'M67',
  'iconLink': 'https://assets.tarkov-tools.com/58d3db5386f77426186285a0-icon.jpg',
  'wikiLink': 'https://escapefromtarkov.fandom.com/wiki/M67_Hand_grenade',
  'imageLink': 'https://assets.tarkov-tools.com/58d3db5386f77426186285a0-image.jpg',
  'link': 'https://tarkov-tools.com/item/m67-hand-grenade',
  'buyFor': [
    {
      'source': 'peacekeeper',
      'price': 78,
      'currency': 'USD',
      'requirements': [
        { 'type': 'loyaltyLevel', 'value': 1 },
        { 'type': 'questCompleted', 'value': 1 }
      ]
    },
    {
      'source': 'fleaMarket',
      'price': 20992,
      'currency': 'RUB',
      'requirements': [{ 'type': 'playerLevel', 'value': 20 }]
    }
  ]
}

const tarkovData1 = {
  '_id': '58d3db5386f77426186285a0',
  '_name': 'weapon_grenade_m67',
  '_parent': '543be6564bdc2df4348b4568',
  '_type': 'Item',
  '_props': {
    'Name': 'M67 Hand grenade',
    'ShortName': 'M67',
    'Description': 'M67 grenade (M67 Fragmentation Hand Grenade) is an American hand grenade, designed for antipersonnel combat purposes and adopted in 1969 by the army of the United States.',
    'Weight': 0.396,
    'BackgroundColor': 'grey',
    'Width': 1,
    'Height': 1,
    'StackMaxSize': 1,
    'Rarity': 'Rare',
    'SpawnChance': 4,
    'CreditsPrice': 8020,
    'ItemSound': 'grenade',
    'Prefab': {
      'path': 'assets/content/weapons/m67/weapon_grenade_m67_container.bundle',
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
    'ExamineExperience': 4,
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
    'ThrowType': 'frag_grenade',
    'ExplDelay': 3,
    'MinExplosionDistance': 3,
    'MaxExplosionDistance': 8,
    'FragmentsCount': 75,
    'FragmentType': '5996f6fc86f7745e585b4de3',
    'Strength': 110,
    'ContusionDistance': 11,
    'throwDamMax': 0,
    'explDelay': 5,
    'Blindness': {
      'x': 0,
      'y': 0,
      'z': 0
    },
    'Contusion': {
      'x': 2,
      'y': 4,
      'z': 14
    },
    'ArmorDistanceDistanceDamage': {
      'x': 1,
      'y': 4,
      'z': 29
    },
    'EmitTime': 0,
    'CanBeHiddenDuringThrow': true
  },
  '_proto': '5448be9a4bdc2dfd2f8b456a'
}

const marketData2 = {
  'id': '5a0c27731526d80618476ac4',
  'name': 'Zarya stun grenade',
  'shortName': 'Zarya',
  'iconLink': 'https://assets.tarkov-tools.com/5a0c27731526d80618476ac4-icon.jpg',
  'wikiLink': 'https://escapefromtarkov.fandom.com/wiki/Zarya_stun_grenade',
  'imageLink': 'https://assets.tarkov-tools.com/5a0c27731526d80618476ac4-image.jpg',
  'link': 'https://tarkov-tools.com/item/zarya-stun-grenade',
  'buyFor': [
    {
      'source': 'prapor',
      'price': 7320,
      'currency': 'RUB',
      'requirements': [{ 'type': 'loyaltyLevel', 'value': 2 }]
    },
    {
      'source': 'fleaMarket',
      'price': 8499,
      'currency': 'RUB',
      'requirements': [{ 'type': 'playerLevel', 'value': 20 }]
    }
  ]
}

const tarkovData2 = {
  '_id': '5a0c27731526d80618476ac4',
  '_name': 'weapon_grenade_zarya',
  '_parent': '543be6564bdc2df4348b4568',
  '_type': 'Item',
  '_props': {
    'Name': 'Zarya stun grenade',
    'ShortName': 'Zarya',
    'Description': 'Intended to suppress the mental stability by creating a sudden sound effect and a bright flash. Used in special operations for apprehension of criminals and in riot suppression.',
    'Weight': 0.175,
    'BackgroundColor': 'grey',
    'Width': 1,
    'Height': 1,
    'StackMaxSize': 1,
    'Rarity': 'Rare',
    'SpawnChance': 3,
    'CreditsPrice': 6715,
    'ItemSound': 'grenade',
    'Prefab': {
      'path': 'assets/content/weapons/zarya/weapon_grenade_zarya_container.bundle',
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
    'ThrowType': 'flash_grenade',
    'ExplDelay': 2,
    'MinExplosionDistance': 0,
    'MaxExplosionDistance': 0,
    'FragmentsCount': 0,
    'FragmentType': '5996f6cb86f774678763a6ca',
    'Strength': 0,
    'ContusionDistance': 10,
    'throwDamMax': 0,
    'explDelay': 2,
    'Blindness': {
      'x': 10,
      'y': 20,
      'z': 40
    },
    'Contusion': {
      'x': 1.5,
      'y': 4,
      'z': 20
    },
    'ArmorDistanceDistanceDamage': {
      'x': 0,
      'y': 0,
      'z': 0
    },
    'EmitTime': 0,
    'CanBeHiddenDuringThrow': true
  },
  '_proto': '5448be9a4bdc2dfd2f8b456a'
}