import { IItem } from '../../../models/item/IItem'
import { SortingService } from '../../../services/sorting/SortingService'
import SortingData, { SortingOrder } from '../../../models/utils/SortingData'
import { ItemSortingFunctions } from '../../../services/sorting/functions/ItemSortingFunction'

describe('setSortingProperty()', () => {
  it.each([
    ['caption', SortingOrder.desc, -1],
    ['price', SortingOrder.asc, 2]
  ])('should set the sorting property and get the comparison function', async (property: string, expectedSortingOrder: SortingOrder, expectedComparisonResult: number) => {
    // Arrange
    const sortService = new SortingService([
      {
        comparisonFunctions: {
          caption: () => 1,
          price: () => 2
        },
        getValueToCompareFunctions: {
          caption: (item: IItem) => item.caption,
          price: (item: IItem) => item.prices[0].valueInMainCurrency
        }
      }
    ])

    // Act
    const sortingDataResult = sortService.setSortingProperty(sortingData, property)

    // Assert
    expect(sortingDataResult.success).toBe(true)
    expect(sortingDataResult.value.property).toBe(property)
    expect(sortingDataResult.value.order).toBe(expectedSortingOrder)
    expect(sortingDataResult.value.comparisonFunction({} as IItem, 0, {} as IItem, 0)).toBe(expectedComparisonResult)
  })

  it('should fail when no comparison function is configured for the property', () => {
    // Arrange
    const sortService = new SortingService([{ comparisonFunctions: {}, getValueToCompareFunctions: {} }])

    // Act
    const sortingDataResult = sortService.setSortingProperty(sortingData, 'invalid')

    // Assert
    expect(sortingDataResult.success).toBe(false)
    expect(sortingDataResult.failureMessage).toBe('Sorting function for property "invalid" not found.')
  })
})

describe('sort()', () => {
  it('should sort an array or items', async () => {
    // Arrange
    const items = [
      { categoryId: 'cat1', caption: '5' } as IItem,
      { categoryId: 'cat1', caption: '6' } as IItem,
      { categoryId: 'cat1', caption: '6' } as IItem,
      { categoryId: 'cat1', caption: '2' } as IItem,
      { categoryId: 'cat1', caption: '9' } as IItem
    ]
    const sortingData = new SortingData()
    sortingData.comparisonFunction = ItemSortingFunctions.compareByString
    sortingData.getValueToCompareFunction = (item: IItem) => item.caption

    // Act
    const result = await SortingService.sort(items, sortingData)

    // Assert
    expect(result).toStrictEqual([
      { categoryId: 'cat1', caption: '2' } as IItem,
      { categoryId: 'cat1', caption: '5' } as IItem,
      { categoryId: 'cat1', caption: '6' } as IItem,
      { categoryId: 'cat1', caption: '6' } as IItem,
      { categoryId: 'cat1', caption: '9' } as IItem
    ])
  })
})

const sortingData: SortingData = {
  property: 'caption',
  order: SortingOrder.asc,
  comparisonFunction: () => 0,
  getValueToCompareFunction: (item: IItem) => item.caption
}