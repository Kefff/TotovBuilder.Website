import { describe, expect, it } from 'vitest'
import { IMagazine } from '../../../../models/item/IMagazine'
import ItemSortingData from '../../../../models/utils/ItemSortingData'
import { ItemSortingService } from '../../../../services/sorting/ItemSortingService'
import { MagazineSortingFunctions } from '../../../../services/sorting/functions/MagazineSortingFunctions'

describe('comparisonFunction()', () => {
  it.each([
    ['checkSpeedModifierPercentage', false],
    ['checkSpeedModifierPercentage', true],
    ['ergonomicsModifier', false],
    ['ergonomicsModifier', true],
    ['loadSpeedModifierPercentage', false],
    ['loadSpeedModifierPercentage', true]
  ])('should compare by a property', async (property: string, isPreset: boolean) => {
    // Arrange
    const item1 = {
      categoryId: 'cat',
      checkSpeedModifierPercentage: 2,
      ergonomicsModifier: 2,
      presetErgonomicsModifier: isPreset ? 2 : undefined,
      loadSpeedModifierPercentage: 2
    } as IMagazine

    const item2 = {
      categoryId: 'cat',
      checkSpeedModifierPercentage: 1,
      ergonomicsModifier: 1,
      presetErgonomicsModifier: isPreset ? 1 : undefined,
      loadSpeedModifierPercentage: 1
    } as IMagazine

    let sortingData: ItemSortingData | undefined = new ItemSortingData()
    const sortingService = new ItemSortingService()
    sortingData = sortingService.setSortingProperty(sortingData, MagazineSortingFunctions, property)

    // Act
    const sortedItems = await sortingService.sort([item1, item2], sortingData!)

    // Assert
    expect(sortedItems).toStrictEqual([item2, item1])
  })
})