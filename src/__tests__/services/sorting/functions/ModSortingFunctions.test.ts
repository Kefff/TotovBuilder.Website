import { describe, expect, it } from 'vitest'
import { IMod } from '../../../../models/item/IMod'
import { SortingService } from '../../../../services/sorting/SortingService'
import { ModSortingFunctions } from '../../../../services/sorting/functions/ModSortingFunctions'

describe('comparisonFunction()', () => {
  it.each([
    ['ergonomicsModifier', false],
    ['ergonomicsModifier', true]
  ])('should compare by a property', async (property: string, isPreset: boolean) => {
    // Arrange
    const item1 = {
      categoryId: 'cat',
      ergonomicsModifier: 2,
      presetErgonomicsModifier: isPreset ? 2 : undefined
    } as IMod

    const item2 = {
      categoryId: 'cat',
      ergonomicsModifier: 1,
      presetErgonomicsModifier: isPreset ? 1 : undefined
    } as IMod

    const sortingService = new SortingService(ModSortingFunctions)
    const updatedSortingData = sortingService.setSortingProperty(property)

    // Act
    const sortedItems = await SortingService.sort([item1, item2], updatedSortingData!)

    // Assert
    expect(sortedItems).toStrictEqual([item2, item1])
  })
})