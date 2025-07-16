import { describe, expect, it } from 'vitest'
import { IGrenade } from '../../models/item/IGrenade'
import { ItemCategoryId } from '../../models/item/IItem'
import { ItemPropertiesService } from '../../services/ItemPropertiesService'
import { ReductionService } from '../../services/ReductionService'
import Services from '../../services/repository/Services'

describe('parseReducedItem', () => {
  it.each([
    [
      {
        'b': 1,
        'c': 'grenade',
        'd': 3,
        'f': 100,
        'i': '5e32f56fcb6d5863cc5e5ee4',
        'ic': 'https://assets.tarkov.dev/5e32f56fcb6d5863cc5e5ee4-icon.jpg',
        'im': 'https://assets.tarkov.dev/5e32f56fcb6d5863cc5e5ee4-image.jpg',
        'ip': 1,
        'm': 'https://tarkov.dev/item/vog-17-khattabka-improvised-hand-grenade',
        'ma': 6,
        'mi': 2,
        'n': 'VOG-17 Khattabka improvised hand grenade',
        's': 'VOG-17',
        'w': 0.28,
        'wi': 'https://escapefromtarkov.fandom.com/wiki/VOG-17_Khattabka_improvised_hand_grenade'
      },
      {
        blinding: true,
        categoryId: ItemCategoryId.grenade,
        conflictingItemIds: [],
        explosionDelay: 3,
        fragmentsAmount: 100,
        iconLink: 'https://assets.tarkov.dev/5e32f56fcb6d5863cc5e5ee4-icon.jpg',
        id: '5e32f56fcb6d5863cc5e5ee4',
        imageLink: 'https://assets.tarkov.dev/5e32f56fcb6d5863cc5e5ee4-image.jpg',
        impact: true,
        marketLink: 'https://tarkov.dev/item/vog-17-khattabka-improvised-hand-grenade',
        maximumExplosionRange: 6,
        maxStackableAmount: 1,
        minimumExplosionRange: 2,
        name: 'VOG-17 Khattabka improvised hand grenade',
        presetWeight: undefined,
        prices: [],
        shortName: 'VOG-17',
        smoke: false,
        weight: 0.28,
        wikiLink: 'https://escapefromtarkov.fandom.com/wiki/VOG-17_Khattabka_improvised_hand_grenade'
      } as IGrenade
    ],
    [
      {
        'c': 'grenade',
        'd': 3.5,
        'i': '5a2a57cfc4a2826c6e06d44a',
        'ic': 'https://assets.tarkov.dev/5a2a57cfc4a2826c6e06d44a-icon.webp',
        'im': 'https://assets.tarkov.dev/5a2a57cfc4a2826c6e06d44a-image.webp',
        'm': 'https://tarkov.dev/item/rdg-2b-smoke-grenade',
        'n': 'RDG-2B smoke grenade',
        's': 'RDG-2B',
        'sm': 1,
        'w': 0.6,
        'wi': 'https://escapefromtarkov.fandom.com/wiki/RDG-2B_smoke_grenade'
      },
      {
        blinding: false,
        categoryId: ItemCategoryId.grenade,
        conflictingItemIds: [],
        explosionDelay: 3.5,
        fragmentsAmount: 0,
        iconLink: 'https://assets.tarkov.dev/5a2a57cfc4a2826c6e06d44a-icon.webp',
        id: '5a2a57cfc4a2826c6e06d44a',
        imageLink: 'https://assets.tarkov.dev/5a2a57cfc4a2826c6e06d44a-image.webp',
        impact: false,
        marketLink: 'https://tarkov.dev/item/rdg-2b-smoke-grenade',
        maximumExplosionRange: 0,
        maxStackableAmount: 1,
        minimumExplosionRange: 0,
        name: 'RDG-2B smoke grenade',
        presetWeight: undefined,
        prices: [],
        shortName: 'RDG-2B',
        smoke: true,
        weight: 0.6,
        wikiLink: 'https://escapefromtarkov.fandom.com/wiki/RDG-2B_smoke_grenade'
      } as IGrenade
    ]
  ])('should parse a reduced grenade', (reducedGrenade: Record<string, unknown>, expected: IGrenade) => {
    // Arrange
    Services.configure(ItemPropertiesService)

    const service = new ReductionService()

    // Act
    const grenade = service.parseReducedItem(reducedGrenade)

    // Assert
    expect(grenade).toStrictEqual(expected)
  })
})