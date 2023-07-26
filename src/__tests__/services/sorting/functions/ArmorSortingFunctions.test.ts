import { IArmor } from '../../../../models/item/IArmor'
import { SortingService } from '../../../../services/sorting/SortingService'
import { ArmorSortingFunctions } from '../../../../services/sorting/functions/ArmorSortingFunctions'
import { describe, expect, it } from 'vitest'

describe('comparisonFunction()', () => {
  it.each([
    ['armorClass'],
    ['durability'],
    ['ergonomicsPercentageModifier']
  ])('should compare by a property', async (property: string) => {
    // Arrange
    const item1 = {
      categoryId: 'cat',
      armorClass: 2,
      durability: 2,
      ergonomicsPercentageModifier: 2
    } as IArmor

    const item2 = {
      categoryId: 'cat',
      armorClass: 1,
      durability: 1,
      ergonomicsPercentageModifier: 1
    } as IArmor

    const sortingService = new SortingService(ArmorSortingFunctions)
    const updatedSortingDataResult = sortingService.setSortingProperty(property)

    // Act
    const sortedItems = await SortingService.sort([item1, item2], updatedSortingDataResult.value)

    // Assert
    expect(sortedItems).toStrictEqual([item2, item1])
  })
})