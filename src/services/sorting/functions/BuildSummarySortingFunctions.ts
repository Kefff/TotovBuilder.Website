import { IBuildSummary } from '../../../models/utils/IBuildSummary'
import { compareByNumber, compareByString } from '../SortingService'
import { ISortingFunctionList } from './SortingFunctionList'

/**
 * Functions for sorting build summaries.
 */
export const BuildSummarySortingFunctions: ISortingFunctionList<IBuildSummary> = {
  armorClass: {
    comparisonFunction: (bs1, bs1v, bs2, bs2v) => compareByNumber(
      bs1 as unknown as Record<string, unknown>,
      bs1v,
      bs2 as unknown as Record<string, unknown>,
      bs2v),
    comparisonValueObtentionFunction: bs => Promise.resolve(bs.armorModifiers.armorClass)
  },
  ergonomics: {
    comparisonFunction: (bs1, bs1v, bs2, bs2v) => compareByNumber(
      bs1 as unknown as Record<string, unknown>,
      bs1v,
      bs2 as unknown as Record<string, unknown>,
      bs2v),
    comparisonValueObtentionFunction: bs => Promise.resolve(bs.ergonomics)
  },
  name: {
    comparisonFunction: (bs1, bs1v, bs2, bs2v) => compareByString(
      bs1 as unknown as Record<string, unknown>,
      bs1v,
      bs2 as unknown as Record<string, unknown>,
      bs2v),
    comparisonValueObtentionFunction: bs => Promise.resolve(bs.name)
  },
  price: {
    comparisonFunction: (bs1, bs1v, bs2, bs2v) => compareByNumber(
      bs1 as unknown as Record<string, unknown>,
      bs1v,
      bs2 as unknown as Record<string, unknown>,
      bs2v),
    comparisonValueObtentionFunction: bs => Promise.resolve(bs.price.priceInMainCurrency)
  },
  recoil: {
    comparisonFunction: (bs1, bs1v, bs2) => {
      let comparisonResult = bs1.recoil.verticalRecoil - bs2.recoil.verticalRecoil

      if (comparisonResult === 0) {
        comparisonResult = compareByNumber(bs1 as unknown as Record<string, unknown>, bs1.recoil.horizontalRecoil, bs2 as unknown as Record<string, unknown>, bs2.recoil.horizontalRecoil)
      }

      return comparisonResult
    },
    comparisonValueObtentionFunction: () => Promise.resolve(0)
  },
  weight: {
    comparisonFunction: (bs1, bs1v, bs2, bs2v) => compareByNumber(
      bs1 as unknown as Record<string, unknown>,
      bs1v,
      bs2 as unknown as Record<string, unknown>,
      bs2v),
    comparisonValueObtentionFunction: bs => Promise.resolve(bs.weight)
  }
}