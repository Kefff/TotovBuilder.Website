import { describe, expect, it } from 'vitest'
import { IArmorMod } from '../../../../models/item/IArmorMod'
import { IItem } from '../../../../models/item/IItem'
import SortingData from '../../../../models/utils/SortingData'
import { SortingService } from '../../../../services/sorting/SortingService'
import { ArmorModSortingFunctions } from '../../../../services/sorting/functions/ArmorModSortingFunctions'

describe('setSortingProperty()', () => {
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
  ])('should sort by a property', async (property: string, isPreset: boolean) => {
    // Arrange
    const item1 = {
      armorClass: 2,
      categoryId: 'cat',
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
      categoryId: 'cat',
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

    let sortingData: SortingData<IItem> | undefined = new SortingData()
    const sortingService = new SortingService()
    sortingData = sortingService.setSortingProperty(sortingData, ArmorModSortingFunctions, property)

    // Act
    const sortedItems = await sortingService.sort([item1, item2], sortingData!)

    // Assert
    expect(sortedItems).toStrictEqual([item2, item1])
  })
})