import { describe, expect, it } from 'vitest'
import { IContainer } from '../../../../models/item/IContainer'
import { ItemCategoryId } from '../../../../models/item/IItem'
import SortingData from '../../../../models/utils/SortingData'
import { SortingService } from '../../../../services/sorting/SortingService'
import { ContainerSortingFunctions } from '../../../../services/sorting/functions/ContainerSortingFunctions'

describe('comparisonFunction()', () => {
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

    let sortingData: SortingData<IContainer> | undefined = new SortingData()
    const sortingService = new SortingService()
    sortingData = sortingService.setSortingProperty(sortingData, ContainerSortingFunctions, property)

    // Act
    const sortedItems = await sortingService.sort([item1, item2], sortingData!)

    // Assert
    expect(sortedItems).toStrictEqual([item2, item1])
  })
})