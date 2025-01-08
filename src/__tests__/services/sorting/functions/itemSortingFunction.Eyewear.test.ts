import { describe, expect, it } from 'vitest'
import { IEyewear } from '../../../../models/item/IEyewear'
import { ItemCategoryId } from '../../../../models/item/IItem'
import FilterAndSortingData from '../../../../models/utils/FilterAndSortingData'
import ItemFilterAndSortingData from '../../../../models/utils/ItemFilterAndSortingData'
import { SortingService } from '../../../../services/sorting/SortingService'
import { EyewearSortingFunctions } from '../../../../services/sorting/functions/itemSortingFunctions'

describe('comparisonFunction()', () => {
  it.each([['blindnessProtectionPercentage']])('should sort by %s', async (property: string) => {
    // Arrange
    const item1 = {
      categoryId: ItemCategoryId.eyewear,
      blindnessProtectionPercentage: 2
    } as IEyewear

    const item2 = {
      categoryId: ItemCategoryId.eyewear,
      blindnessProtectionPercentage: 1
    } as IEyewear

    const sortingService = new SortingService()
    let sortingData: FilterAndSortingData<IEyewear> | undefined = new ItemFilterAndSortingData(EyewearSortingFunctions)
    sortingData = sortingService.setSortingProperty(sortingData, property)

    // Act
    const sortedItems = await sortingService.sortAsync([item1, item2], sortingData!)

    // Assert
    expect(sortedItems).toStrictEqual([item2, item1])
  })
})