import { IBuildSummary } from '../../../models/utils/IBuildSummary'
import { compareByNumber, compareByString } from '../SortingService'
import { IBuildSortingFunctionList } from './ISortingFunctionList'

/**
 * Functions for sorting build summaries.
 */
export const BuildSummarySortingFunctions: IBuildSortingFunctionList = {
  functions: {
    armorClass: {
      comparisonFunction: (bs1, bs1v, bs2, bs2v) => compareByNumber(bs1, bs1v, bs2, bs2v),
      comparisonValueObtentionPromise: bs => Promise.resolve((bs as IBuildSummary).armorModifiers.armorClass),
      customIcon: undefined,
      icon: 'award'
    },
    ergonomics: {
      comparisonFunction: (bs1, bs1v, bs2, bs2v) => compareByNumber(bs1, bs1v, bs2, bs2v),
      comparisonValueObtentionPromise: bs => Promise.resolve((bs as IBuildSummary).ergonomics),
      customIcon: undefined,
      icon: 'hand-paper'
    },
    name: {
      comparisonFunction: (bs1, bs1v, bs2, bs2v) => compareByString(bs1, bs1v, bs2, bs2v),
      comparisonValueObtentionPromise: bs => Promise.resolve(bs.name),
      customIcon: undefined,
      icon: 'font'
    },
    price: {
      comparisonFunction: (bs1, bs1v, bs2, bs2v) => compareByNumber(bs1, bs1v, bs2, bs2v),
      comparisonValueObtentionPromise: bs => Promise.resolve((bs as IBuildSummary).price.priceInMainCurrency),
      customIcon: undefined,
      icon: 'ruble-sign'
    },
    recoil: {
      comparisonFunction: (bs1, bs1v, bs2) => {
        let comparisonResult = (bs1 as IBuildSummary).recoil.verticalRecoil - (bs2 as IBuildSummary).recoil.verticalRecoil

        if (comparisonResult === 0) {
          comparisonResult = compareByNumber(
            bs1,
            (bs1 as IBuildSummary).recoil.horizontalRecoil,
            bs2,
            (bs2 as IBuildSummary).recoil.horizontalRecoil)
        }

        return comparisonResult
      },
      comparisonValueObtentionPromise: () => Promise.resolve(0),
      customIcon: undefined,
      icon: 'arrows-alt'
    },
    weight: {
      comparisonFunction: (bs1, bs1v, bs2, bs2v) => compareByNumber(bs1, bs1v, bs2, bs2v),
      comparisonValueObtentionPromise: bs => Promise.resolve(bs.weight),
      customIcon: undefined,
      icon: 'weight-hanging'
    }
  }
}