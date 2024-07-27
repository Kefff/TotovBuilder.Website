import { describe, expect, it } from 'vitest'
import { IItem } from '../../../../models/item/IItem'
import { IMod } from '../../../../models/item/IMod'
import SortingData from '../../../../models/utils/SortingData'
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

    let sortingData: SortingData<IItem> | undefined = new SortingData()
    const sortingService = new SortingService()
    sortingData = sortingService.setSortingProperty(sortingData, ModSortingFunctions, property)

    // Act
    const sortedItems = await sortingService.sort([item1, item2], sortingData!)

    // Assert
    expect(sortedItems).toStrictEqual([item2, item1])
  })
})