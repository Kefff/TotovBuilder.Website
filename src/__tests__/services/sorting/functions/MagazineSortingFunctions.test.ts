import { describe, expect, it } from 'vitest'
import { ItemCategoryId } from '../../../../models/item/IItem'
import { IMagazine } from '../../../../models/item/IMagazine'
import SortingData from '../../../../models/utils/SortingData'
import { SortingService } from '../../../../services/sorting/SortingService'
import { MagazineSortingFunctions } from '../../../../services/sorting/functions/MagazineSortingFunctions'

describe('comparisonFunction()', () => {
  it.each([
    ['checkSpeedModifierPercentage', false],
    ['checkSpeedModifierPercentage', true],
    ['ergonomicsModifier', false],
    ['ergonomicsModifier', true],
    ['loadSpeedModifierPercentage', false],
    ['loadSpeedModifierPercentage', true]
  ])('should sort by %s', async (property: string, isPreset: boolean) => {
    // Arrange
    const item1 = {
      categoryId: ItemCategoryId.magazine,
      checkSpeedModifierPercentage: 2,
      ergonomicsModifier: 2,
      presetErgonomicsModifier: isPreset ? 2 : undefined,
      loadSpeedModifierPercentage: 2
    } as IMagazine

    const item2 = {
      categoryId: ItemCategoryId.magazine,
      checkSpeedModifierPercentage: 1,
      ergonomicsModifier: 1,
      presetErgonomicsModifier: isPreset ? 1 : undefined,
      loadSpeedModifierPercentage: 1
    } as IMagazine

    let sortingData: SortingData<IMagazine> | undefined = new SortingData()
    const sortingService = new SortingService()
    sortingData = sortingService.setSortingProperty(sortingData, MagazineSortingFunctions, property)

    // Act
    const sortedItems = await sortingService.sortAsync([item1, item2], sortingData!)

    // Assert
    expect(sortedItems).toStrictEqual([item2, item1])
  })
})