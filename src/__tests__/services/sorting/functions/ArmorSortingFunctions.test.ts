import { describe, expect, it } from 'vitest'
import { IArmor } from '../../../../models/item/IArmor'
import { IItem } from '../../../../models/item/IItem'
import SortingData from '../../../../models/utils/SortingData'
import { SortingService } from '../../../../services/sorting/SortingService'
import { ArmorSortingFunctions } from '../../../../services/sorting/functions/ArmorSortingFunctions'

describe('comparisonFunction()', () => {
  it.each([
    ['armorClass'],
    ['durability'],
    ['ergonomicsModifierPercentage']
  ])('should sort by %s', async (property: string) => {
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

    let sortingData: SortingData<IItem> | undefined = new SortingData()
    const sortingService = new SortingService()
    sortingData = sortingService.setSortingProperty(sortingData, ArmorSortingFunctions, property)

    // Act
    const sortedItems = await sortingService.sort([item1, item2], sortingData!)

    // Assert
    expect(sortedItems).toStrictEqual([item2, item1])
  })
})