import { describe, expect, it } from 'vitest'
import { ItemCategoryId } from '../../../../models/item/IItem'
import { IMod } from '../../../../models/item/IMod'
import FilterAndSortingData from '../../../../models/utils/FilterAndSortingData'
import ItemFilterAndSortingData from '../../../../models/utils/ItemFilterAndSortingData'
import { SortingService } from '../../../../services/sorting/SortingService'
import { ModSortingFunctions } from '../../../../services/sorting/functions/itemSortingFunctions'

describe('comparisonFunction', () => {
  it.each([
    ['ergonomicsModifier', false],
    ['ergonomicsModifier', true]
  ])('should sort by %s', async (property: string, isPreset: boolean) => {
    // Arrange
    const item1 = {
      categoryId: ItemCategoryId.mod,
      ergonomicsModifier: 2,
      presetErgonomicsModifier: isPreset ? 2 : undefined
    } as IMod

    const item2 = {
      categoryId: ItemCategoryId.mod,
      ergonomicsModifier: 1,
      presetErgonomicsModifier: isPreset ? 1 : undefined
    } as IMod

    const sortingService = new SortingService()
    let sortingData: FilterAndSortingData<IMod> | undefined = new ItemFilterAndSortingData(ModSortingFunctions)
    sortingData = sortingService.setSortingProperty(sortingData, property)

    // Act
    const sortedItems = await sortingService.sortAsync([item1, item2], sortingData!)

    // Assert
    expect(sortedItems).toStrictEqual([item2, item1])
  })
})