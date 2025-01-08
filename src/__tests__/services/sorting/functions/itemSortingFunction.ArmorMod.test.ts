import { describe, expect, it } from 'vitest'
import { IArmorMod } from '../../../../models/item/IArmorMod'
import { ItemCategoryId } from '../../../../models/item/IItem'
import FilterAndSortingData from '../../../../models/utils/FilterAndSortingData'
import ItemFilterAndSortingData from '../../../../models/utils/ItemFilterAndSortingData'
import { SortingService } from '../../../../services/sorting/SortingService'
import { ArmorModSortingFunctions } from '../../../../services/sorting/functions/itemSortingFunctions'

describe('comparisonFunction()', () => {
  it.each([
    ['armorClass', false],
    ['armorClass', true],
    ['durability', false],
    ['durability', true],
    ['ergonomicsModifierPercentage', false],
    ['ergonomicsModifierPercentage', true],
    ['movementSpeedModifierPercentage', false],
    ['movementSpeedModifierPercentage', true],
    ['turningSpeedModifierPercentage', false],
    ['turningSpeedModifierPercentage', true]
  ])('should sort by %s (preset: %s)', async (property: string, isPreset: boolean) => {
    // Arrange
    const item1 = {
      armorClass: 2,
      categoryId: ItemCategoryId.armorMod,
      durability: 2,
      ergonomicsModifierPercentage: 2,
      movementSpeedModifierPercentage: 2,
      presetWearableModifiers: isPreset
        ? {
          ergonomicsModifierPercentageWithMods: 20,
          movementSpeedModifierPercentageWithMods: 20,
          turningSpeedModifierPercentageWithMods: 20
        }
        : undefined,
      turningSpeedModifierPercentage: 2
    } as IArmorMod

    const item2 = {
      armorClass: 1,
      categoryId: ItemCategoryId.armorMod,
      durability: 1,
      ergonomicsModifierPercentage: 1,
      movementSpeedModifierPercentage: 1,
      presetWearableModifiers: isPreset
        ? {
          ergonomicsModifierPercentageWithMods: 10,
          movementSpeedModifierPercentageWithMods: 10,
          turningSpeedModifierPercentageWithMods: 10
        }
        : undefined,
      turningSpeedModifierPercentage: 1
    } as IArmorMod

    const sortingService = new SortingService()
    let sortingData: FilterAndSortingData<IArmorMod> | undefined = new ItemFilterAndSortingData(ArmorModSortingFunctions)
    sortingData = sortingService.setSortingProperty(sortingData, property)

    // Act
    const sortedItems = await sortingService.sortAsync([item1, item2], sortingData!)

    // Assert
    expect(sortedItems).toStrictEqual([item2, item1])
  })
})