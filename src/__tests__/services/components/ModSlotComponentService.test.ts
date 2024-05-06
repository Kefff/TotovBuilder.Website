import { describe, expect, it } from 'vitest'
import { IItem } from '../../../models/item/IItem'
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
      'headphones'
    ]
  ])('should get the accepted items category ID', (items: IItem[], expected: string | undefined) => {
    // Arrange
    const modSlotService = new ModSlotComponentService()

    // Act
    const categoryIds = modSlotService.getAcceptedItemsCategoryId(items)

    // Assert
    expect(categoryIds).toBe(expected)
  })
})

const scorpius = {
  categoryId: 'rangedWeaponMod',
  id: '5f6341043ada5942720e2dc5'
} as IItem