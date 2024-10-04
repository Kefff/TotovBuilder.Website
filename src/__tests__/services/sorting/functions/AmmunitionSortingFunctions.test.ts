import { describe, expect, it } from 'vitest'
import { IAmmunition } from '../../../../models/item/IAmmunition'
import { IItem } from '../../../../models/item/IItem'
import SortingData from '../../../../models/utils/SortingData'
import { SortingService } from '../../../../services/sorting/SortingService'
import { AmmunitionSortingFunctions } from '../../../../services/sorting/functions/AmmunitionSortingFunctions'

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
      categoryId: 'cat',
      fleshDamage: 2,
      penetratedArmorLevel: 2,
      penetrationPower: 2,
      fragmentationChance: 2,
      recoilModifier: 2,
      accuracyModifierPercentage: 2
    } as IAmmunition

    const item2 = {
      categoryId: 'cat',
      fleshDamage: 1,
      penetratedArmorLevel: 1,
      penetrationPower: 1,
      fragmentationChance: 1,
      recoilModifier: 1,
      accuracyModifierPercentage: 1
    } as IAmmunition

    let sortingData: SortingData<IItem> | undefined = new SortingData()
    const sortingService = new SortingService()
    sortingData = sortingService.setSortingProperty(sortingData, AmmunitionSortingFunctions, property)

    // Act
    const sortedItems = await sortingService.sort([item1, item2], sortingData!)

    // Assert
    expect(sortedItems).toStrictEqual([item2, item1])
  })
})