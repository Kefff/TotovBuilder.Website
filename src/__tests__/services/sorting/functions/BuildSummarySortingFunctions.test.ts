import { describe, expect, it } from 'vitest'
import { IBuildSummary } from '../../../../models/utils/IBuildSummary'
import SortingData from '../../../../models/utils/SortingData'
import { SortingOrder } from '../../../../models/utils/SortingOrder'
import { SortingService } from '../../../../services/sorting/SortingService'
import { BuildSummarySortingFunctions } from '../../../../services/sorting/functions/BuildSummarySortingFunctions'

describe('comparisonFunction()', () => {
  it.each([
    ['armorClass'],
    ['ergonomics'],
    ['name'],
    ['price'],
    ['recoil'],
    ['weight']
  ])('should sort by %s', async (property: string) => {
    // Arrange
    const buildSummary1 = {
      armorModifiers: {
        armorClass: 3
      },
      ergonomics: 3,
      name: 'd',
      price: {
        priceInMainCurrency: 3
      },
      recoil: {
        horizontalRecoil: 3,
        verticalRecoil: 3
      },
      weight: 3
    } as IBuildSummary

    const buildSummary2 = {
      armorModifiers: {
        armorClass: 3
      },
      ergonomics: 3,
      name: 'c',
      price: {
        priceInMainCurrency: 3
      },
      recoil: {
        horizontalRecoil: 2,
        verticalRecoil: 1
      },
      weight: 3
    } as IBuildSummary

    const buildSummary3 = {
      armorModifiers: {
        armorClass: 2
      },
      ergonomics: 2,
      name: 'b',
      price: {
        priceInMainCurrency: 2
      },
      recoil: {
        horizontalRecoil: 2,
        verticalRecoil: 1
      },
      weight: 2
    } as IBuildSummary

    const buildSummary4 = {
      armorModifiers: {
        armorClass: 1
      },
      ergonomics: 1,
      name: 'a',
      price: {
        priceInMainCurrency: 1
      },
      recoil: {
        horizontalRecoil: 1,
        verticalRecoil: 1
      },
      weight: 1
    } as IBuildSummary

    let sortingData: SortingData<IBuildSummary> | undefined = new SortingData(BuildSummarySortingFunctions)
    const sortingService = new SortingService()
    sortingService.setSortingProperty(sortingData, property, SortingOrder.asc)

    // Act
    const sortedItems = await sortingService.sortAsync([buildSummary1, buildSummary2, buildSummary3, buildSummary4], sortingData!)

    // Assert
    expect(sortedItems).toStrictEqual([buildSummary4, buildSummary3, buildSummary2, buildSummary1])
  })
})