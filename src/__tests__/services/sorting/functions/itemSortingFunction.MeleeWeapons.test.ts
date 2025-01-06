import { describe, expect, it } from 'vitest'
import { ItemCategoryId } from '../../../../models/item/IItem'
import { IMeleeWeapon } from '../../../../models/item/IMeleeWeapon'
import FilterAndSortingData from '../../../../models/utils/FilterAndSortingData'
import ItemFilterAndSortingData from '../../../../models/utils/ItemFilterAndSortingData'
import { SortingService } from '../../../../services/sorting/SortingService'
import { MeleeWeaponSortingFunctions } from '../../../../services/sorting/functions/itemSortingFunctions'

describe('comparisonFunction()', () => {
  it.each([
    ['chopDamage'],
    ['hitRadius'],
    ['stabDamage']
  ])('should sort by %s', async (property: string) => {
    // Arrange
    const item1 = {
      categoryId: ItemCategoryId.meleeWeapon,
      stabDamage: 2,
      chopDamage: 2,
      hitRadius: 2
    } as IMeleeWeapon

    const item2 = {
      categoryId: ItemCategoryId.meleeWeapon,
      stabDamage: 1,
      chopDamage: 1,
      hitRadius: 1
    } as IMeleeWeapon

    const sortingData: FilterAndSortingData<IMeleeWeapon> | undefined = new ItemFilterAndSortingData(MeleeWeaponSortingFunctions)
    const sortingService = new SortingService()
    sortingService.setSortingProperty(sortingData, property)

    // Act
    const sortedItems = await sortingService.sortAsync([item1, item2], sortingData!)

    // Assert
    expect(sortedItems).toStrictEqual([item2, item1])
  })
})