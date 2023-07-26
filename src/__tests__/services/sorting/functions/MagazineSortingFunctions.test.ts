import { IMagazine } from '../../../../models/item/IMagazine'
import { SortingService } from '../../../../services/sorting/SortingService'
import { MagazineSortingFunctions } from '../../../../services/sorting/functions/MagazineSortingFunctions'
import { describe, expect, it } from 'vitest'

describe('comparisonFunction()', () => {
  it.each([
    ['checkSpeedPercentageModifier', false],
    ['checkSpeedPercentageModifier', true],
    ['ergonomicsModifier', false],
    ['ergonomicsModifier', true],
    ['loadSpeedPercentageModifier', false],
    ['loadSpeedPercentageModifier', true]
  ])('should compare by a property', async (property: string, isPreset: boolean) => {
    // Arrange
    const item1 = {
      categoryId: 'cat',
      checkSpeedPercentageModifier: 2,
      ergonomicsModifier: 2,
      presetErgonomicsModifier: isPreset ? 2 : undefined,
      loadSpeedPercentageModifier: 2
    } as IMagazine

    const item2 = {
      categoryId: 'cat',
      checkSpeedPercentageModifier: 1,
      ergonomicsModifier: 1,
      presetErgonomicsModifier: isPreset ? 1 : undefined,
      loadSpeedPercentageModifier: 1
    } as IMagazine

    const sortingService = new SortingService(MagazineSortingFunctions)
    const updatedSortingDataResult = sortingService.setSortingProperty(property)

    // Act
    const sortedItems = await SortingService.sort([item1, item2], updatedSortingDataResult.value)

    // Assert
    expect(sortedItems).toStrictEqual([item2, item1])
  })
})