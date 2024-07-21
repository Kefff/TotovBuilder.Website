import { describe, expect, it } from 'vitest'
import { IArmor } from '../../../../models/item/IArmor'
import ItemSortingData from '../../../../models/utils/ItemSortingData'
import { ItemSortingService } from '../../../../services/sorting/ItemSortingService'
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

    let sortingData: ItemSortingData | undefined = new ItemSortingData()
    const sortingService = new ItemSortingService()
    sortingData = sortingService.setSortingProperty(sortingData, ArmorSortingFunctions, property)

    // Act
    const sortedItems = await sortingService.sort([item1, item2], sortingData!)

    // Assert
    expect(sortedItems).toStrictEqual([item2, item1])
  })
})