import { describe, expect, it } from 'vitest'
import { IVest } from '../../../../models/item/IVest'
import { SortingService } from '../../../../services/sorting/SortingService'
import { VestSortingFunctions } from '../../../../services/sorting/functions/VestSortingFunctions'

describe('comparisonFunction()', () => {
  it.each([
    ['armorClass'],
    ['capacity'],
    ['durability'],
    ['ergonomicsModifierPercentage']
  ])('should compare by a property', async (property: string) => {
    // Arrange
    const item1 = {
      categoryId: 'cat',
      armorClass: 2,
      durability: 2,
      ergonomicsModifierPercentage: 2,
      capacity: 2
    } as IVest

    const item2 = {
      categoryId: 'cat',
      armorClass: 1,
      durability: 1,
      ergonomicsModifierPercentage: 1,
      capacity: 1
    } as IVest

    const sortingService = new SortingService(VestSortingFunctions)
    const updatedSortingData = sortingService.setSortingProperty(property)

    // Act
    const sortedItems = await SortingService.sort([item1, item2], updatedSortingData!)

    // Assert
    expect(sortedItems).toStrictEqual([item2, item1])
  })
})