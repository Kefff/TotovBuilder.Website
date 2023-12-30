import { describe, expect, it } from 'vitest'
import { ReductionService } from '../../services/ReductionService'
import { IGrenade } from '../../models/item/IGrenade'

describe('parseReducedItem', () => {
  it.each([
    [
      {
        'd': 3,
        'f': 100,
        'ma': 6,
        'mi': 2,
        't': 'Grenade',
        'c': 'grenade',
        'ic': 'https://assets.tarkov.dev/5e32f56fcb6d5863cc5e5ee4-icon.jpg',
        'i': '5e32f56fcb6d5863cc5e5ee4',
        'im': 'https://assets.tarkov.dev/5e32f56fcb6d5863cc5e5ee4-image.jpg',
        'm': 'https://tarkov.dev/item/vog-17-khattabka-improvised-hand-grenade',
        'n': 'VOG-17 Khattabka improvised hand grenade',
        's': 'VOG-17',
        'w': 0.28,
        'wi': 'https://escapefromtarkov.fandom.com/wiki/VOG-17_Khattabka_improvised_hand_grenade'
      },
      {
        categoryId: 'grenade',
        conflictingItemIds: [],
        explosionDelay: 3,
        fragmentsAmount: 100,
        maximumExplosionRange: 6,
        minimumExplosionRange: 2,
        iconLink: 'https://assets.tarkov.dev/5e32f56fcb6d5863cc5e5ee4-icon.jpg',
        id: '5e32f56fcb6d5863cc5e5ee4',
        imageLink: 'https://assets.tarkov.dev/5e32f56fcb6d5863cc5e5ee4-image.jpg',
        marketLink: 'https://tarkov.dev/item/vog-17-khattabka-improvised-hand-grenade',
        maxStackableAmount: 1,
        name: 'VOG-17 Khattabka improvised hand grenade',
        prices: [],
        shortName: 'VOG-17',
        type: 'Grenade',
        weight: 0.28,
        wikiLink: 'https://escapefromtarkov.fandom.com/wiki/VOG-17_Khattabka_improvised_hand_grenade'
      } as IGrenade
    ],
    [
      {
        'd': 3.5,
        't': 'Smoke',
        'c': 'grenade',
        'ic': 'https://assets.tarkov.dev/5a2a57cfc4a2826c6e06d44a-icon.webp',
        'i': '5a2a57cfc4a2826c6e06d44a',
        'im': 'https://assets.tarkov.dev/5a2a57cfc4a2826c6e06d44a-image.webp',
        'm': 'https://tarkov.dev/item/rdg-2b-smoke-grenade',
        'n': 'RDG-2B smoke grenade',
        's': 'RDG-2B',
        'w': 0.6,
        'wi': 'https://escapefromtarkov.fandom.com/wiki/RDG-2B_smoke_grenade'
      },
      {
        categoryId: 'grenade',
        conflictingItemIds: [],
        explosionDelay: 3.5,
        fragmentsAmount: 0,
        iconLink: 'https://assets.tarkov.dev/5a2a57cfc4a2826c6e06d44a-icon.webp',
        id: '5a2a57cfc4a2826c6e06d44a',
        imageLink: 'https://assets.tarkov.dev/5a2a57cfc4a2826c6e06d44a-image.webp',
        marketLink: 'https://tarkov.dev/item/rdg-2b-smoke-grenade',
        maximumExplosionRange: 0,
        maxStackableAmount: 1,
        minimumExplosionRange: 0,
        name: 'RDG-2B smoke grenade',
        prices: [],
        shortName: 'RDG-2B',
        type: 'Smoke',
        weight: 0.6,
        wikiLink: 'https://escapefromtarkov.fandom.com/wiki/RDG-2B_smoke_grenade'
      } as IGrenade
    ]
  ])('should parse a reduced grenade', (reducedGrenade: Record<string, unknown>, expected: IGrenade) => {
    // Arrange
    const service = new ReductionService()

    // Act
    const grenadeResult = service.parseReducedItem(reducedGrenade)

    // Assert
    expect(grenadeResult.success).toBe(true)
    expect(grenadeResult.value).toStrictEqual(expected)
  })
})