import { describe, expect, it } from 'vitest'
import { IBackpack } from '../../../../models/item/IBackpack'
import { SortingService } from '../../../../services/sorting/SortingService'
import { WearableSortingFunctions } from '../../../../services/sorting/functions/WearableSortingFunctions'

describe('comparisonFunction()', () => {
  it.each([
    ['ergonomicsModifierPercentage'],
    ['movementSpeedModifierPercentage'],
    ['turningSpeedModifierPercentage']
  ])('should compare by a property', async (property: string) => {
    // Arrange
    const item1 = {
      categoryId: 'cat',
      ergonomicsModifierPercentage: 2,
      movementSpeedModifierPercentage: 2,
      turningSpeedModifierPercentage: 2
    } as IBackpack

    const item2 = {
      categoryId: 'cat',
      ergonomicsModifierPercentage: 1,
      movementSpeedModifierPercentage: 1,
      turningSpeedModifierPercentage: 1
    } as IBackpack

    const sortingService = new SortingService(WearableSortingFunctions)
    const updatedSortingData = sortingService.setSortingProperty(property)

    // Act
    const sortedItems = await SortingService.sort([item1, item2], updatedSortingData!)

    // Assert
    expect(sortedItems).toStrictEqual([item2, item1])
  })
})