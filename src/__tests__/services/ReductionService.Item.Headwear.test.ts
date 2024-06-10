import { describe, expect, it } from 'vitest'
import { IHeadwear } from '../../models/item/IHeadwear'
import { ItemPropertiesService } from '../../services/ItemPropertiesService'
import { ReductionService } from '../../services/ReductionService'
import Services from '../../services/repository/Services'
import { lshZ2dtm } from '../__data__/itemMocks'

describe('parseReducedItem', () => {
  it.each([
    [
      {
        'ac': 4,
        'aa': [
          'HeadTopOfTheHead',
          'HeadNape',
          'HeadEars'
        ],
        'h': 1,
        'de': 'High',
        'e': -0.03,
        'ma': 'Combined',
        'mo': [
          {
            'i': [
              '5d6d3829a4b9361bc8618943'
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
            'n': 'mod_mount'
          },
          {
            'i': [
              '5d6d3be5a4b9361bc73bc763'
            ],
            'n': 'mod_equipment_001'
          },
          {
            'i': [
              '5d6d3943a4b9360dbc46d0cc'
            ],
            'n': 'mod_equipment_002'
          }
        ],
        'r': 'High',
        't': -0.03,
        'c': 'headwear',
        'ic': 'https://assets.tarkov.dev/5d6d3716a4b9361bc8618872-icon.webp',
        'i': '5d6d3716a4b9361bc8618872',
        'im': 'https://assets.tarkov.dev/5d6d3716a4b9361bc8618872-image.webp',
        'm': 'https://tarkov.dev/item/bnti-lshz-2dtm-helmet-black',
        'n': 'BNTI LShZ-2DTM helmet (Black)',
        's': 'LShZ-2DTM',
        'w': 3.4,
        'wi': 'https://escapefromtarkov.fandom.com/wiki/BNTI_LShZ-2DTM_helmet_(Black)'
      },
      lshZ2dtm
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
        ergonomicsModifierPercentage: 0,
        iconLink: 'https://assets.tarkov.dev/5bd073c986f7747f627e796c-icon.jpg',
        id: '5bd073c986f7747f627e796c',
        imageLink: 'https://assets.tarkov.dev/5bd073c986f7747f627e796c-image.jpg',
        marketLink: 'https://tarkov.dev/item/kotton-beanie',
        material: '',
        maxStackableAmount: 1,
        modSlots: [],
        movementSpeedModifierPercentage: 0,
        name: 'Kotton beanie',
        presetArmorModifiers: undefined,
        presetWearableModifiers: undefined,
        prices: [],
        ricochetChance: '',
        shortName: 'Kotton',
        turningSpeedModifierPercentage: 0,
        weight: 0.2,
        wikiLink: 'https://escapefromtarkov.fandom.com/wiki/Kotton_beanie'
      } as IHeadwear
    ]
  ])('should parse a reduced headwear', (reducedHeadwear: Record<string, unknown>, expected: IHeadwear) => {
    // Arrange
    Services.configure(ItemPropertiesService)

    const service = new ReductionService()

    // Act
    const headwear = service.parseReducedItem(reducedHeadwear)

    // Assert
    expect(headwear).toStrictEqual(expected)
  })
})