import { IMeleeWeapon } from '../../../../models/item/IMeleeWeapon'
import { SortingService } from '../../../../services/sorting/SortingService'
import { MeleeWeaponSortingFunctions } from '../../../../services/sorting/functions/MeleeWeaponSortingFunctions'
import { describe, expect, it } from 'vitest'

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

    const sortingService = new SortingService(MeleeWeaponSortingFunctions)
    const updatedSortingDataResult = sortingService.setSortingProperty(property)

    // Act
    const sortedItems = await SortingService.sort([item1, item2], updatedSortingDataResult.value)

    // Assert
    expect(sortedItems).toStrictEqual([item2, item1])
  })
})