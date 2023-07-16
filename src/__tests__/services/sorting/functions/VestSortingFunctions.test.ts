import { IVest } from '../../../../models/item/IVest'
import { SortingService } from '../../../../services/sorting/SortingService'
import { VestSortingFunctions } from '../../../../services/sorting/functions/VestSortingFunctions'
import { describe, expect, it } from 'vitest'

describe('comparisonFunction()', () => {
  it.each([
    ['armorClass'],
    ['capacity'],
    ['durability'],
    ['ergonomicsPercentageModifier']
  ])('should compare by a property', async (property: string) => {
    // Arrange
    const item1 = {
      categoryId: 'cat',
      armorClass: 2,
      durability: 2,
      ergonomicsPercentageModifier: 2,
      capacity: 2
    } as IVest

    const item2 = {
      categoryId: 'cat',
      armorClass: 1,
      durability: 1,
      ergonomicsPercentageModifier: 1,
      capacity: 1
    } as IVest

    const sortingService = new SortingService(VestSortingFunctions)
    const updatedSortingDataResult = sortingService.setSortingProperty(property)

    // Act
    const sortedItems = await SortingService.sort([item1, item2], updatedSortingDataResult.value)

    // Assert
    expect(sortedItems).to.deep.equal([item2, item1])
  })
})