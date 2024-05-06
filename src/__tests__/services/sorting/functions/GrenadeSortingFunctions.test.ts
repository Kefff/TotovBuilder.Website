import { describe, expect, it } from 'vitest'
import { IGrenade } from '../../../../models/item/IGrenade'
import { SortingService } from '../../../../services/sorting/SortingService'
import { GrenadeSortingFunctions } from '../../../../services/sorting/functions/GrenadeSortingFunctions'

describe('comparisonFunction()', () => {
  it.each([
    ['explosionDelay'],
    ['fragmentsAmount'],
    ['maximumExplosionRange']
  ])('should compare by a property', async (property: string) => {
    // Arrange
    const item1 = {
      categoryId: 'cat',
      explosionDelay: 2,
      maximumExplosionRange: 2,
      fragmentsAmount: 2
    } as IGrenade

    const item2 = {
      categoryId: 'cat',
      explosionDelay: 1,
      maximumExplosionRange: 1,
      fragmentsAmount: 1
    } as IGrenade

    const sortingService = new SortingService(GrenadeSortingFunctions)
    const updatedSortingData = sortingService.setSortingProperty(property)

    // Act
    const sortedItems = await SortingService.sort([item1, item2], updatedSortingData!)

    // Assert
    expect(sortedItems).toStrictEqual([item2, item1])
  })
})