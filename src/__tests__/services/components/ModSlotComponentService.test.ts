import { describe, expect, it } from 'vitest'
import { IItem, ItemCategoryId } from '../../../models/item/IItem'
import { ModSlotComponentService } from '../../../services/components/ModSlotComponentService'
import { razor } from '../../__data__/itemMocks'

describe('getAcceptedItemsCategoryId()', () => {
  it.each([
    [
      [
        scorpius,
        razor
      ],
      undefined
    ],
    [
      [
        razor
      ],
      ItemCategoryId.headphones
    ]
  ])('should get the accepted items category ID', (items: IItem[], expected: ItemCategoryId | undefined) => {
    // Arrange
    const modSlotService = new ModSlotComponentService()

    // Act
    const categoryIds = modSlotService.getAcceptedItemsCategoryId(items)

    // Assert
    expect(categoryIds).toBe(expected)
  })
})

const scorpius = {
  categoryId: ItemCategoryId.rangedWeaponMod,
  id: '5f6341043ada5942720e2dc5'
} as IItem