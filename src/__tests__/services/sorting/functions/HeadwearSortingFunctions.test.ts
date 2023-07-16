import { IHeadwear } from '../../../../models/item/IHeadwear'
import { SortingService } from '../../../../services/sorting/SortingService'
import { HeadwearSortingFunctions } from '../../../../services/sorting/functions/HeadwearSortingFunctions'
import { describe, expect, it } from 'vitest'

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
    ['ergonomicsPercentageModifier', false],
    ['ergonomicsPercentageModifier', true],
    ['movementSpeedPercentageModifier', false],
    ['movementSpeedPercentageModifier', true],
    ['ricochetChance', false],
    ['ricochetChance', true],
    ['turningSpeedPercentageModifier', false],
    ['turningSpeedPercentageModifier', true]
  ])('should compare by a property', async (property: string, isPreset: boolean) => {
    // Arrange
    const item1 = {
      armorClass: 2,
      categoryId: 'cat',
      durability: 2,
      ergonomicsPercentageModifier: 2,
      movementSpeedPercentageModifier: 2,
      name: 'cat',
      presetWearableModifiers: isPreset
        ? {
          ergonomicsPercentageModifierWithMods: 20,
          movementSpeedPercentageModifierWithMods: 20,
          turningSpeedPercentageModifierWithMods: 20
        }
        : undefined,
      ricochetChance: 'High',
      turningSpeedPercentageModifier: 2
    } as IHeadwear

    const item2 = {
      armorClass: 1,
      categoryId: 'cat',
      durability: 1,
      ergonomicsPercentageModifier: 1,
      movementSpeedPercentageModifier: 1,
      name: 'cat',
      presetWearableModifiers: isPreset
        ? {
          ergonomicsPercentageModifierWithMods: 10,
          movementSpeedPercentageModifierWithMods: 10,
          turningSpeedPercentageModifierWithMods: 10
        }
        : undefined,
      ricochetChance: 'Low',
      turningSpeedPercentageModifier: 1
    } as IHeadwear

    const sortingService = new SortingService(HeadwearSortingFunctions)
    const updatedSortingDataResult = sortingService.setSortingProperty(property)

    // Act
    const sortedItems = await SortingService.sort([item1, item2], updatedSortingDataResult.value)

    // Assert
    expect(sortedItems).to.deep.equal([item2, item1])
  })
})