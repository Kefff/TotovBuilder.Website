import { IContainer } from '../../../../models/item/IContainer'
import { SortingService } from '../../../../services/sorting/SortingService'
import { ContainerSortingFunctions } from '../../../../services/sorting/functions/ContainerSortingFunctions'
import { describe, expect, it } from 'vitest'

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
    const updatedSortingDataResult = sortingService.setSortingProperty(property)

    // Act
    const sortedItems = await SortingService.sort([item1, item2], updatedSortingDataResult.value)

    // Assert
    expect(sortedItems).to.deep.equal([item2, item1])
  })
})