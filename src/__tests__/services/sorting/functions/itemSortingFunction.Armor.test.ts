import { describe, expect, it } from 'vitest'
import { IArmor } from '../../../../models/item/IArmor'
import { ItemCategoryId } from '../../../../models/item/IItem'
import FilterAndSortingData from '../../../../models/utils/FilterAndSortingData'
import { SortingService } from '../../../../services/sorting/SortingService'
import { ArmorSortingFunctions } from '../../../../services/sorting/functions/itemSortingFunctions'

describe('comparisonFunction()', () => {
  it.each([
    ['armorClass'],
    ['durability'],
    ['ergonomicsModifierPercentage']
  ])('should sort by %s', async (property: string) => {
    // Arrange
    const item1 = {
      categoryId: ItemCategoryId.armor,
      armorClass: 1,
      durability: 1,
      ergonomicsModifierPercentage: 2,
      presetArmorModifiers: {
        armorClass: 2,
        durability: 2
      }
    } as IArmor

    const item2 = {
      categoryId: ItemCategoryId.armor,
      armorClass: 1,
      durability: 1,
      ergonomicsModifierPercentage: 1
    } as IArmor

    let sortingData: FilterAndSortingData<IArmor> | undefined = new FilterAndSortingData(ArmorSortingFunctions)
    const sortingService = new SortingService()
    sortingService.setSortingProperty(sortingData, property)

    // Act
    const sortedItems = await sortingService.sortAsync([item1, item2], sortingData!)

    // Assert
    expect(sortedItems).toStrictEqual([item2, item1])
  })
})