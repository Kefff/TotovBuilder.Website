import { IPrice } from '../../../models/utils/IPrice'
import { VestReaderService } from '../../../services/readers/VestReaderService'

describe('read() and readMarketData()', () => {
  it('should populate a vest properties from Tarkov data', async () => {
    // Arrange
    const service = new VestReaderService()

    // Act
    const item = await service.read(tarkovData, 'vest')
    await service.readMarketData(marketData, item)

    // Assert
    expect(item.armorClass).toBe(4)
    expect(item.armoredAreas).toStrictEqual(['Chest', 'Stomach'])
    expect(item.capacity).toBe(12)
    expect(item.durability).toBe(40)
    expect(item.ergonomicsPercentageModifier).toBe(-15)
    expect(item.material).toBe('Titan')
    expect(item.movementSpeedPercentageModifier).toBe(-10)
    expect(item.turningSpeedPercentageModifier).toBe(-5)

    expect(item.id).toBe('5d5d646386f7742797261fd9')
    expect(item.caption).toBe('6B3TM-01M armored rig')
    expect(item.categoryId).toBe('vest')
    expect(item.conflictingItemIds).toStrictEqual([])
    expect(item.description).toBe('Modified general army body armor 6B3 under the index 6B3TM-01M. Actively used during the war in Afghanistan. It has a comprehensive titanium 4-class GOST protection and a set of several pouches for magazines and grenades.\r\n')
    expect(item.iconLink).toBe('https://assets.tarkov-tools.com/5d5d646386f7742797261fd9-icon.jpg')
    expect(item.imageLink).toBe('https://assets.tarkov-tools.com/5d5d646386f7742797261fd9-image.jpg')
    expect(item.marketLink).toBe('https://tarkov-tools.com/item/6b3tm-01m-armored-rig')
    expect(item.maxStackableAmount).toBe(1)
    expect(item.name).toBe('item_equipment_armor_6b3')
    expect(item.prices).toStrictEqual([
      {
        currencyName: 'RUB',
        merchant: 'ragman',
        merchantLevel: 1,
        requiresQuest: false,
        value: 50283,
        valueInMainCurrency: 0
      },
      {
        currencyName: 'RUB',
        merchant: 'fleaMarket',
        merchantLevel: undefined,
        requiresQuest: false,
        value: 64811,
        valueInMainCurrency: 0
      }
    ] as IPrice[])
    expect(item.shortName).toBe('6B3TM-01M')
    expect(item.weight).toBe(9.2)
    expect(item.wikiLink).toBe('https://escapefromtarkov.fandom.com/wiki/6B3TM-01M_armored_rig')
  })
})

const marketData = {
  'id': '5d5d646386f7742797261fd9',
  'name': '6B3TM-01M armored rig',
  'shortName': '6B3TM-01M',
  'iconLink': 'https://assets.tarkov-tools.com/5d5d646386f7742797261fd9-icon.jpg',
  'wikiLink': 'https://escapefromtarkov.fandom.com/wiki/6B3TM-01M_armored_rig',
  'imageLink': 'https://assets.tarkov-tools.com/5d5d646386f7742797261fd9-image.jpg',
  'link': 'https://tarkov-tools.com/item/6b3tm-01m-armored-rig',
  'buyFor': [
    {
      'source': 'ragman',
      'price': 50283,
      'currency': 'RUB',
      'requirements': [{ 'type': 'loyaltyLevel', 'value': 1 }]
    },
    {
      'source': 'fleaMarket',
      'price': 64811,
      'currency': 'RUB',
      'requirements': [{ 'type': 'playerLevel', 'value': 20 }]
    }
  ]
}

