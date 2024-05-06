import { describe, expect, it } from 'vitest'
import { IContainer } from '../../../../models/item/IContainer'
import { SortingService } from '../../../../services/sorting/SortingService'
import { ContainerSortingFunctions } from '../../../../services/sorting/functions/ContainerSortingFunctions'

describe('comparisonFunction()', () => {
  it.each([['capacity']])('should compare by a property', async (property: string) => {
    // Arrange
    const item1 = {
      categoryId: 'cat',
      capacity: 2
    } as IContainer

    const item2 = {
      categoryId: 'cat',
      capacity: 1
    } as IContainer

    const sortingService = new SortingService(ContainerSortingFunctions)
    const updatedSortingData = sortingService.setSortingProperty(property)

    // Act
    const sortedItems = await SortingService.sort([item1, item2], updatedSortingData!)

    // Assert
    expect(sortedItems).toStrictEqual([item2, item1])
  })
})