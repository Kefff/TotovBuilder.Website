import { describe, expect, it } from 'vitest'
import { IBackpack } from '../../../../models/item/IBackpack'
import { ItemCategoryId } from '../../../../models/item/IItem'
import ItemFilterAndSortingData from '../../../../models/utils/ItemFilterAndSortingData'
import { SortingService } from '../../../../services/sorting/SortingService'
import { BackpackSortingFunctions } from '../../../../services/sorting/functions/itemSortingFunctions'

describe('comparisonFunction', () => {
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

    const sortingData = new ItemFilterAndSortingData(BackpackSortingFunctions)
    sortingData.property = property

    const sortingService = new SortingService()

    // Act
    const sortedItems = await sortingService.sortAsync([item1, item2], sortingData!)

    // Assert
    expect(sortedItems).toStrictEqual([item2, item1])
  })
})