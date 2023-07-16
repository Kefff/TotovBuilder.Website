import { IAmmunition } from '../../../../models/item/IAmmunition'
import { SortingService } from '../../../../services/sorting/SortingService'
import { AmmunitionSortingFunctions } from '../../../../services/sorting/functions/AmmunitionSortingFunctions'
import { describe, expect, it } from 'vitest'

describe('comparisonFunction()', () => {
  it.each([
    ['accuracyPercentageModifier'],
    ['fleshDamage'],
    ['fragmentationChancePercentage'],
    ['penetrationPower'],
    ['recoilPercentageModifier']
  ])('should compare by a property', async (property: string) => {
    // Arrange
    const item1 = {
      categoryId: 'cat',
      fleshDamage: 2,
      penetrationPower: 2,
      fragmentationChancePercentage: 2,
      recoilPercentageModifier: 2,
      accuracyPercentageModifier: 2
    } as IAmmunition

    const item2 = {
      categoryId: 'cat',
      fleshDamage: 1,
      penetrationPower: 1,
      fragmentationChancePercentage: 1,
      recoilPercentageModifier: 1,
      accuracyPercentageModifier: 1
    } as IAmmunition

    const sortingService = new SortingService(AmmunitionSortingFunctions)
    const updatedSortingDataResult = sortingService.setSortingProperty(property)

    // Act
    const sortedItems = await SortingService.sort([item1, item2], updatedSortingDataResult.value)

    // Assert
    expect(sortedItems).to.deep.equal([item2, item1])
  })
})