import { describe, expect, it } from 'vitest'
import { IAmmunition } from '../../models/item/IAmmunition'
import { ItemPropertiesService } from '../../services/ItemPropertiesService'
import { ReductionService } from '../../services/ReductionService'
import Services from '../../services/repository/Services'
import { ammo545us, ammo9mmGT } from '../__data__/itemMocks'

describe('parseReducedItem', () => {
  it.each([
    [
      {
        'b': 1,
        'ca': 'unknown',
        'p': 2,
        'v': 365,
        'c': 'ammunition',
        'ic': 'https://assets.tarkov.dev/unknown-icon.webp',
        'i': 'unknown',
        'im': 'https://assets.tarkov.dev/unknown-image.webp',
        'a': 60,
        'm': 'https://tarkov.dev/item/unknown',
        'n': 'Unknown',
        's': 'U',
        'w': 0.01,
        'wi': 'https://escapefromtarkov.fandom.com/wiki/unknown'
      },
      {
        accuracyModifierPercentage: 0,
        armorDamagePercentage: 0,
        armorPenetrations: [0, 0, 0, 0, 0, 0],
        blinding: true,
        caliber: 'unknown',
        categoryId: 'ammunition',
        conflictingItemIds: [],
        durabilityBurnModifierPercentage: 0,
        fleshDamage: 0,
        fragmentationChance: 0,
        heavyBleedingChance: 0,
        iconLink: 'https://assets.tarkov.dev/unknown-icon.webp',
        id: 'unknown',
        imageLink: 'https://assets.tarkov.dev/unknown-image.webp',
        lightBleedingChance: 0,
        marketLink: 'https://tarkov.dev/item/unknown',
        maxStackableAmount: 60,
        name: 'Unknown',
        penetrationPower: 0,
        prices: [],
        projectiles: 2,
        recoilModifierPercentage: 0,
        shortName: 'U',
        subsonic: false,
        tracer: false,
        velocity: 365,
        weight: 0.01,
        wikiLink: 'https://escapefromtarkov.fandom.com/wiki/unknown'
      } as IAmmunition
    ],
    [
      {
        'ad': 0.33,
        'ap': [
          6,
          5,
          1,
          0,
          0,
          0
        ],
        'ca': 'Caliber545x39',
        'd': -0.2,
        'f': 63,
        'fr': 0.1,
        'pp': 17,
        'r': -0.15,
        'su': 1,
        'v': 303,
        'c': 'ammunition',
        'ic': 'https://assets.tarkov.dev/56dff4ecd2720b5f5a8b4568-icon.webp',
        'i': '56dff4ecd2720b5f5a8b4568',
        'im': 'https://assets.tarkov.dev/56dff4ecd2720b5f5a8b4568-image.webp',
        'a': 60,
        'm': 'https://tarkov.dev/item/545x39mm-us-gs',
        'n': '5.45x39mm US gs',
        's': 'US',
        'w': 0.01,
        'wi': 'https://escapefromtarkov.fandom.com/wiki/5.45x39mm_US_gs'
      },
      ammo545us
    ],
    [
      {
        'ac': -0.05,
        'ad': 0.33,
        'ap': [
          6,
          3,
          1,
          0,
          0,
          0
        ],
        'ca': 'Caliber9x19PARA',
        'd': 0.15,
        'f': 58,
        'fr': 0.15,
        'pp': 14,
        'r': -0.06,
        't': 1,
        'v': 365,
        'c': 'ammunition',
        'ic': 'https://assets.tarkov.dev/5c3df7d588a4501f290594e5-icon.webp',
        'i': '5c3df7d588a4501f290594e5',
        'im': 'https://assets.tarkov.dev/5c3df7d588a4501f290594e5-image.webp',
        'a': 50,
        'm': 'https://tarkov.dev/item/9x19mm-green-tracer',
        'n': '9x19mm Green Tracer',
        's': 'GT',
        'w': 0.006,
        'wi': 'https://escapefromtarkov.fandom.com/wiki/9x19mm_Green_Tracer'
      },
      ammo9mmGT
    ]
  ])('should parse a reduced ammunition', (reducedAmmunition: Record<string, unknown>, expected: IAmmunition) => {
    // Arrange
    Services.configure(ItemPropertiesService)

    const service = new ReductionService()

    // Act
    const ammunition = service.parseReducedItem(reducedAmmunition)

    // Assert
    expect(ammunition).toStrictEqual(expected)
  })
})