import { IPrice } from '../../../models/utils/IPrice'
import { ContainerReaderService } from '../../../services/readers/ContainerReaderService'

describe('read() and readMarketData()', () => {
  it('should populate a container properties from Tarkov data', async () => {
    // Arrange
    const service = new ContainerReaderService()

    // Act
    const item = await service.read(tarkovData, 'backpack')
    await service.readMarketData(marketData, item)

    // Assert
    expect(item.capacity).toBe(20)

    expect(item.id).toBe('5ca20d5986f774331e7c9602')
    expect(item.caption).toBe('WARTECH Berkut BB-102 backpack')
    expect(item.categoryId).toBe('backpack')
    expect(item.conflictingItemIds).toEqual([])
    expect(item.description).toBe('Tactical backpack with front loading. Suitable for use by military or security forces or for military tactical games.')
    expect(item.iconLink).toBe('https://assets.tarkov-tools.com/5ca20d5986f774331e7c9602-icon.jpg')
    expect(item.imageLink).toBe('https://assets.tarkov-tools.com/5ca20d5986f774331e7c9602-image.jpg')
    expect(item.marketLink).toBe('https://tarkov-tools.com/item/wartech-berkut-bb-102-backpack')
    expect(item.maxStackableAmount).toBe(1)
    expect(item.name).toBe('item_equipment_backpack_wartech')
    expect(item.prices).toStrictEqual([
      {
        currencyName: 'RUB',
        merchant: 'ragman',
        merchantLevel: 1,
        requiresQuest: false,
        value: 23444,
        valueInMainCurrency: 0
      },
      {
        currencyName: 'RUB',
        merchant: 'fleaMarket',
        merchantLevel: undefined,
        requiresQuest: false,
        value: 22836,
        valueInMainCurrency: 0
      }
    ] as IPrice[])
    expect(item.shortName).toBe('Berkut')
    expect(item.weight).toBe(0.8)
    expect(item.wikiLink).toBe('https://escapefromtarkov.fandom.com/wiki/Wartech_Berkut_VV-102_backpack')
  })
})

const marketData = {
  'id': '5ca20d5986f774331e7c9602',
  'name': 'WARTECH Berkut BB-102 backpack',
  'shortName': 'Berkut',
  'iconLink': 'https://assets.tarkov-tools.com/5ca20d5986f774331e7c9602-icon.jpg',
  'wikiLink': 'https://escapefromtarkov.fandom.com/wiki/Wartech_Berkut_VV-102_backpack',
  'imageLink': 'https://assets.tarkov-tools.com/5ca20d5986f774331e7c9602-image.jpg',
  'link': 'https://tarkov-tools.com/item/wartech-berkut-bb-102-backpack',
  'buyFor': [
    {
      'source': 'ragman',
      'price': 23444,
      'currency': 'RUB',
      'requirements': [{ 'type': 'loyaltyLevel', 'value': 1 }]
    },
    {
      'source': 'fleaMarket',
      'price': 22836,
      'currency': 'RUB',
      'requirements': [{ 'type': 'playerLevel', 'value': 20 }]
    }
  ]
}

const tarkovData = {
  '_id': '5ca20d5986f774331e7c9602',
  '_name': 'item_equipment_backpack_wartech',
  '_parent': '5448e53e4bdc2d60728b4567',
  '_type': 'Item',
  '_props': {
    'Name': 'WARTECH Berkut BB-102 backpack',
    'ShortName': 'Berkut',
    'Description': 'Tactical backpack with front loading. Suitable for use by military or security forces or for military tactical games.',
    'Weight': 0.8,
    'BackgroundColor': 'violet',
    'Width': 4,
    'Height': 5,
    'StackMaxSize': 1,
    'Rarity': 'Common',
    'SpawnChance': 3,
    'CreditsPrice': 19200,
    'ItemSound': 'gear_backpack',
    'Prefab': {
      'path': 'assets/content/items/equipment/backpack_wartech/item_equipment_backpack_wartech.bundle',
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
    'HideEntrails': true,
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
    'Grids': [
      {
        '_name': 'main',
        '_id': '5ca20d5986f774331e7c9604',
        '_parent': '5ca20d5986f774331e7c9602',
        '_props': {
          'filters': [
            {
              'Filter': [
                '54009119af1c881c07000029'
              ],
              'ExcludedFilter': [
                '5448bf274bdc2dfc2f8b456a',
                '5c0a840b86f7742ffa4f2482',
                '5b7c710788a4506dec015957',
                '59fb042886f7746c5005a7b2',
                '5b6d9ce188a4501afc1b2b25'
              ]
            }
          ],
          'cellsH': 4,
          'cellsV': 5,
          'minCount': 0,
          'maxCount': 0,
          'maxWeight': 0
        },
        '_proto': '55d329c24bdc2d892f8b4567'
      }
    ],
    'Slots': [],
    'CanPutIntoDuringTheRaid': true,
    'CantRemoveFromSlotsDuringRaid': [],
    'SearchSound': 'looting_body_extended',
    'BlocksArmorVest': false,
    'speedPenaltyPercent': 0,
    'GridLayoutName': ''
  },
  '_proto': '545cdae64bdc2d39198b4568'
}