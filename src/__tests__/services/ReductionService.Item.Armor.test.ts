import { describe, expect, it } from 'vitest'
import { ReductionService } from '../../services/ReductionService'
import { IArmor } from '../../models/item/IArmor'
import { ItemPropertiesService } from '../../services/ItemPropertiesService'
import Services from '../../services/repository/Services'

describe('parseReducedItem', () => {
  it.each([
    [
      {
        'c': 'armor',
        'ic': 'https://assets.tarkov.dev/unknown-icon.jpg',
        'i': 'unknown',
        'im': 'https://assets.tarkov.dev/unknown-image.jpg',
        'm': 'https://tarkov.dev/item/unknown',
        'n': 'Unknown',
        's': 'Unknown',
        'w': 0.2,
        'wi': 'https://escapefromtarkov.fandom.com/wiki/Unknown'
      },
      {
        armorClass: 0,
        armoredAreas: [],
        conflictingItemIds: [],
        durability: 0,
        ergonomicsPercentageModifier: 0,
        material: '',
        categoryId: 'armor',
        iconLink: 'https://assets.tarkov.dev/unknown-icon.jpg',
        id: 'unknown',
        imageLink: 'https://assets.tarkov.dev/unknown-image.jpg',
        marketLink: 'https://tarkov.dev/item/unknown',
        maxStackableAmount: 1,
        movementSpeedPercentageModifier: 0,
        name: 'Unknown',
        presetWearableModifiers: undefined,
        prices: [],
        ricochetChance: '',
        shortName: 'Unknown',
        turningSpeedPercentageModifier: 0,
        weight: 0.2,
        wikiLink: 'https://escapefromtarkov.fandom.com/wiki/Unknown'
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
        presetWearableModifiers: undefined,
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
    Services.configure(ItemPropertiesService)

    const service = new ReductionService()

    // Act
    const armor = service.parseReducedItem(reducedArmor)

    // Assert
    expect(armor).toStrictEqual(expected)
  })
})