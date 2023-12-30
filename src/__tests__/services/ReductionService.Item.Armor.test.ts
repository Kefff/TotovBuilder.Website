import { describe, expect, it } from 'vitest'
import { ReductionService } from '../../services/ReductionService'
import { IArmor } from '../../models/item/IArmor'

describe('parseReducedItem', () => {
  it.each([
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
        conflictingItemIds: [],
        durability: 0,
        ergonomicsPercentageModifier: 0,
        material: '',
        categoryId: 'headwear',
        iconLink: 'https://assets.tarkov.dev/5bd073c986f7747f627e796c-icon.jpg',
        id: '5bd073c986f7747f627e796c',
        imageLink: 'https://assets.tarkov.dev/5bd073c986f7747f627e796c-image.jpg',
        marketLink: 'https://tarkov.dev/item/kotton-beanie',
        maxStackableAmount: 1,
        movementSpeedPercentageModifier: 0,
        name: 'Kotton beanie',
        prices: [],
        ricochetChance: '',
        shortName: 'Kotton',
        turningSpeedPercentageModifier: 0,
        weight: 0.2,
        wikiLink: 'https://escapefromtarkov.fandom.com/wiki/Kotton_beanie'
      } as IArmor
    ],
    [
      {
        'ac': 6,
        'aa': [
          'LeftArm',
          'RightArm',
          'Thorax',
          'Stomach'
        ],
        'd': 85,
        'e': -0.27,
        'ma': 'CombinedMaterials',
        'ms': -0.35,
        'r': 'High',
        't': -0.21,
        'c': 'armor',
        'ic': 'https://assets.tarkov.dev/545cdb794bdc2d3a198b456a-icon.jpg',
        'i': '545cdb794bdc2d3a198b456a',
        'im': 'https://assets.tarkov.dev/545cdb794bdc2d3a198b456a-image.jpg',
        'm': 'https://tarkov.dev/item/6b43-6a-zabralo-sh-body-armor',
        'n': '6B43 6A Zabralo-Sh body armor',
        's': '6B43 6A',
        'w': 20,
        'wi': 'https://escapefromtarkov.fandom.com/wiki/6B43_6A_Zabralo-Sh_body_armor'
      },
      {
        armorClass: 6,
        armoredAreas: [
          'LeftArm',
          'RightArm',
          'Thorax',
          'Stomach'
        ],
        categoryId: 'armor',
        conflictingItemIds: [],
        durability: 85,
        ergonomicsPercentageModifier: -0.27,
        iconLink: 'https://assets.tarkov.dev/545cdb794bdc2d3a198b456a-icon.jpg',
        id: '545cdb794bdc2d3a198b456a',
        imageLink: 'https://assets.tarkov.dev/545cdb794bdc2d3a198b456a-image.jpg',
        marketLink: 'https://tarkov.dev/item/6b43-6a-zabralo-sh-body-armor',
        material: 'CombinedMaterials',
        maxStackableAmount: 1,
        movementSpeedPercentageModifier: -0.35,
        name: '6B43 6A Zabralo-Sh body armor',
        prices: [],
        ricochetChance: 'High',
        shortName: '6B43 6A',
        turningSpeedPercentageModifier: -0.21,
        weight: 20,
        wikiLink: 'https://escapefromtarkov.fandom.com/wiki/6B43_6A_Zabralo-Sh_body_armor'
      } as IArmor
    ]
  ])('should parse a reduced armor', (reducedArmor: Record<string, unknown>, expected: IArmor) => {
    // Arrange
    const service = new ReductionService()

    // Act
    const armorResult = service.parseReducedItem(reducedArmor)

    // Assert
    expect(armorResult.success).toBe(true)
    expect(armorResult.value).toStrictEqual(expected)
  })
})