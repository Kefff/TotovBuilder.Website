import { describe, expect, it } from 'vitest'
import { IHeadwear } from '../../../../models/item/IHeadwear'
import { IItem } from '../../../../models/item/IItem'
import SortingData from '../../../../models/utils/SortingData'
import { SortingService } from '../../../../services/sorting/SortingService'
import { HeadwearSortingFunctions } from '../../../../services/sorting/functions/HeadwearSortingFunctions'

describe('comparisonFunction()', () => {
  it.each([
    [
      { categoryId: 'cat1', ricochetChance: 'Low', name: 'a' } as IHeadwear,
      { categoryId: 'cat2', ricochetChance: 'Low', name: 'a' } as IHeadwear,
      -1
    ],
    [
      { categoryId: 'cat2', ricochetChance: 'Low', name: 'a' } as IHeadwear,
      { categoryId: 'cat1', ricochetChance: 'Low', name: 'a' } as IHeadwear,
      1
    ],
    [
      { categoryId: 'cat1', ricochetChance: 'Low', name: 'a' } as IHeadwear,
      { categoryId: 'cat1', ricochetChance: 'High', name: 'a' } as IHeadwear,
      -2
    ],
    [
      { categoryId: 'cat1', ricochetChance: 'High', name: 'a' } as IHeadwear,
      { categoryId: 'cat1', ricochetChance: 'Low', name: 'a' } as IHeadwear,
      2
    ],
    [
      { categoryId: 'cat1', ricochetChance: 'Low', name: 'a' } as IHeadwear,
      { categoryId: 'cat1', ricochetChance: 'Low', name: 'b' } as IHeadwear,
      -1
    ],
    [
      { categoryId: 'cat1', ricochetChance: 'Low', name: 'b' } as IHeadwear,
      { categoryId: 'cat1', ricochetChance: 'Low', name: 'a' } as IHeadwear,
      1
    ],
    [
      { categoryId: 'cat1', ricochetChance: '', name: 'a' } as IHeadwear,
      { categoryId: 'cat1', ricochetChance: '', name: 'a' } as IHeadwear,
      0
    ]
  ])('should compare by category, ricochet chance and name', async (headwear1: IHeadwear, headwear2: IHeadwear, expected: number) => {
    // Arrange
    const propertyValue1 = await HeadwearSortingFunctions['ricochetChance'].comparisonValueObtentionFunction(headwear1)
    const propertyValue2 = await HeadwearSortingFunctions['ricochetChance'].comparisonValueObtentionFunction(headwear2)

    // Act
    const sortingValue = HeadwearSortingFunctions['ricochetChance'].comparisonFunction(headwear1, propertyValue1, headwear2, propertyValue2)

    // Assert
    expect(sortingValue).toBe(expected)
  })

  it.each([
    ['armorClass', false],
    ['armorClass', true],
    ['durability', false],
    ['durability', true],
    ['ergonomicsModifierPercentage', false],
    ['ergonomicsModifierPercentage', true],
    ['movementSpeedModifierPercentage', false],
    ['movementSpeedModifierPercentage', true],
    ['ricochetChance', false],
    ['ricochetChance', true],
    ['turningSpeedModifierPercentage', false],
    ['turningSpeedModifierPercentage', true]
  ])('should compare by a property', async (property: string, isPreset: boolean) => {
    // Arrange
    const item1 = {
      armorClass: 2,
      categoryId: 'cat',
      durability: 2,
      ergonomicsModifierPercentage: 2,
      movementSpeedModifierPercentage: 2,
      name: 'cat',
      presetWearableModifiers: isPreset
        ? {
          ergonomicsModifierPercentageWithMods: 20,
          movementSpeedModifierPercentageWithMods: 20,
          turningSpeedModifierPercentageWithMods: 20
        }
        : undefined,
      ricochetChance: 'High',
      turningSpeedModifierPercentage: 2
    } as IHeadwear

    const item2 = {
      armorClass: 1,
      categoryId: 'cat',
      durability: 1,
      ergonomicsModifierPercentage: 1,
      movementSpeedModifierPercentage: 1,
      name: 'cat',
      presetWearableModifiers: isPreset
        ? {
          ergonomicsModifierPercentageWithMods: 10,
          movementSpeedModifierPercentageWithMods: 10,
          turningSpeedModifierPercentageWithMods: 10
        }
        : undefined,
      ricochetChance: 'Low',
      turningSpeedModifierPercentage: 1
    } as IHeadwear

    let sortingData: SortingData<IItem> | undefined = new SortingData()
    const sortingService = new SortingService()
    sortingData = sortingService.setSortingProperty(sortingData, HeadwearSortingFunctions, property)

    // Act
    const sortedItems = await sortingService.sort([item1, item2], sortingData!)

    // Assert
    expect(sortedItems).toStrictEqual([item2, item1])
  })
})