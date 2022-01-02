import { IContainer } from '../../../../models/item/IContainer'
import { ContainerSortingFunctions } from '../../../../services/sorting/functions/ContainerSortingFunctions'

describe('setSortingProperty()', () => {
  it.each([['capacity']])('should sort by a property', async (property: string) => {
    // Arrange
    const item1 = {
      categoryId: 'cat',
      capacity: 1
    } as IContainer

    const item2 = {
      categoryId: 'cat',
      capacity: 2
    } as IContainer

    const sortingFunctions = new ContainerSortingFunctions()

    // Act
    const propertyValue1 = await sortingFunctions.getValueToCompareFunctions[property](item1)
    const propertyValue2 = await sortingFunctions.getValueToCompareFunctions[property](item2)
    const sortingValue = sortingFunctions.comparisonFunctions[property](item1, propertyValue1, item2, propertyValue2)

    // Assert
    expect(sortingValue).toBe(-1)
  })
})