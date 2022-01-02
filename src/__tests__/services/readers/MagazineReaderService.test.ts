import { IPrice } from '../../../models/utils/IPrice'
import { MagazineReaderService } from '../../../services/readers/MagazineReaderService'

describe('read() and readMarketData()', () => {
  it('should populate a magazine properties from Tarkov data', async () => {
    // Arrange
    const service = new MagazineReaderService()

    // Act
    const item = await service.read(tarkovData, 'magazine')
    await service.readMarketData(marketData, item)

    // Assert
    expect(item.acceptedAmmunitionIds).toEqual([
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
    ])
    expect(item.capacity).toBe(30)
    expect(item.checkSpeedPercentageModifier).toBe(-20)
    expect(item.ergonomicsModifier).toBe(-2)
    expect(item.loadSpeedPercentageModifier).toBe(-10)

    expect(item.id).toBe('5bed61680db834001d2c45ab')
    expect(item.caption).toBe('AK-12 5.45x39 30-round magazine')
    expect(item.categoryId).toBe('magazine')
    expect(item.conflictingItemIds).toEqual([])
    expect(item.description).toBe('30-round windowed, polymer Izhmash magazine for 5.45x39 ammo, for АК-12 and compatible systems.')
    expect(item.iconLink).toBe('https://assets.tarkov-tools.com/5bed61680db834001d2c45ab-icon.jpg')
    expect(item.imageLink).toBe('https://assets.tarkov-tools.com/5bed61680db834001d2c45ab-image.jpg')
    expect(item.marketLink).toBe('https://tarkov-tools.com/item/ak-12-545x39-30-round-magazine')
    expect(item.maxStackableAmount).toBe(1)
    expect(item.name).toBe('mag_ak_izhmash_ak12_std_545x39_30')
    expect(item.prices).toStrictEqual([
      {
        currencyName: 'RUB',
        merchant: 'prapor',
        merchantLevel: 4,
        requiresQuest: false,
        value: 3747,
        valueInMainCurrency: 0
      },
      {
        currencyName: 'RUB',
        merchant: 'fleaMarket',
        merchantLevel: undefined,
        requiresQuest: false,
        value: 12128,
        valueInMainCurrency: 0
      }
    ] as IPrice[])
    expect(item.shortName).toBe('AK-12')
    expect(item.weight).toBe(0.19)
    expect(item.wikiLink).toBe('https://escapefromtarkov.fandom.com/wiki/30-round_5.45x39_magazine_for_AK-12_and_compatibles')
  })
})

const marketData = {
  'id': '5bed61680db834001d2c45ab',
  'name': 'AK-12 5.45x39 30-round magazine',
  'shortName': 'AK-12',
  'iconLink': 'https://assets.tarkov-tools.com/5bed61680db834001d2c45ab-icon.jpg',
  'wikiLink': 'https://escapefromtarkov.fandom.com/wiki/30-round_5.45x39_magazine_for_AK-12_and_compatibles',
  'imageLink': 'https://assets.tarkov-tools.com/5bed61680db834001d2c45ab-image.jpg',
  'link': 'https://tarkov-tools.com/item/ak-12-545x39-30-round-magazine',
  'buyFor': [
    {
      'source': 'prapor',
      'price': 3747,
      'currency': 'RUB',
      'requirements': [{ 'type': 'loyaltyLevel', 'value': 4 }]
    },
    {
      'source': 'fleaMarket',
      'price': 12128,
      'currency': 'RUB',
      'requirements': [{ 'type': 'playerLevel', 'value': 20 }]
    }
  ]
}

const tarkovData = {
  '_id': '5bed61680db834001d2c45ab',
  '_name': 'mag_ak_izhmash_ak12_std_545x39_30',
  '_parent': '5448bc234bdc2d3c308b4569',
  '_type': 'Item',
  '_props': {
    'Name': '30-round 5.45x39 magazine for АК-12 and compatibles',
    'ShortName': 'АК-12 std.',
    'Description': '30-round windowed, polymer Izhmash magazine for 5.45x39 ammo, for АК-12 and compatible systems.',
    'Weight': 0.19,
    'BackgroundColor': 'yellow',
    'Width': 1,
    'Height': 2,
    'StackMaxSize': 1,
    'Rarity': 'Rare',
    'SpawnChance': 8,
    'CreditsPrice': 2750,
    'ItemSound': 'mag_plastic',
    'Prefab': {
      'path': 'assets/content/items/mods/magazines/mag_ak_izhmash_ak12_std_545x39_30.bundle',
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
    'LootExperience': 15,
    'ExamineExperience': 2,
    'HideEntrails': false,
    'RepairCost': 0,
    'RepairSpeed': 0,
    'ExtraSizeLeft': 0,
    'ExtraSizeRight': 0,
    'ExtraSizeUp': 0,
    'ExtraSizeDown': 1,
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
    'ToolModdable': false,
    'BlocksFolding': false,
    'BlocksCollapsible': false,
    'IsAnimated': false,
    'HasShoulderContact': false,
    'SightingRange': 0,
    'magAnimationIndex': 4,
    'Cartridges': [
      {
        '_name': 'cartridges',
        '_id': '5bed61680db834001d2c45ad',
        '_parent': '5bed61680db834001d2c45ab',
        '_max_count': 30,
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
              ]
            }
          ]
        },
        '_proto': '5748538b2459770af276a261'
      }
    ],
    'CanFast': true,
    'CanHit': false,
    'CanAdmin': false,
    'LoadUnloadModifier': -10,
    'CheckTimeModifier': -20,
    'CheckOverride': 1,
    'ReloadMagType': 'ExternalMagazine',
    'VisibleAmmoRangesString': '1-3'
  },
  '_proto': '55802d5f4bdc2dac148b458e'
}