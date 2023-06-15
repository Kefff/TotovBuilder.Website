import { IHeadwear } from '../../../../models/item/IHeadwear'
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
    ['ergonomicsPercentageModifier', false],
    ['ergonomicsPercentageModifier', true],
    ['ricochetChance', false],
    ['ricochetChance', true]
  ])('should compare by a property', async (property: string, isPreset: boolean) => {
    // Arrange
    const item1 = {
      armorClass: 2,
      categoryId: 'cat',
      durability: 2,
      ergonomicsPercentageModifier: 2,
      name: 'cat',
      presetErgonomicsPercentageModifier: isPreset ? 10 : undefined,
      ricochetChance: 'High'
    } as IHeadwear

    const item2 = {
      armorClass: 1,
      categoryId: 'cat',
      durability: 1,
      ergonomicsPercentageModifier: 1,
      name: 'cat',
      presetErgonomicsPercentageModifier: isPreset ? 20 : undefined,
      ricochetChance: 'Low'
    } as IHeadwear

    const sortingService = new SortingService(HeadwearSortingFunctions)
    const updatedSortingDataResult = sortingService.setSortingProperty(property)

    // Act
    const sortedItems = await SortingService.sort([item1, item2], updatedSortingDataResult.value)

    // Assert
    expect(sortedItems).toStrictEqual([item2, item1])
  })
})