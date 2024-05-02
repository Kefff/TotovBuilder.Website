import { describe, expect, it } from 'vitest'
import { IBackpack } from '../../models/item/IBackpack'
import { ItemPropertiesService } from '../../services/ItemPropertiesService'
import { ReductionService } from '../../services/ReductionService'
import Services from '../../services/repository/Services'

describe('parseReducedItem', () => {
  it.each([
    [
      {
        'ca': 35,
        'e': -0.07,
        'ms': -0.05,
        't': -0.03,
        'c': 'backpack',
        'ic': 'https://assets.tarkov.dev/5ab8ebf186f7742d8b372e80-icon.webp',
        'i': '5ab8ebf186f7742d8b372e80',
        'im': 'https://assets.tarkov.dev/5ab8ebf186f7742d8b372e80-image.webp',
        'm': 'https://tarkov.dev/item/sso-attack-2-raid-backpack',
        'n': 'SSO Attack 2 raid backpack',
        's': 'Attack 2',
        'w': 2.8,
        'wi': 'https://escapefromtarkov.fandom.com/wiki/SSO_Attack_2_raid_backpack'
      },
      {
        capacity: 35,
        categoryId: 'backpack',
        conflictingItemIds: [],
        ergonomicsModifierPercentage: -0.07,
        iconLink: 'https://assets.tarkov.dev/5ab8ebf186f7742d8b372e80-icon.webp',
        id: '5ab8ebf186f7742d8b372e80',
        imageLink: 'https://assets.tarkov.dev/5ab8ebf186f7742d8b372e80-image.webp',
        marketLink: 'https://tarkov.dev/item/sso-attack-2-raid-backpack',
        maxStackableAmount: 1,
        movementSpeedModifierPercentage: -0.05,
        name: 'SSO Attack 2 raid backpack',
        presetWearableModifiers: undefined,
        prices: [],
        shortName: 'Attack 2',
        turningSpeedModifierPercentage: -0.03,
        weight: 2.8,
        wikiLink: 'https://escapefromtarkov.fandom.com/wiki/SSO_Attack_2_raid_backpack'
      } as IBackpack
    ],
    [
      {
        'c': 'backpack',
        'ic': 'https://assets.tarkov.dev/5ab8f04f86f774585f4237d8-icon.webp',
        'i': '5ab8f04f86f774585f4237d8',
        'im': 'https://assets.tarkov.dev/5ab8f04f86f774585f4237d8-image.webp',
        'm': 'https://tarkov.dev/item/tactical-sling-bag',
        'n': 'Tactical sling bag',
        's': 'Sling',
        'w': 0.48,
        'wi': 'https://escapefromtarkov.fandom.com/wiki/Tactical_sling_bag'
      },
      {
        capacity: 0,
        categoryId: 'backpack',
        conflictingItemIds: [],
        ergonomicsModifierPercentage: 0,
        iconLink: 'https://assets.tarkov.dev/5ab8f04f86f774585f4237d8-icon.webp',
        id: '5ab8f04f86f774585f4237d8',
        imageLink: 'https://assets.tarkov.dev/5ab8f04f86f774585f4237d8-image.webp',
        marketLink: 'https://tarkov.dev/item/tactical-sling-bag',
        maxStackableAmount: 1,
        movementSpeedModifierPercentage: 0,
        presetWearableModifiers: undefined,
        name: 'Tactical sling bag',
        prices: [],
        shortName: 'Sling',
        turningSpeedModifierPercentage: 0,
        weight: 0.48,
        wikiLink: 'https://escapefromtarkov.fandom.com/wiki/Tactical_sling_bag'
      } as IBackpack
    ]
  ])('should parse a reduced backpack', (reducedBackpack: Record<string, unknown>, expected: IBackpack) => {
    // Arrange
    Services.configure(ItemPropertiesService)

    const service = new ReductionService()

    // Act
    const backpack = service.parseReducedItem(reducedBackpack)

    // Assert
    expect(backpack).toStrictEqual(expected)
  })
})