import { describe, expect, it } from 'vitest'
import { IBackpack } from '../../../../models/item/IBackpack'
import { ItemCategoryId } from '../../../../models/item/IItem'
import { IWearable } from '../../../../models/item/IWearable'
import SortingData from '../../../../models/utils/SortingData'
import { SortingService } from '../../../../services/sorting/SortingService'
import { WearableSortingFunctions } from '../../../../services/sorting/functions/WearableSortingFunctions'

describe('comparisonFunction()', () => {
  it.each([
    ['ergonomicsModifierPercentage'],
    ['movementSpeedModifierPercentage'],
    ['turningSpeedModifierPercentage']
  ])('should sort by %s', async (property: string) => {
    // Arrange
    const item1 = {
      categoryId: ItemCategoryId.backpack,
      ergonomicsModifierPercentage: 2,
      movementSpeedModifierPercentage: 2,
      turningSpeedModifierPercentage: 2
    } as IBackpack

    const item2 = {
      categoryId: ItemCategoryId.backpack,
      ergonomicsModifierPercentage: 1,
      movementSpeedModifierPercentage: 1,
      turningSpeedModifierPercentage: 1
    } as IBackpack

    let sortingData: SortingData<IWearable> | undefined = new SortingData()
    const sortingService = new SortingService()
    sortingData = sortingService.setSortingProperty(sortingData, WearableSortingFunctions, property)

    // Act
    const sortedItems = await sortingService.sortAsync([item1, item2], sortingData!)

    // Assert
    expect(sortedItems).toStrictEqual([item2, item1])
  })
})