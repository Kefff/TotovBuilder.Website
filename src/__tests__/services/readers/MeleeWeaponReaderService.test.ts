import { IPrice } from '../../../models/utils/IPrice'
import { MeleeWeaponReaderService } from '../../../services/readers/MeleeWeaponReaderService'

describe('read() and readMarketData()', () => {
  it('should populate a melee weapon properties from Tarkov data', async () => {
    // Arrange
    const service = new MeleeWeaponReaderService()

    // Act
    const item = await service.read(tarkovData, 'meleeWeapon')
    await service.readMarketData(marketData, item)

    // Assert
    expect(item.chopDamage).toBe(25)
    expect(item.hitRadius).toBe(0.6)
    expect(item.stabDamage).toBe(30)

    expect(item.id).toBe('5c0126f40db834002a125382')
    expect(item.caption).toBe('Red Rebel ice pick')
    expect(item.categoryId).toBe('meleeWeapon')
    expect(item.conflictingItemIds).toEqual([])
    expect(item.description).toBe('Perfectly balanced ice axe, the tip is made of a single piece of hardened metal.')
    expect(item.iconLink).toBe('https://assets.tarkov-tools.com/5c0126f40db834002a125382-icon.jpg')
    expect(item.imageLink).toBe('https://assets.tarkov-tools.com/5c0126f40db834002a125382-image.jpg')
    expect(item.marketLink).toBe('https://tarkov-tools.com/item/red-rebel-ice-pick')
    expect(item.maxStackableAmount).toBe(1)
    expect(item.name).toBe('weapon_red_rebel_axe')
    expect(item.prices).toStrictEqual([
      {
        currencyName: 'RUB',
        merchant: 'fleaMarket',
        merchantLevel: undefined,
        requiresQuest: false,
        value: 5633133,
        valueInMainCurrency: 0
      }
    ] as IPrice[])
    expect(item.shortName).toBe('RedRebel')
    expect(item.weight).toBe(0.65)
    expect(item.wikiLink).toBe('https://escapefromtarkov.fandom.com/wiki/Red_Rebel_Ice_pick')
  })
})

const marketData = {
  'id': '5c0126f40db834002a125382',
  'name': 'Red Rebel ice pick',
  'shortName': 'RedRebel',
  'iconLink': 'https://assets.tarkov-tools.com/5c0126f40db834002a125382-icon.jpg',
  'wikiLink': 'https://escapefromtarkov.fandom.com/wiki/Red_Rebel_Ice_pick',
  'imageLink': 'https://assets.tarkov-tools.com/5c0126f40db834002a125382-image.jpg',
  'link': 'https://tarkov-tools.com/item/red-rebel-ice-pick',
  'buyFor': [
    {
      'source': 'fleaMarket',
      'price': 5633133,
      'currency': 'RUB',
      'requirements': [{ 'type': 'playerLevel', 'value': 20 }]
    }
  ]
}

const tarkovData = {
  '_id': '5c0126f40db834002a125382',
  '_name': 'weapon_red_rebel_axe',
  '_parent': '5447e1d04bdc2dff2f8b4567',
  '_type': 'Item',
  '_props': {
    'Name': 'Red Rebel Ice pick',
    'ShortName': 'RR',
    'Description': 'Perfectly balanced ice axe, the tip is made of a single piece of hardened metal.',
    'Weight': 0.65,
    'BackgroundColor': 'grey',
    'Width': 1,
    'Height': 3,
    'StackMaxSize': 1,
    'Rarity': 'Superrare',
    'SpawnChance': 0.3,
    'CreditsPrice': 1106630,
    'ItemSound': 'knife_generic',
    'Prefab': {
      'path': 'assets/content/weapons/rebel/weapon_dmm_rebel_adze_axe_container.bundle',
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
    'Unlootable': true,
    'UnlootableFromSlot': 'Scabbard',
    'UnlootableFromSide': [
      'Bear',
      'Usec'
    ],
    'ChangePriceCoef': 1,
    'AllowSpawnOnLocations': [],
    'SendToClient': false,
    'AnimationVariantsNumber': 0,
    'DiscardingBlock': false,
    'RagFairCommissionModifier': 1,
    'knifeHitDelay': 0,
    'knifeHitSlashRate': 0,
    'knifeHitStabRate': 1,
    'knifeHitRadius': 0.6,
    'knifeHitSlashDam': 25,
    'knifeHitStabDam': 30,
    'knifeDurab': 85,
    'Durability': 85,
    'MaxDurability': 85,
    'PrimaryDistance': 0.6,
    'SecondryDistance': 0.65,
    'SlashPenetration': 1,
    'StabPenetration': 1,
    'MinRepairDegradation': 0,
    'MaxRepairDegradation': 0.01,
    'PrimaryConsumption': 10,
    'SecondryConsumption': 13,
    'DeflectionConsumption': 3,
    'StimulatorBuffs': '',
    'MaxResource': 0
  },
  '_proto': '54491bb74bdc2d09088b4567'
}