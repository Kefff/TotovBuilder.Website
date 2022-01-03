import { IPrice } from '../../../models/utils/IPrice'
import { ArmorModReaderService } from '../../../services/readers/ArmorModReaderService'

describe('read() and readMarketData()', () => {
  it('should populate armor mod properties from Tarkov data', async () => {
    // Arrange
    const service = new ArmorModReaderService()

    // Act
    const item = await service.read(tarkovData, 'armorMod')
    await service.readMarketData(marketData, item)

    // Assert
    expect(item.armorClass).toBe(6)
    expect(item.durability).toBe(40)
    expect(item.ergonomicsPercentageModifier).toBe(-11)
    expect(item.material).toBe('Ceramic')
    expect(item.modSlots).toStrictEqual([
      {
        compatibleItemIds: [
          '5c0558060db834001b735271',
          '5a16b8a9fcdbcb00165aa6ca'
        ],
        id: '5ea18c84ecf1982c7712d9a4',
        maxStackableAmount: undefined,
        name: 'mod_nvg',
        required: false
      }
    ])
    expect(item.movementSpeedPercentageModifier).toBe(0)
    expect(item.turningSpeedPercentageModifier).toBe(-6)

    expect(item.id).toBe('5ea18c84ecf1982c7712d9a2')
    expect(item.caption).toBe('Bastion helmet armor plate')
    expect(item.categoryId).toBe('armorMod')
    expect(item.conflictingItemIds).toStrictEqual([
      '5a16ba61fcdbcb098008728a',
      '5a16b672fcdbcb001912fa83',
      '5a16b7e1fcdbcb00165aa6c9',
      '5aa7e3abe5b5b000171d064d',
      '5c0e66e2d174af02a96252f4',
      '5e00cdd986f7747473332240'
    ])
    expect(item.description).toBe('Optional modular armor protection for Diamond Age Bastion helmet.')
    expect(item.iconLink).toBe('https://assets.tarkov-tools.com/5ea18c84ecf1982c7712d9a2-icon.jpg')
    expect(item.imageLink).toBe('https://assets.tarkov-tools.com/5ea18c84ecf1982c7712d9a2-image.jpg')
    expect(item.marketLink).toBe('https://tarkov-tools.com/item/bastion-helmet-armor-plate')
    expect(item.maxStackableAmount).toBe(1)
    expect(item.name).toBe('item_equipment_helmet_diamond_age_bastion_shield')
    expect(item.prices).toStrictEqual([
      {
        currencyName: 'RUB',
        merchant: 'fleaMarket',
        merchantLevel: undefined,
        requiresQuest: false,
        value: 123150,
        valueInMainCurrency: 0
      }
    ] as IPrice[])
    expect(item.shortName).toBe('Bastion plate')
    expect(item.weight).toBe(0.99)
    expect(item.wikiLink).toBe('https://escapefromtarkov.fandom.com/wiki/Additional_armor_for_the_Bastion_helmet')
  })
})

const marketData = {
  'id': '5ea18c84ecf1982c7712d9a2',
  'name': 'Bastion helmet armor plate',
  'shortName': 'Bastion plate',
  'iconLink': 'https://assets.tarkov-tools.com/5ea18c84ecf1982c7712d9a2-icon.jpg',
  'wikiLink': 'https://escapefromtarkov.fandom.com/wiki/Additional_armor_for_the_Bastion_helmet',
  'imageLink': 'https://assets.tarkov-tools.com/5ea18c84ecf1982c7712d9a2-image.jpg',
  'link': 'https://tarkov-tools.com/item/bastion-helmet-armor-plate',
  'buyFor': [
    {
      'source': 'fleaMarket',
      'price': 123150,
      'currency': 'RUB',
      'requirements': [{ 'type': 'playerLevel', 'value': 20 }]
    }
  ]
}

const tarkovData = {
  '_id': '5ea18c84ecf1982c7712d9a2',
  '_name': 'item_equipment_helmet_diamond_age_bastion_shield',
  '_parent': '57bef4c42459772e8d35a53b',
  '_type': 'Item',
  '_props': {
    'Name': 'Additional armor for the Bastion helmet',
    'ShortName': 'Bastion',
    'Description': 'Optional modular armor protection for Diamond Age Bastion helmet.',
    'Weight': 0.99,
    'BackgroundColor': 'default',
    'Width': 2,
    'Height': 1,
    'StackMaxSize': 1,
    'Rarity': 'Superrare',
    'SpawnChance': 1,
    'CreditsPrice': 110300,
    'ItemSound': 'gear_helmet',
    'Prefab': {
      'path': 'assets/content/items/equipment/helmet_diamond_age_bastion_shield/item_equipment_helmet_diamond_age_bastion_shield.bundle',
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
    'RepairCost': 140,
    'RepairSpeed': 10,
    'ExtraSizeLeft': 0,
    'ExtraSizeRight': 0,
    'ExtraSizeUp': 0,
    'ExtraSizeDown': 0,
    'ExtraSizeForceAdd': false,
    'MergesWithChildren': true,
    'CanSellOnRagfair': true,
    'CanRequireOnRagfair': true,
    'ConflictingItems': [
      '5a16ba61fcdbcb098008728a',
      '5a16b672fcdbcb001912fa83',
      '5a16b7e1fcdbcb00165aa6c9',
      '5aa7e3abe5b5b000171d064d',
      '5c0e66e2d174af02a96252f4',
      '5e00cdd986f7747473332240'
    ],
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
    'Slots': [
      {
        '_name': 'mod_nvg',
        '_id': '5ea18c84ecf1982c7712d9a4',
        '_parent': '5ea18c84ecf1982c7712d9a2',
        '_props': {
          'filters': [
            {
              'Shift': 0,
              'Filter': [
                '5c0558060db834001b735271',
                '5a16b8a9fcdbcb00165aa6ca'
              ]
            }
          ]
        },
        '_required': false,
        '_mergeSlotWithChildren': false,
        '_proto': '55d30c4c4bdc2db4468b457e'
      }
    ],
    'CanPutIntoDuringTheRaid': true,
    'CantRemoveFromSlotsDuringRaid': [],
    'BlocksEarpiece': false,
    'BlocksEyewear': false,
    'BlocksHeadwear': false,
    'BlocksFaceCover': false,
    'Durability': 40,
    'MaxDurability': 40,
    'armorClass': '6',
    'speedPenaltyPercent': 0,
    'mousePenalty': -6,
    'weaponErgonomicPenalty': -11,
    'armorZone': [
      'Head'
    ],
    'Indestructibility': 0.9,
    'headSegments': [
      'Top',
      'Nape'
    ],
    'FaceShieldComponent': false,
    'FaceShieldMask': 'NoMask',
    'HasHinge': false,
    'MaterialType': 'Helmet',
    'RicochetParams': {
      'x': 0.9,
      'y': 0.4,
      'z': 50
    },
    'DeafStrength': 'None',
    'BluntThroughput': 0.05,
    'ArmorMaterial': 'Ceramic',
    'BlindnessProtection': 0
  },
  '_proto': '5645bc214bdc2d363b8b4571'
}