import { describe, expect, it } from 'vitest'
import { IAmmunition } from '../../../../models/item/IAmmunition'
import { ItemCategoryId } from '../../../../models/item/IItem'
import FilterAndSortingData from '../../../../models/utils/FilterAndSortingData'
import { SortingService } from '../../../../services/sorting/SortingService'
import { AmmunitionSortingFunctions } from '../../../../services/sorting/functions/itemSortingFunctions'

describe('comparisonFunction()', () => {
  it.each([
    ['accuracyModifierPercentage'],
    ['fleshDamage'],
    ['fragmentationChance'],
    ['penetratedArmorLevel'],
    ['penetrationPower'],
    ['recoilModifier']
  ])('should sort by %s', async (property: string) => {
    // Arrange
    const item1 = {
      accuracyModifierPercentage: 2,
      categoryId: ItemCategoryId.ammunition,
      fleshDamage: 1,
      fragmentationChance: 2,
      penetratedArmorLevel: 2,
      penetrationPower: 2,
      projectiles: 2,
      recoilModifier: 2
    } as IAmmunition

    const item2 = {
      accuracyModifierPercentage: 1,
      categoryId: ItemCategoryId.ammunition,
      fleshDamage: 1,
      fragmentationChance: 1,
      penetratedArmorLevel: 1,
      penetrationPower: 1,
      projectiles: 1,
      recoilModifier: 1
    } as IAmmunition

    let sortingData: FilterAndSortingData<IAmmunition> | undefined = new FilterAndSortingData(AmmunitionSortingFunctions)
    const sortingService = new SortingService()
    sortingService.setSortingProperty(sortingData, property)

    // Act
    const sortedItems = await sortingService.sortAsync([item1, item2], sortingData!)

    // Assert
    expect(sortedItems).toStrictEqual([item2, item1])
  })
})