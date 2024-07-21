import { describe, expect, it } from 'vitest'
import { IEyewear } from '../../../../models/item/IEyewear'
import ItemSortingData from '../../../../models/utils/ItemSortingData'
import { ItemSortingService } from '../../../../services/sorting/ItemSortingService'
import { EyewearSortingFunctions } from '../../../../services/sorting/functions/EyewearSortingFunctions'

describe('comparisonFunction()', () => {
  it.each([['blindnessProtectionPercentage']])('should compare by a property', async (property: string) => {
    // Arrange
    const item1 = {
      categoryId: 'cat',
      blindnessProtectionPercentage: 2
    } as IEyewear

    const item2 = {
      categoryId: 'cat',
      blindnessProtectionPercentage: 1
    } as IEyewear

    let sortingData: ItemSortingData | undefined = new ItemSortingData()
    const sortingService = new ItemSortingService()
    sortingData = sortingService.setSortingProperty(sortingData, EyewearSortingFunctions, property)

    // Act
    const sortedItems = await sortingService.sort([item1, item2], sortingData!)

    // Assert
    expect(sortedItems).toStrictEqual([item2, item1])
  })
})