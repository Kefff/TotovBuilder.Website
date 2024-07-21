import { describe, expect, it } from 'vitest'
import { IMeleeWeapon } from '../../../../models/item/IMeleeWeapon'
import ItemSortingData from '../../../../models/utils/ItemSortingData'
import { ItemSortingService } from '../../../../services/sorting/ItemSortingService'
import { MeleeWeaponSortingFunctions } from '../../../../services/sorting/functions/MeleeWeaponSortingFunctions'

describe('comparisonFunction()', () => {
  it.each([
    ['chopDamage'],
    ['hitRadius'],
    ['stabDamage']
  ])('should compare by a property', async (property: string) => {
    // Arrange
    const item1 = {
      categoryId: 'cat',
      stabDamage: 2,
      chopDamage: 2,
      hitRadius: 2
    } as IMeleeWeapon

    const item2 = {
      categoryId: 'cat',
      stabDamage: 1,
      chopDamage: 1,
      hitRadius: 1
    } as IMeleeWeapon

    let sortingData: ItemSortingData | undefined = new ItemSortingData()
    const sortingService = new ItemSortingService()
    sortingData = sortingService.setSortingProperty(sortingData, MeleeWeaponSortingFunctions, property)

    // Act
    const sortedItems = await sortingService.sort([item1, item2], sortingData!)

    // Assert
    expect(sortedItems).toStrictEqual([item2, item1])
  })
})