import { describe, expect, it } from 'vitest'
import { ItemCategoryId } from '../../../../models/item/IItem'
import { IVest } from '../../../../models/item/IVest'
import SortingData from '../../../../models/utils/SortingData'
import { SortingService } from '../../../../services/sorting/SortingService'
import { VestSortingFunctions } from '../../../../services/sorting/functions/itemSortingFunctions'

describe('comparisonFunction()', () => {
  it.each([
    ['armorClass'],
    ['capacity'],
    ['durability'],
    ['ergonomicsModifierPercentage']
  ])('should sort by %s', async (property: string) => {
    // Arrange
    const item1 = {
      categoryId: ItemCategoryId.vest,
      armorClass: 2,
      durability: 2,
      ergonomicsModifierPercentage: 2,
      capacity: 2
    } as IVest

    const item2 = {
      categoryId: ItemCategoryId.vest,
      armorClass: 1,
      durability: 1,
      ergonomicsModifierPercentage: 1,
      capacity: 1
    } as IVest

    let sortingData: SortingData<IVest> | undefined = new SortingData(VestSortingFunctions)
    const sortingService = new SortingService()
    sortingData = sortingService.setSortingProperty(sortingData, property)

    // Act
    const sortedItems = await sortingService.sortAsync([item1, item2], sortingData!)

    // Assert
    expect(sortedItems).toStrictEqual([item2, item1])
  })
})