import { describe, expect, it } from 'vitest'
import { IGrenade } from '../../../../models/item/IGrenade'
import { ItemCategoryId } from '../../../../models/item/IItem'
import ItemFilterAndSortingData from '../../../../models/utils/ItemFilterAndSortingData'
import { SortingService } from '../../../../services/sorting/SortingService'
import { GrenadeSortingFunctions } from '../../../../services/sorting/functions/itemSortingFunctions'

describe('comparisonFunction', () => {
  it.each([
    ['explosionDelay'],
    ['fragmentsAmount'],
    ['maximumExplosionRange']
  ])('should sort by %s', async (property: string) => {
    // Arrange
    const item1 = {
      categoryId: ItemCategoryId.grenade,
      explosionDelay: 2,
      maximumExplosionRange: 2,
      fragmentsAmount: 2
    } as IGrenade

    const item2 = {
      categoryId: ItemCategoryId.grenade,
      explosionDelay: 1,
      maximumExplosionRange: 1,
      fragmentsAmount: 1
    } as IGrenade

    const sortingData = new ItemFilterAndSortingData(GrenadeSortingFunctions)
    sortingData.property = property

    const sortingService = new SortingService()

    // Act
    const sortedItems = await sortingService.sortAsync([item1, item2], sortingData!)

    // Assert
    expect(sortedItems).toStrictEqual([item2, item1])
  })
})