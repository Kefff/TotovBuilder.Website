import { describe, expect, it } from 'vitest'
import { IContainer } from '../../../../models/item/IContainer'
import { IItem } from '../../../../models/item/IItem'
import SortingData from '../../../../models/utils/SortingData'
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

    let sortingData: SortingData<IItem> | undefined = new SortingData()
    const sortingService = new SortingService()
    sortingData = sortingService.setSortingProperty(sortingData, ContainerSortingFunctions, property)

    // Act
    const sortedItems = await sortingService.sort([item1, item2], sortingData!)

    // Assert
    expect(sortedItems).toStrictEqual([item2, item1])
  })
})