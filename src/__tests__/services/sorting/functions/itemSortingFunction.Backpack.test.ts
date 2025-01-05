import { describe, expect, it } from 'vitest'
import { IBackpack } from '../../../../models/item/IBackpack'
import { ItemCategoryId } from '../../../../models/item/IItem'
import FilterAndSortingData from '../../../../models/utils/FilterAndSortingData'
import { SortingService } from '../../../../services/sorting/SortingService'
import { BackpackSortingFunctions } from '../../../../services/sorting/functions/ItemSortingFunctions'

describe('comparisonFunction()', () => {
  it.each([
    ['capacity'],
    ['ergonomicsModifierPercentage'],
    ['movementSpeedModifierPercentage'],
    ['turningSpeedModifierPercentage']
  ])('should sort by %s', async (property: string) => {
    // Arrange
    // Arrange
    const item1 = {
      capacity: 2,
      categoryId: ItemCategoryId.backpack,
      ergonomicsModifierPercentage: 2,
      movementSpeedModifierPercentage: 2,
      turningSpeedModifierPercentage: 2
    } as IBackpack

    const item2 = {
      capacity: 1,
      categoryId: ItemCategoryId.backpack,
      ergonomicsModifierPercentage: 1,
      movementSpeedModifierPercentage: 1,
      turningSpeedModifierPercentage: 1
    } as IBackpack

    let sortingData: FilterAndSortingData<IBackpack> | undefined = new FilterAndSortingData(BackpackSortingFunctions)
    const sortingService = new SortingService()
    sortingService.setSortingProperty(sortingData, property)

    // Act
    const sortedItems = await sortingService.sortAsync([item1, item2], sortingData!)

    // Assert
    expect(sortedItems).toStrictEqual([item2, item1])
  })
})