import { describe, expect, it } from 'vitest'
import { IHeadwear } from '../../../../models/item/IHeadwear'
import { ItemCategoryId } from '../../../../models/item/IItem'
import FilterAndSortingData from '../../../../models/utils/FilterAndSortingData'
import { SortingService } from '../../../../services/sorting/SortingService'
import { HeadwearSortingFunctions } from '../../../../services/sorting/functions/itemSortingFunctions'

describe('comparisonFunction()', () => {
  it.each([
    [
      { categoryId: 'cat1' as unknown as ItemCategoryId, ricochetChance: 'Low', name: 'a' } as IHeadwear,
      { categoryId: 'cat2' as unknown as ItemCategoryId, ricochetChance: 'Low', name: 'a' } as IHeadwear,
      0
    ],
    [
      { categoryId: 'cat2' as unknown as ItemCategoryId, ricochetChance: 'Low', name: 'a' } as IHeadwear,
      { categoryId: 'cat1' as unknown as ItemCategoryId, ricochetChance: 'Low', name: 'a' } as IHeadwear,
      0
    ],
    [
      { categoryId: ItemCategoryId.headwear, ricochetChance: 'Low', name: 'a' } as IHeadwear,
      { categoryId: ItemCategoryId.headwear, ricochetChance: 'High', name: 'a' } as IHeadwear,
      -2
    ],
    [
      { categoryId: ItemCategoryId.headwear, ricochetChance: 'High', name: 'a' } as IHeadwear,
      { categoryId: ItemCategoryId.headwear, ricochetChance: 'Low', name: 'a' } as IHeadwear,
      2
    ],
    [
      { categoryId: ItemCategoryId.headwear, ricochetChance: 'Low', name: 'a' } as IHeadwear,
      { categoryId: ItemCategoryId.headwear, ricochetChance: 'Low', name: 'b' } as IHeadwear,
      -1
    ],
    [
      { categoryId: ItemCategoryId.headwear, ricochetChance: 'Low', name: 'b' } as IHeadwear,
      { categoryId: ItemCategoryId.headwear, ricochetChance: 'Low', name: 'a' } as IHeadwear,
      1
    ],
    [
      { categoryId: ItemCategoryId.headwear, ricochetChance: '', name: 'a' } as IHeadwear,
      { categoryId: ItemCategoryId.headwear, ricochetChance: '', name: 'a' } as IHeadwear,
      0
    ]
  ])('should compare by ricochet chance and name', async (headwear1: IHeadwear, headwear2: IHeadwear, expected: number) => {
    // Arrange
    const propertyValue1 = await HeadwearSortingFunctions.functions['ricochetChance'].comparisonValueObtentionPromise(headwear1)
    const propertyValue2 = await HeadwearSortingFunctions.functions['ricochetChance'].comparisonValueObtentionPromise(headwear2)

    // Act
    const sortingValue = HeadwearSortingFunctions.functions['ricochetChance'].comparisonFunction(headwear1, propertyValue1, headwear2, propertyValue2)

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
  ])('should sort by %s (preset: %s)', async (property: string, isPreset: boolean) => {
    // Arrange
    const item1 = {
      armorClass: 2,
      categoryId: ItemCategoryId.headwear,
      durability: 2,
      ergonomicsModifierPercentage: 2,
      movementSpeedModifierPercentage: 2,
      name: 'name',
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
      categoryId: ItemCategoryId.headwear,
      durability: 1,
      ergonomicsModifierPercentage: 1,
      movementSpeedModifierPercentage: 1,
      name: 'name',
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

    let sortingData: FilterAndSortingData<IHeadwear> | undefined = new FilterAndSortingData(HeadwearSortingFunctions)
    const sortingService = new SortingService()
    sortingService.setSortingProperty(sortingData, property)

    // Act
    const sortedItems = await sortingService.sortAsync([item1, item2], sortingData!)

    // Assert
    expect(sortedItems).toStrictEqual([item2, item1])
  })
})