import { IBackpack } from '../../../../models/item/IBackpack'
import { SortingService } from '../../../../services/sorting/SortingService'
import { WearableSortingFunctions } from '../../../../services/sorting/functions/WearableSortingFunctions'
import { describe, expect, it } from 'vitest'

describe('comparisonFunction()', () => {
  it.each([
    ['ergonomicsPercentageModifier'],
    ['movementSpeedPercentageModifier'],
    ['turningSpeedPercentageModifier']
  ])('should compare by a property', async (property: string) => {
    // Arrange
    const item1 = {
      categoryId: 'cat',
      ergonomicsPercentageModifier: 2,
      movementSpeedPercentageModifier: 2,
      turningSpeedPercentageModifier: 2
    } as IBackpack

    const item2 = {
      categoryId: 'cat',
      ergonomicsPercentageModifier: 1,
      movementSpeedPercentageModifier: 1,
      turningSpeedPercentageModifier: 1
    } as IBackpack

    const sortingService = new SortingService(WearableSortingFunctions)
    const updatedSortingDataResult = sortingService.setSortingProperty(property)

    // Act
    const sortedItems = await SortingService.sort([item1, item2], updatedSortingDataResult.value)

    // Assert
    expect(sortedItems).to.deep.equal([item2, item1])
  })
})