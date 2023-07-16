import { IBackpack } from '../../../../models/item/IBackpack'
import { SortingService } from '../../../../services/sorting/SortingService'
import { BackpackSortingFunctions } from '../../../../services/sorting/functions/BackpackSortingFunctions'
import { describe, expect, it } from 'vitest'

describe('comparisonFunction()', () => {
  it.each([
    ['capacity'],
    ['ergonomicsPercentageModifier'],
    ['movementSpeedPercentageModifier'],
    ['turningSpeedPercentageModifier']
  ])('should compare by a property', async (property: string) => {
    // Arrange
    // Arrange
    const item1 = {
      capacity: 2,
      categoryId: 'cat',
      ergonomicsPercentageModifier: 2,
      movementSpeedPercentageModifier: 2,
      turningSpeedPercentageModifier: 2
    } as IBackpack

    const item2 = {
      capacity: 1,
      categoryId: 'cat',
      ergonomicsPercentageModifier: 1,
      movementSpeedPercentageModifier: 1,
      turningSpeedPercentageModifier: 1
    } as IBackpack

    const sortingService = new SortingService(BackpackSortingFunctions)
    const updatedSortingDataResult = sortingService.setSortingProperty(property)

    // Act
    const sortedItems = await SortingService.sort([item1, item2], updatedSortingDataResult.value)

    // Assert
    expect(sortedItems).to.deep.equal([item2, item1])
  })
})