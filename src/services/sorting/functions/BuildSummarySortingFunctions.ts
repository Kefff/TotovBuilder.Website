import { compareByNumber, compareByString } from '../SortingService'
import { IBuildSortingFunctionList } from './ISortingFunctionList'

/**
 * Functions for sorting build summaries.
 */
export const BuildSummarySortingFunctions: IBuildSortingFunctionList = {
  functions: {
    armorClass: {
      comparisonFunction: (bs1, bs1v, bs2, bs2v) => compareByNumber(
        bs1 as unknown as Record<string, unknown>,
        bs1v,
        bs2 as unknown as Record<string, unknown>,
        bs2v),
      comparisonValueObtentionPromise: bs => Promise.resolve(bs.armorModifiers.armorClass)
    },
    ergonomics: {
      comparisonFunction: (bs1, bs1v, bs2, bs2v) => compareByNumber(
        bs1 as unknown as Record<string, unknown>,
        bs1v,
        bs2 as unknown as Record<string, unknown>,
        bs2v),
      comparisonValueObtentionPromise: bs => Promise.resolve(bs.ergonomics)
    },
    name: {
      comparisonFunction: (bs1, bs1v, bs2, bs2v) => compareByString(
        bs1 as unknown as Record<string, unknown>,
        bs1v,
        bs2 as unknown as Record<string, unknown>,
        bs2v),
      comparisonValueObtentionPromise: bs => Promise.resolve(bs.name)
    },
    price: {
      comparisonFunction: (bs1, bs1v, bs2, bs2v) => compareByNumber(
        bs1 as unknown as Record<string, unknown>,
        bs1v,
        bs2 as unknown as Record<string, unknown>,
        bs2v),
      comparisonValueObtentionPromise: bs => Promise.resolve(bs.price.priceInMainCurrency)
    },
    recoil: {
      comparisonFunction: (bs1, bs1v, bs2) => {
        let comparisonResult = bs1.recoil.verticalRecoil - bs2.recoil.verticalRecoil

        if (comparisonResult === 0) {
          comparisonResult = compareByNumber(bs1 as unknown as Record<string, unknown>, bs1.recoil.horizontalRecoil, bs2 as unknown as Record<string, unknown>, bs2.recoil.horizontalRecoil)
        }

        return comparisonResult
      },
      comparisonValueObtentionPromise: () => Promise.resolve(0)
    },
    weight: {
      comparisonFunction: (bs1, bs1v, bs2, bs2v) => compareByNumber(
        bs1 as unknown as Record<string, unknown>,
        bs1v,
        bs2 as unknown as Record<string, unknown>,
        bs2v),
      comparisonValueObtentionPromise: bs => Promise.resolve(bs.weight)
    }
  }
}