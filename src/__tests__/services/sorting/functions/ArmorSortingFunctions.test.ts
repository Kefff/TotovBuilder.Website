import { describe, expect, it } from 'vitest'
import { IArmor } from '../../../../models/item/IArmor'
import { SortingService } from '../../../../services/sorting/SortingService'
import { ArmorSortingFunctions } from '../../../../services/sorting/functions/ArmorSortingFunctions'

describe('comparisonFunction()', () => {
  it.each([
    ['armorClass'],
    ['durability'],
    ['ergonomicsModifierPercentage']
  ])('should compare by a property', async (property: string) => {
    // Arrange
    const item1 = {
      categoryId: 'cat',
      armorClass: 2,
      durability: 2,
      ergonomicsModifierPercentage: 2
    } as IArmor

    const item2 = {
      categoryId: 'cat',
      armorClass: 1,
      durability: 1,
      ergonomicsModifierPercentage: 1
    } as IArmor

    const sortingService = new SortingService(ArmorSortingFunctions)
    const updatedSortingData = sortingService.setSortingProperty(property)

    // Act
    const sortedItems = await SortingService.sort([item1, item2], updatedSortingData!)

    // Assert
    expect(sortedItems).toStrictEqual([item2, item1])
  })
})