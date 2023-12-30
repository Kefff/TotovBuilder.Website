import { describe, expect, it } from 'vitest'
import { ReductionService } from '../../services/ReductionService'
import { IHeadwear } from '../../models/item/IHeadwear'

describe('parseReducedItem', () => {
  it.each([
    [
      {
        'ac': 4,
        'aa': [
          'Top',
          'Nape'
        ],
        'h': 1,
        'de': 'High',
        'd': 30,
        'e': -0.06,
        'ma': 'CombinedMaterials',
        'mo': [
          {
            'i': [
              '5a16b672fcdbcb001912fa83',
              '5a16b7e1fcdbcb00165aa6c9'
            ],
            'n': 'mod_equipment_000'
          },
          {
            'i': [
              '5c0558060db834001b735271',
              '5a16b8a9fcdbcb00165aa6ca'
            ],
            'n': 'mod_nvg'
          },
          {
            'i': [
              '5a398b75c4a282000a51a266',
              '5a398ab9c4a282000c5a9842'
            ],
            'n': 'mod_mount'
          }
        ],
        'ms': -0.02,
        't': -0.08,
        'c': 'headwear',
        'ic': 'https://assets.tarkov.dev/5e4bfc1586f774264f7582d3-icon.jpg',
        'i': '5e4bfc1586f774264f7582d3',
        'im': 'https://assets.tarkov.dev/5e4bfc1586f774264f7582d3-image.jpg',
        'm': 'https://tarkov.dev/item/msa-gallet-tc-800-high-cut-combat-helmet',
        'n': 'MSA Gallet TC 800 High Cut combat helmet',
        's': 'TC 800',
        'w': 1.17,
        'wi': 'https://escapefromtarkov.fandom.com/wiki/MSA_Gallet_TC_800_High_Cut_combat_helmet'
      },
      {
        armorClass: 4,
        armoredAreas: [
          'Top',
          'Nape'
        ],
        baseItemId: undefined,
        blocksHeadphones: true,
        categoryId: 'headwear',
        conflictingItemIds: [],
        deafening: 'High',
        defaultPresetId: undefined,
        durability: 30,
        ergonomicsPercentageModifier: -0.06,
        iconLink: 'https://assets.tarkov.dev/5e4bfc1586f774264f7582d3-icon.jpg',
        id: '5e4bfc1586f774264f7582d3',
        imageLink: 'https://assets.tarkov.dev/5e4bfc1586f774264f7582d3-image.jpg',
        marketLink: 'https://tarkov.dev/item/msa-gallet-tc-800-high-cut-combat-helmet',
        material: 'CombinedMaterials',
        maxStackableAmount: 1,
        modSlots: [
          {
            compatibleItemIds: [
              '5a16b672fcdbcb001912fa83',
              '5a16b7e1fcdbcb00165aa6c9'
            ],
            maxStackableAmount: 1,
            name: 'mod_equipment_000',
            required: false
          },
          {
            compatibleItemIds: [
              '5c0558060db834001b735271',
              '5a16b8a9fcdbcb00165aa6ca'
            ],
            maxStackableAmount: 1,
            name: 'mod_nvg',
            required: false
          },
          {
            compatibleItemIds: [
              '5a398b75c4a282000a51a266',
              '5a398ab9c4a282000c5a9842'
            ],
            maxStackableAmount: 1,
            name: 'mod_mount',
            required: false
          }
        ],
        movementSpeedPercentageModifier: -0.02,
        name: 'MSA Gallet TC 800 High Cut combat helmet',
        presetWearableModifiers: undefined,
        prices: [],
        ricochetChance: '',
        shortName: 'TC 800',
        turningSpeedPercentageModifier: -0.08,
        weight: 1.17,
        wikiLink: 'https://escapefromtarkov.fandom.com/wiki/MSA_Gallet_TC_800_High_Cut_combat_helmet'
      } as IHeadwear
    ],
    [
      {
        'c': 'headwear',
        'ic': 'https://assets.tarkov.dev/5bd073c986f7747f627e796c-icon.jpg',
        'i': '5bd073c986f7747f627e796c',
        'im': 'https://assets.tarkov.dev/5bd073c986f7747f627e796c-image.jpg',
        'm': 'https://tarkov.dev/item/kotton-beanie',
        'n': 'Kotton beanie',
        's': 'Kotton',
        'w': 0.2,
        'wi': 'https://escapefromtarkov.fandom.com/wiki/Kotton_beanie'
      },
      {
        armorClass: 0,
        armoredAreas: [],
        baseItemId: undefined,
        blocksHeadphones: false,
        categoryId: 'headwear',
        conflictingItemIds: [],
        deafening: 'None',
        defaultPresetId: undefined,
        durability: 0,
        ergonomicsPercentageModifier: 0,
        iconLink: 'https://assets.tarkov.dev/5bd073c986f7747f627e796c-icon.jpg',
        id: '5bd073c986f7747f627e796c',
        imageLink: 'https://assets.tarkov.dev/5bd073c986f7747f627e796c-image.jpg',
        marketLink: 'https://tarkov.dev/item/kotton-beanie',
        material: '',
        maxStackableAmount: 1,
        modSlots: [],
        movementSpeedPercentageModifier: 0,
        name: 'Kotton beanie',
        presetWearableModifiers: undefined,
        prices: [],
        ricochetChance: '',
        shortName: 'Kotton',
        turningSpeedPercentageModifier: 0,
        weight: 0.2,
        wikiLink: 'https://escapefromtarkov.fandom.com/wiki/Kotton_beanie'
      } as IHeadwear
    ]
  ])('should parse a reduced headwear', (reducedHeadwear: Record<string, unknown>, expected: IHeadwear) => {
    // Arrange
    const service = new ReductionService()

    // Act
    const headwearResult = service.parseReducedItem(reducedHeadwear)

    // Assert
    expect(headwearResult.success).toBe(true)
    expect(headwearResult.value).toStrictEqual(expected)
  })
})