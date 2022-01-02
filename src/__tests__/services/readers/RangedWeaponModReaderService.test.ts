import { IPrice } from '../../../models/utils/IPrice'
import { RangedWeaponModReaderService } from '../../../services/readers/RangedWeaponModReaderService'

describe('read() and readMarketData()', () => {
  it('should populate a ranged weapon properties from Tarkov data', async () => {
    // Arrange
    const service = new RangedWeaponModReaderService()

    // Act
    const item = await service.read(tarkovData, 'rangedWeaponMod')
    await service.readMarketData(marketData, item)

    // Assert
    expect(item.accuracyPercentageModifier).toBe(-1)
    expect(item.ergonomicsModifier).toBe(-20)
    expect(item.modSlots).toStrictEqual([])
    expect(item.recoilPercentageModifier).toBe(-12)

    expect(item.id).toBe('5a0d63621526d8dba31fe3bf')
    expect(item.caption).toBe('PBS-1 7.62x39 sound suppressor')
    expect(item.categoryId).toBe('rangedWeaponMod')
    expect(item.conflictingItemIds).toStrictEqual([])
    expect(item.description).toBe('PBS-1 is a device manufactured by TSNIITochmash for noiseless and flash-free fire with 7.62mm modernized Kalashnikov.')
    expect(item.iconLink).toBe('https://assets.tarkov-tools.com/5a0d63621526d8dba31fe3bf-icon.jpg')
    expect(item.imageLink).toBe('https://assets.tarkov-tools.com/5a0d63621526d8dba31fe3bf-image.jpg')
    expect(item.marketLink).toBe('https://tarkov-tools.com/item/pbs-1-762x39-sound-suppressor')
    expect(item.maxStackableAmount).toBe(1)
    expect(item.name).toBe('silencer_akm_tochmash_pbs-1_762x39')
    expect(item.prices).toStrictEqual([
      {
        currencyName: 'RUB',
        merchant: 'prapor',
        merchantLevel: 3,
        requiresQuest: false,
        value: 52512,
        valueInMainCurrency: 0
      },
      {
        currencyName: 'RUB',
        merchant: 'fleaMarket',
        merchantLevel: undefined,
        requiresQuest: false,
        value: 29324,
        valueInMainCurrency: 0
      }
    ] as IPrice[])
    expect(item.shortName).toBe('PBS-1')
    expect(item.weight).toBe(0.435)
    expect(item.wikiLink).toBe('https://escapefromtarkov.fandom.com/wiki/PBS-1_7.62x39_silencer')
  })
})

const marketData = {
  'id': '5a0d63621526d8dba31fe3bf',
  'name': 'PBS-1 7.62x39 sound suppressor',
  'shortName': 'PBS-1',
  'iconLink': 'https://assets.tarkov-tools.com/5a0d63621526d8dba31fe3bf-icon.jpg',
  'wikiLink': 'https://escapefromtarkov.fandom.com/wiki/PBS-1_7.62x39_silencer',
  'imageLink': 'https://assets.tarkov-tools.com/5a0d63621526d8dba31fe3bf-image.jpg',
  'link': 'https://tarkov-tools.com/item/pbs-1-762x39-sound-suppressor',
  'buyFor': [
    {
      'source': 'prapor',
      'price': 52512,
      'currency': 'RUB',
      'requirements': [{ 'type': 'loyaltyLevel', 'value': 3 }]
    },
    {
      'source': 'fleaMarket',
      'price': 29324,
      'currency': 'RUB',
      'requirements': [{ 'type': 'playerLevel', 'value': 20 }]
    }
  ]
}

const tarkovData = {
  '_id': '5a0d63621526d8dba31fe3bf',
  '_name': 'silencer_akm_tochmash_pbs-1_762x39',
  '_parent': '550aa4cd4bdc2dd8348b456c',
  '_type': 'Item',
  '_props': {
    'Name': 'PBS-1 7.62x39 silencer',
    'ShortName': 'PBS-1',
    'Description': 'PBS-1 is a device manufactured by TSNIITochmash for noiseless and flash-free fire with 7.62mm modernized Kalashnikov.',
    'Weight': 0.435,
    'BackgroundColor': 'blue',
    'Width': 2,
    'Height': 1,
    'StackMaxSize': 1,
    'Rarity': 'Rare',
    'SpawnChance': 3,
    'CreditsPrice': 48176,
    'ItemSound': 'mod',
    'Prefab': {
      'path': 'assets/content/items/mods/silencers/silencer_akm_tochmash_pbs-1_762x39.bundle',
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
    'LootExperience': 30,
    'ExamineExperience': 4,
    'HideEntrails': false,
    'RepairCost': 0,
    'RepairSpeed': 0,
    'ExtraSizeLeft': 1,
    'ExtraSizeRight': 0,
    'ExtraSizeUp': 0,
    'ExtraSizeDown': 0,
    'ExtraSizeForceAdd': true,
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
    'Accuracy': -1,
    'Recoil': -12,
    'Loudness': -23,
    'EffectiveDistance': 0,
    'Ergonomics': -20,
    'Velocity': 0.75,
    'RaidModdable': true,
    'ToolModdable': true,
    'BlocksFolding': false,
    'BlocksCollapsible': false,
    'IsAnimated': false,
    'HasShoulderContact': false,
    'SightingRange': 0,
    'muzzleModType': 'silencer'
  },
  '_proto': '55d614004bdc2d86028b4568'
}