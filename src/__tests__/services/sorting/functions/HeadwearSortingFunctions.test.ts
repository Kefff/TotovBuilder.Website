import { IHeadwear } from '../../../../models/item/IHeadwear'
import { HeadwearSortingFunctions } from '../../../../services/sorting/functions/HeadwearSortingFunctions'

describe('compareByRicochetChance()', () => {
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
    const sortingFunctions = new HeadwearSortingFunctions()
    const propertyValue1 = await sortingFunctions.getValueToCompareFunctions['ricochetChance'](headwear1)
    const propertyValue2 = await sortingFunctions.getValueToCompareFunctions['ricochetChance'](headwear2)

    // Act
    const sortingValue = sortingFunctions.comparisonFunctions['ricochetChance'](headwear1, propertyValue1, headwear2, propertyValue2)

    // Assert
    expect(sortingValue).toBe(expected)
  })
})

describe('setSortingProperty()', () => {
  it.each([['ricochetChance']])('should sort by a property', async (property: string) => {
    // Arrange
    const item1 = {
      categoryId: 'cat',
      name: 'cat',
      ricochetChance: 'High'
    } as IHeadwear

    const item2 = {
      categoryId: 'cat',
      name: 'cat',
      ricochetChance: 'Low'
    } as IHeadwear

    const sortingFunctions = new HeadwearSortingFunctions()

    // Act
    const propertyValue1 = await sortingFunctions.getValueToCompareFunctions[property](item1)
    const propertyValue2 = await sortingFunctions.getValueToCompareFunctions[property](item2)
    const sortingValue = sortingFunctions.comparisonFunctions[property](item1, propertyValue1, item2, propertyValue2)

    // Assert
    expect(sortingValue).toBe(2)
  })
})