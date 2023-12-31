import { describe, expect, it } from 'vitest'
import { ReductionService } from '../../services/ReductionService'
import { IAmmunition } from '../../models/item/IAmmunition'
import Services from '../../services/repository/Services'
import { ItemPropertiesService } from '../../services/ItemPropertiesService'

describe('parseReducedItem', () => {
  it.each([
    [
      {
        'b': 1,
        'ca': 'unknown',
        'p': 2,
        'v': 365,
        'c': 'ammunition',
        'ic': 'https://assets.tarkov.dev/unknown-icon.jpg',
        'i': 'unknown',
        'im': 'https://assets.tarkov.dev/unknown-image.jpg',
        'a': 60,
        'm': 'https://tarkov.dev/item/unknown',
        'n': 'Unknown',
        's': 'U',
        'w': 0.01,
        'wi': 'https://escapefromtarkov.fandom.com/wiki/unknown'
      },
      {
        accuracyPercentageModifier: 0,
        armorDamagePercentage: 0,
        armorPenetrations: [0, 0, 0, 0, 0, 0],
        blinding: true,
        caliber: 'unknown',
        categoryId: 'ammunition',
        conflictingItemIds: [],
        durabilityBurnPercentageModifier: 0,
        fleshDamage: 0,
        fragmentationChancePercentage: 0,
        heavyBleedingPercentageChance: 0,
        iconLink: 'https://assets.tarkov.dev/unknown-icon.jpg',
        id: 'unknown',
        imageLink: 'https://assets.tarkov.dev/unknown-image.jpg',
        lightBleedingPercentageChance: 0,
        marketLink: 'https://tarkov.dev/item/unknown',
        maxStackableAmount: 60,
        name: 'Unknown',
        penetrationPower: 0,
        prices: [],
        projectiles: 2,
        recoilPercentageModifier: 0,
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
        'ad': 0.34,
        'ap': [
          6,
          3,
          0,
          0,
          0,
          0
        ],
        'ca': 'Caliber545x39',
        'd': -0.2,
        'f': 65,
        'fr': 0.1,
        'pp': 15,
        'r': -0.25,
        'su': 1,
        'v': 303,
        'c': 'ammunition',
        'ic': 'https://assets.tarkov.dev/56dff4ecd2720b5f5a8b4568-icon.jpg',
        'i': '56dff4ecd2720b5f5a8b4568',
        'im': 'https://assets.tarkov.dev/56dff4ecd2720b5f5a8b4568-image.jpg',
        'a': 60,
        'm': 'https://tarkov.dev/item/545x39mm-us-gs',
        'n': '5.45x39mm US gs',
        's': 'US',
        'w': 0.01,
        'wi': 'https://escapefromtarkov.fandom.com/wiki/5.45x39mm_US_gs'
      },
      {
        accuracyPercentageModifier: 0,
        armorDamagePercentage: 0.34,
        armorPenetrations: [6, 3, 0, 0, 0, 0],
        blinding: false,
        caliber: 'Caliber545x39',
        categoryId: 'ammunition',
        conflictingItemIds: [],
        durabilityBurnPercentageModifier: -0.2,
        fleshDamage: 65,
        fragmentationChancePercentage: 0.1,
        heavyBleedingPercentageChance: 0,
        iconLink: 'https://assets.tarkov.dev/56dff4ecd2720b5f5a8b4568-icon.jpg',
        id: '56dff4ecd2720b5f5a8b4568',
        imageLink: 'https://assets.tarkov.dev/56dff4ecd2720b5f5a8b4568-image.jpg',
        lightBleedingPercentageChance: 0,
        marketLink: 'https://tarkov.dev/item/545x39mm-us-gs',
        maxStackableAmount: 60,
        name: '5.45x39mm US gs',
        penetrationPower: 15,
        prices: [],
        projectiles: 1,
        recoilPercentageModifier: -0.25,
        shortName: 'US',
        subsonic: true,
        tracer: false,
        velocity: 303,
        weight: 0.01,
        wikiLink: 'https://escapefromtarkov.fandom.com/wiki/5.45x39mm_US_gs'
      } as IAmmunition
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
      {
        accuracyPercentageModifier: -0.05,
        armorDamagePercentage: 0.33,
        armorPenetrations: [6, 3, 1, 0, 0, 0],
        blinding: false,
        caliber: 'Caliber9x19PARA',
        categoryId: 'ammunition',
        conflictingItemIds: [],
        durabilityBurnPercentageModifier: 0.15,
        fleshDamage: 58,
        fragmentationChancePercentage: 0.15,
        heavyBleedingPercentageChance: 0,
        iconLink: 'https://assets.tarkov.dev/5c3df7d588a4501f290594e5-icon.webp',
        id: '5c3df7d588a4501f290594e5',
        imageLink: 'https://assets.tarkov.dev/5c3df7d588a4501f290594e5-image.webp',
        lightBleedingPercentageChance: 0,
        marketLink: 'https://tarkov.dev/item/9x19mm-green-tracer',
        maxStackableAmount: 50,
        name: '9x19mm Green Tracer',
        penetrationPower: 14,
        prices: [],
        projectiles: 1,
        recoilPercentageModifier: -0.06,
        shortName: 'GT',
        subsonic: false,
        tracer: true,
        velocity: 365,
        weight: 0.006,
        wikiLink: 'https://escapefromtarkov.fandom.com/wiki/9x19mm_Green_Tracer'
      } as IAmmunition
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