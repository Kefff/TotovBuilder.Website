import { describe, expect, it } from 'vitest'
import { IGrenade } from '../../../../models/item/IGrenade'
import ItemSortingData from '../../../../models/utils/ItemSortingData'
import { ItemSortingService } from '../../../../services/sorting/ItemSortingService'
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

    let sortingData: ItemSortingData | undefined = new ItemSortingData()
    const sortingService = new ItemSortingService()
    sortingData = sortingService.setSortingProperty(sortingData, GrenadeSortingFunctions, property)

    // Act
    const sortedItems = await sortingService.sort([item1, item2], sortingData!)

    // Assert
    expect(sortedItems).toStrictEqual([item2, item1])
  })
})