const tarkovData = {
  '_id': '5d5d646386f7742797261fd9',
  '_name': 'item_equipment_armor_6b3',
  '_parent': '5448e5284bdc2dcb718b4567',
  '_type': 'Item',
  '_props': {
    'Name': '6B3TM-01M armored rig',
    'ShortName': '6B3TM-01M',
    'Description': 'Modified general army body armor 6B3 under the index 6B3TM-01M. Actively used during the war in Afghanistan. It has a comprehensive titanium 4-class GOST protection and a set of several pouches for magazines and grenades.\r\n',
    'Weight': 9.2,
    'BackgroundColor': 'default',
    'Width': 3,
    'Height': 4,
    'StackMaxSize': 1,
    'Rarity': 'Rare',
    'SpawnChance': 5,
    'CreditsPrice': 45300,
    'ItemSound': 'gear_generic',
    'Prefab': {
      'path': 'assets/content/items/equipment/armor_6b3/item_equipment_armor_6b3.bundle',
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
    'HideEntrails': true,
    'RepairCost': 650,
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
        '_name': '1',
        '_id': '5d5d646386f7742797261fdb',
        '_parent': '5d5d646386f7742797261fd9',
        '_props': {
          'filters': [
            {
              'Filter': [
                '54009119af1c881c07000029'
              ],
              'ExcludedFilter': [
                '5448bf274bdc2dfc2f8b456a'
              ]
            }
          ],
          'cellsH': 1,
          'cellsV': 1,
          'minCount': 0,
          'maxCount': 0,
          'maxWeight': 0
        },
        '_proto': '55d329c24bdc2d892f8b4567'
      },
      {
        '_name': '2',
        '_id': '5d5d646386f7742797261fdc',
        '_parent': '5d5d646386f7742797261fd9',
        '_props': {
          'filters': [
            {
              'Filter': [
                '54009119af1c881c07000029'
              ],
              'ExcludedFilter': [
                '5448bf274bdc2dfc2f8b456a'
              ]
            }
          ],
          'cellsH': 1,
          'cellsV': 1,
          'minCount': 0,
          'maxCount': 0,
          'maxWeight': 0
        },
        '_proto': '55d329c24bdc2d892f8b4567'
      },
      {
        '_name': '3',
        '_id': '5d5d646386f7742797261fdd',
        '_parent': '5d5d646386f7742797261fd9',
        '_props': {
          'filters': [
            {
              'Filter': [
                '54009119af1c881c07000029'
              ],
              'ExcludedFilter': [
                '5448bf274bdc2dfc2f8b456a'
              ]
            }
          ],
          'cellsH': 1,
          'cellsV': 2,
          'minCount': 0,
          'maxCount': 0,
          'maxWeight': 0
        },
        '_proto': '55d329c24bdc2d892f8b4567'
      },
      {
        '_name': '4',
        '_id': '5d5d646386f7742797261fde',
        '_parent': '5d5d646386f7742797261fd9',
        '_props': {
          'filters': [
            {
              'Filter': [
                '54009119af1c881c07000029'
              ],
              'ExcludedFilter': [
                '5448bf274bdc2dfc2f8b456a'
              ]
            }
          ],
          'cellsH': 1,
          'cellsV': 2,
          'minCount': 0,
          'maxCount': 0,
          'maxWeight': 0
        },
        '_proto': '55d329c24bdc2d892f8b4567'
      },
      {
        '_name': '5',
        '_id': '5d5d646386f7742797261fdf',
        '_parent': '5d5d646386f7742797261fd9',
        '_props': {
          'filters': [
            {
              'Filter': [
                '54009119af1c881c07000029'
              ],
              'ExcludedFilter': [
                '5448bf274bdc2dfc2f8b456a'
              ]
            }
          ],
          'cellsH': 1,
          'cellsV': 2,
          'minCount': 0,
          'maxCount': 0,
          'maxWeight': 0
        },
        '_proto': '55d329c24bdc2d892f8b4567'
      },
      {
        '_name': '6',
        '_id': '5d5d646386f7742797261fe0',
        '_parent': '5d5d646386f7742797261fd9',
        '_props': {
          'filters': [
            {
              'Filter': [
                '54009119af1c881c07000029'
              ],
              'ExcludedFilter': [
                '5448bf274bdc2dfc2f8b456a'
              ]
            }
          ],
          'cellsH': 1,
          'cellsV': 2,
          'minCount': 0,
          'maxCount': 0,
          'maxWeight': 0
        },
        '_proto': '55d329c24bdc2d892f8b4567'
      },
      {
        '_name': '7',
        '_id': '5d5d65b486f77427997cfaec',
        '_parent': '5d5d646386f7742797261fd9',
        '_props': {
          'filters': [
            {
              'Filter': [
                '54009119af1c881c07000029'
              ],
              'ExcludedFilter': [
                '5448bf274bdc2dfc2f8b456a'
              ]
            }
          ],
          'cellsH': 1,
          'cellsV': 1,
          'minCount': 0,
          'maxCount': 0,
          'maxWeight': 0
        },
        '_proto': '55d329c24bdc2d892f8b4567'
      },
      {
        '_name': '8',
        '_id': '5d5d65c186f77439eb4c2c57',
        '_parent': '5d5d646386f7742797261fd9',
        '_props': {
          'filters': [
            {
              'Filter': [
                '54009119af1c881c07000029'
              ],
              'ExcludedFilter': [
                '5448bf274bdc2dfc2f8b456a'
              ]
            }
          ],
          'cellsH': 1,
          'cellsV': 1,
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
    'BlocksArmorVest': true,
    'RigLayoutName': '6B3-01',
    'Durability': 40,
    'MaxDurability': 40,
    'armorZone': [
      'Chest',
      'Stomach'
    ],
    'armorClass': 4,
    'speedPenaltyPercent': -10,
    'mousePenalty': -5,
    'weaponErgonomicPenalty': -15,
    'BluntThroughput': 0.24,
    'ArmorMaterial': 'Titan'
  },
  '_proto': '544a5caa4bdc2d1a388b4568'
}