import { describe, expect, it } from 'vitest'
import { ItemCategoryId } from '../../models/item/IItem'
import { IMeleeWeapon } from '../../models/item/IMeleeWeapon'
import { ItemPropertiesService } from '../../services/ItemPropertiesService'
import { ReductionService } from '../../services/ReductionService'
import Services from '../../services/repository/Services'

describe('parseReducedItem', () => {
  it.each([
    [
      {
        'ch': 30,
        'r': 0.5,
        'st': 50,
        'c': 'meleeWeapon',
        'ic': 'https://assets.tarkov.dev/601948682627df266209af05-icon.webp',
        'i': '601948682627df266209af05',
        'im': 'https://assets.tarkov.dev/601948682627df266209af05-image.webp',
        'm': 'https://tarkov.dev/item/uvsr-taiga-1-survival-machete',
        'n': 'UVSR Taiga-1 survival machete',
        's': 'Taiga-1',
        'w': 0.64,
        'wi': 'https://escapefromtarkov.fandom.com/wiki/UVSR_Taiga-1_survival_machete'
      },
      {
        chopDamage: 30,
        hitRadius: 0.5,
        stabDamage: 50,
        categoryId: ItemCategoryId.meleeWeapon,
        conflictingItemIds: [],
        iconLink: 'https://assets.tarkov.dev/601948682627df266209af05-icon.webp',
        id: '601948682627df266209af05',
        imageLink: 'https://assets.tarkov.dev/601948682627df266209af05-image.webp',
        maxStackableAmount: 1,
        marketLink: 'https://tarkov.dev/item/uvsr-taiga-1-survival-machete',
        name: 'UVSR Taiga-1 survival machete',
        prices: [],
        shortName: 'Taiga-1',
        weight: 0.64,
        wikiLink: 'https://escapefromtarkov.fandom.com/wiki/UVSR_Taiga-1_survival_machete'
      } as IMeleeWeapon
    ]
  ])('should parse a reduced melee weapon', (reducedMeleeWeapon: Record<string, unknown>, expected: IMeleeWeapon) => {
    // Arrange
    Services.configure(ItemPropertiesService)

    const service = new ReductionService()

    // Act
    const meleeWeapon = service.parseReducedItem(reducedMeleeWeapon)

    // Assert
    expect(meleeWeapon).toStrictEqual(expected)
  })
})