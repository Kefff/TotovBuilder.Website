import { describe, expect, it } from 'vitest'
import { IBackpack } from '../../../../models/item/IBackpack'
import ItemSortingData from '../../../../models/utils/ItemSortingData'
import { ItemSortingService } from '../../../../services/sorting/ItemSortingService'
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

    let sortingData: ItemSortingData | undefined = new ItemSortingData()
    const sortingService = new ItemSortingService()
    sortingData = sortingService.setSortingProperty(sortingData, WearableSortingFunctions, property)

    // Act
    const sortedItems = await sortingService.sort([item1, item2], sortingData!)

    // Assert
    expect(sortedItems).toStrictEqual([item2, item1])
  })
})