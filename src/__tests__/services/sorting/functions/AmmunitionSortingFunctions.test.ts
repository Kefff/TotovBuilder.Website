import { describe, expect, it } from 'vitest'
import { IAmmunition } from '../../../../models/item/IAmmunition'
import ItemSortingData from '../../../../models/utils/ItemSortingData'
import { ItemSortingService } from '../../../../services/sorting/ItemSortingService'
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

    let sortingData: ItemSortingData | undefined = new ItemSortingData()
    const sortingService = new ItemSortingService()
    sortingData = sortingService.setSortingProperty(sortingData, AmmunitionSortingFunctions, property)

    // Act
    const sortedItems = await sortingService.sort([item1, item2], sortingData!)

    // Assert
    expect(sortedItems).toStrictEqual([item2, item1])
  })
})