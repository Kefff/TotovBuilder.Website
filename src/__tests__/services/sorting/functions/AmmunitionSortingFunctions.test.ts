import { describe, expect, it } from 'vitest'
import { IAmmunition } from '../../../../models/item/IAmmunition'
import { SortingService } from '../../../../services/sorting/SortingService'
import { AmmunitionSortingFunctions } from '../../../../services/sorting/functions/AmmunitionSortingFunctions'

describe('comparisonFunction()', () => {
  it.each([
    ['accuracyModifierPercentage'],
    ['fleshDamage'],
    ['fragmentationChance'],
    ['penetrationPower'],
    ['recoilModifierPercentage']
  ])('should compare by a property', async (property: string) => {
    // Arrange
    const item1 = {
      categoryId: 'cat',
      fleshDamage: 2,
      penetrationPower: 2,
      fragmentationChance: 2,
      recoilModifierPercentage: 2,
      accuracyModifierPercentage: 2
    } as IAmmunition

    const item2 = {
      categoryId: 'cat',
      fleshDamage: 1,
      penetrationPower: 1,
      fragmentationChance: 1,
      recoilModifierPercentage: 1,
      accuracyModifierPercentage: 1
    } as IAmmunition

    const sortingService = new SortingService(AmmunitionSortingFunctions)
    const updatedSortingDataResult = sortingService.setSortingProperty(property)

    // Act
    const sortedItems = await SortingService.sort([item1, item2], updatedSortingDataResult.value)

    // Assert
    expect(sortedItems).toStrictEqual([item2, item1])
  })
})