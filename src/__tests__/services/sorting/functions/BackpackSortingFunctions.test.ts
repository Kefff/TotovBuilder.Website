import { describe, expect, it } from 'vitest'
import { IBackpack } from '../../../../models/item/IBackpack'
import { SortingService } from '../../../../services/sorting/SortingService'
import { BackpackSortingFunctions } from '../../../../services/sorting/functions/BackpackSortingFunctions'

describe('comparisonFunction()', () => {
  it.each([
    ['capacity'],
    ['ergonomicsModifierPercentage'],
    ['movementSpeedModifierPercentage'],
    ['turningSpeedModifierPercentage']
  ])('should compare by a property', async (property: string) => {
    // Arrange
    // Arrange
    const item1 = {
      capacity: 2,
      categoryId: 'cat',
      ergonomicsModifierPercentage: 2,
      movementSpeedModifierPercentage: 2,
      turningSpeedModifierPercentage: 2
    } as IBackpack

    const item2 = {
      capacity: 1,
      categoryId: 'cat',
      ergonomicsModifierPercentage: 1,
      movementSpeedModifierPercentage: 1,
      turningSpeedModifierPercentage: 1
    } as IBackpack

    const sortingService = new SortingService(BackpackSortingFunctions)
    const updatedSortingDataResult = sortingService.setSortingProperty(property)

    // Act
    const sortedItems = await SortingService.sort([item1, item2], updatedSortingDataResult.value)

    // Assert
    expect(sortedItems).toStrictEqual([item2, item1])
  })
})