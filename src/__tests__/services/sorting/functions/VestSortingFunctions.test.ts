import { describe, expect, it } from 'vitest'
import { IVest } from '../../../../models/item/IVest'
import ItemSortingData from '../../../../models/utils/ItemSortingData'
import { ItemSortingService } from '../../../../services/sorting/ItemSortingService'
import { VestSortingFunctions } from '../../../../services/sorting/functions/VestSortingFunctions'

describe('comparisonFunction()', () => {
  it.each([
    ['armorClass'],
    ['capacity'],
    ['durability'],
    ['ergonomicsModifierPercentage']
  ])('should compare by a property', async (property: string) => {
    // Arrange
    const item1 = {
      categoryId: 'cat',
      armorClass: 2,
      durability: 2,
      ergonomicsModifierPercentage: 2,
      capacity: 2
    } as IVest

    const item2 = {
      categoryId: 'cat',
      armorClass: 1,
      durability: 1,
      ergonomicsModifierPercentage: 1,
      capacity: 1
    } as IVest

    let sortingData: ItemSortingData | undefined = new ItemSortingData()
    const sortingService = new ItemSortingService()
    sortingData = sortingService.setSortingProperty(sortingData, VestSortingFunctions, property)

    // Act
    const sortedItems = await sortingService.sort([item1, item2], sortingData!)

    // Assert
    expect(sortedItems).toStrictEqual([item2, item1])
  })
})