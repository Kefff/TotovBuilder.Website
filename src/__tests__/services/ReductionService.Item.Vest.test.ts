import { describe, expect, it } from 'vitest'
import { ReductionService } from '../../services/ReductionService'
import { IVest } from '../../models/item/IVest'

describe('parseReducedItem', () => {
  it.each([
    [
      {
        'ac': 4,
        'aa': [
          'Thorax',
          'Stomach'
        ],
        'd': 40,
        'e': -0.15,
        'ma': 'Titan',
        'ms': -0.1,
        't': -0.05,
        'ca': 12,
        'c': 'vest',
        'ic': 'https://assets.tarkov.dev/5d5d646386f7742797261fd9-icon.jpg',
        'i': '5d5d646386f7742797261fd9',
        'im': 'https://assets.tarkov.dev/5d5d646386f7742797261fd9-image.jpg',
        'm': 'https://tarkov.dev/item/6b3tm-01m-armored-rig',
        'n': '6B3TM-01M armored rig',
        's': '6B3TM-01M',
        'w': 9.2,
        'wi': 'https://escapefromtarkov.fandom.com/wiki/6B3TM-01M_armored_rig'
      },
      {
        armorClass: 4,
        armoredAreas: [
          'Thorax',
          'Stomach'
        ],
        capacity: 12,
        categoryId: 'vest',
        conflictingItemIds: [],
        durability: 40,
        ergonomicsPercentageModifier: -0.15,
        iconLink: 'https://assets.tarkov.dev/5d5d646386f7742797261fd9-icon.jpg',
        id: '5d5d646386f7742797261fd9',
        imageLink: 'https://assets.tarkov.dev/5d5d646386f7742797261fd9-image.jpg',
        marketLink: 'https://tarkov.dev/item/6b3tm-01m-armored-rig',
        material: 'Titan',
        maxStackableAmount: 1,
        movementSpeedPercentageModifier: -0.10,
        name: '6B3TM-01M armored rig',
        prices: [],
        ricochetChance: '',
        shortName: '6B3TM-01M',
        turningSpeedPercentageModifier: -0.05,
        weight: 9.2,
        wikiLink: 'https://escapefromtarkov.fandom.com/wiki/6B3TM-01M_armored_rig'
      } as IVest
    ],
    [
      {
        'ca': 6,
        'c': 'vest',
        'ic': 'https://assets.tarkov.dev/572b7adb24597762ae139821-icon.jpg',
        'i': '572b7adb24597762ae139821',
        'im': 'https://assets.tarkov.dev/572b7adb24597762ae139821-image.jpg',
        'm': 'https://tarkov.dev/item/scav-vest',
        'n': 'Scav Vest',
        's': 'Scav Vest',
        'w': 0.4,
        'wi': 'https://escapefromtarkov.fandom.com/wiki/Scav_Vest'
      },
      {
        armorClass: 0,
        armoredAreas: [],
        capacity: 6,
        categoryId: 'vest',
        conflictingItemIds: [],
        durability: 0,
        ergonomicsPercentageModifier: 0,
        iconLink: 'https://assets.tarkov.dev/572b7adb24597762ae139821-icon.jpg',
        id: '572b7adb24597762ae139821',
        imageLink: 'https://assets.tarkov.dev/572b7adb24597762ae139821-image.jpg',
        marketLink: 'https://tarkov.dev/item/scav-vest',
        material: '',
        maxStackableAmount: 1,
        movementSpeedPercentageModifier: 0,
        name: 'Scav Vest',
        prices: [],
        ricochetChance: '',
        shortName: 'Scav Vest',
        turningSpeedPercentageModifier: 0,
        weight: 0.4,
        wikiLink: 'https://escapefromtarkov.fandom.com/wiki/Scav_Vest'
      } as IVest
    ]
  ])('should parse a reduced vest', (reducedVest: Record<string, unknown>, expected: IVest) => {
    // Arrange
    const service = new ReductionService()

    // Act
    const vestResult = service.parseReducedItem(reducedVest)

    // Assert
    expect(vestResult.success).toBe(true)
    expect(vestResult.value).toStrictEqual(expected)
  })
})