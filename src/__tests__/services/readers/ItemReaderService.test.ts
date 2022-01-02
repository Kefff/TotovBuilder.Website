import { IPrice } from '../../../models/utils/IPrice'
import { ItemReaderService } from '../../../services/readers/ItemReaderService'

describe('read() and readMarketData()', () => {
  it('should populate an item properties', async () => {
    // Arrange
    const service = new ItemReaderService()

    // Act
    const item = await service.read(tarkovData, 'medical')
    await service.readMarketData(marketData, item)

    // Assert
    expect(item.id).toBe('544fb3364bdc2d34748b456a')
    expect(item.caption).toBe('Immobilizing splint')
    expect(item.categoryId).toBe('medical')
    expect(item.conflictingItemIds).toStrictEqual([])
    expect(item.description).toBe('Common splint for fixing the damaged bones in position as an emergency aid measure.')
    expect(item.iconLink).toBe('https://assets.tarkov-tools.com/544fb3364bdc2d34748b456a-icon.jpg')
    expect(item.imageLink).toBe('https://assets.tarkov-tools.com/544fb3364bdc2d34748b456a-image.jpg')
    expect(item.maxStackableAmount).toBe(1)
    expect(item.marketLink).toBe('https://tarkov-tools.com/item/immobilizing-splint')
    expect(item.name).toBe('splint')
    expect(item.prices).toStrictEqual([
      {
        currencyName: 'RUB',
        merchant: 'therapist',
        merchantLevel: 1,
        requiresQuest: false,
        value: 2677,
        valueInMainCurrency: 0
      },
      {
        currencyName: 'RUB',
        merchant: 'fleaMarket',
        merchantLevel: undefined,
        requiresQuest: false,
        value: 3431,
        valueInMainCurrency: 0
      }
    ] as IPrice[])
    expect(item.shortName).toBe('Splint')
    expect(item.weight).toBe(0.17)
    expect(item.wikiLink).toBe('https://escapefromtarkov.fandom.com/wiki/Aluminum_splint')
  })
})

const marketData = {
  'id': '544fb3364bdc2d34748b456a',
  'name': 'Immobilizing splint',
  'shortName': 'Splint',
  'iconLink': 'https://assets.tarkov-tools.com/544fb3364bdc2d34748b456a-icon.jpg',
  'wikiLink': 'https://escapefromtarkov.fandom.com/wiki/Aluminum_splint',
  'imageLink': 'https://assets.tarkov-tools.com/544fb3364bdc2d34748b456a-image.jpg',
  'link': 'https://tarkov-tools.com/item/immobilizing-splint',
  'buyFor': [
    {
      'source': 'therapist',
      'price': 2677,
      'currency': 'RUB',
      'requirements': [{ 'type': 'loyaltyLevel', 'value': 1 }]
    },
    {
      'source': 'fleaMarket',
      'price': 3431,
      'currency': 'RUB',
      'requirements': [{ 'type': 'playerLevel', 'value': 20 }]
    }
  ]
}

const tarkovData = {
  '_id': '544fb3364bdc2d34748b456a',
  '_name': 'splint',
  '_parent': '5448f3ac4bdc2dce718b4569',
  '_type': 'Item',
  '_props': {
    'Name': 'Immobilizing splint',
    'ShortName': 'Splint',
    'Description': 'Common splint for fixing the damaged bones in position as an emergency aid measure.',
    'Weight': 0.17,
    'BackgroundColor': 'orange',
    'Width': 1,
    'Height': 1,
    'StackMaxSize': 1,
    'Rarity': 'Common',
    'SpawnChance': 12,
    'CreditsPrice': 1855,
    'ItemSound': 'generic',
    'Prefab': {
      'path': 'assets/content/weapons/usable_items/item_splint/item_splint_loot.bundle',
      'rcid': ''
    },
    'UsePrefab': {
      'path': 'assets/content/weapons/usable_items/item_splint/item_splint_container.bundle',
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
    'LootExperience': 40,
    'ExamineExperience': 2,
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
    'FixedPrice': true,
    'Unlootable': false,
    'UnlootableFromSlot': 'FirstPrimaryWeapon',
    'UnlootableFromSide': [],
    'ChangePriceCoef': 1,
    'AllowSpawnOnLocations': [],
    'SendToClient': false,
    'AnimationVariantsNumber': 0,
    'DiscardingBlock': false,
    'RagFairCommissionModifier': 1,
    'medUseTime': 5,
    'medEffectType': 'duringUse',
    'MaxHpResource': 0,
    'hpResourceRate': 0,
    'StimulatorBuffs': '',
    'effects_health': [],
    'effects_damage': {
      'Fracture': {
        'delay': 0,
        'duration': 0,
        'fadeOut': 0
      }
    }
  }
}