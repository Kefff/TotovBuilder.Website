import { describe, expect, it } from 'vitest'
import { IContainer } from '../../../../models/item/IContainer'
import { ItemCategoryId } from '../../../../models/item/IItem'
import ItemFilterAndSortingData from '../../../../models/utils/ItemFilterAndSortingData'
import { SortingService } from '../../../../services/sorting/SortingService'
import { ContainerSortingFunctions } from '../../../../services/sorting/functions/itemSortingFunctions'

describe('comparisonFunction', () => {
  it.each([['capacity']])('should sort by %s', async (property: string) => {
    // Arrange
    const item1 = {
      categoryId: ItemCategoryId.container,
      capacity: 2
    } as IContainer

    const item2 = {
      categoryId: ItemCategoryId.container,
      capacity: 1
    } as IContainer

    const sortingData = new ItemFilterAndSortingData(ContainerSortingFunctions)
    sortingData.property = property

    const sortingService = new SortingService()

    // Act
    const sortedItems = await sortingService.sortAsync([item1, item2], sortingData!)

    // Assert
    expect(sortedItems).toStrictEqual([item2, item1])
  })
})