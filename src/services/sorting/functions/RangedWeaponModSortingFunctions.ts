import { IItem } from '../../../models/item/IItem'
import { IRangedWeaponMod } from '../../../models/item/IRangedWeaponMod'
import { ISortingFunctions } from './ISortingFunctions'
import { ItemSortingFunctions } from './ItemSortingFunction'

/**
 * Represents a collection of functions for sorting ranged weapon mods.
 */
export class RangedWeaponModSortingFunctions implements ISortingFunctions {
  /**
   * {@inheritDoc ISortingFunctions.comparisonFunctions}
   */
  public comparisonFunctions: { [property: string]: (item1: IItem, item2ValueToCompare: string | number, item2: IItem, item1ValueToCompare: string | number) => number } = {
    ergonomicsModifier: ItemSortingFunctions.compareByNumber,
    recoilPercentageModifier: ItemSortingFunctions.compareByNumber,
    accuracyPercentageModifier: ItemSortingFunctions.compareByNumber
  }

  /**
   * {@inheritDoc ISortingFunctions.valueToCompareGettingFunctions}
   */
  public getValueToCompareFunctions: { [property: string]: (item: IItem) => (string | number) | Promise<string | number> } = {
    ergonomicsModifier: (item: IItem) => (item as IRangedWeaponMod).presetErgonomicsModifier ?? (item as IRangedWeaponMod).ergonomicsModifier,
    recoilPercentageModifier: (item: IItem) => (item as IRangedWeaponMod).recoilPercentageModifier,
    accuracyPercentageModifier: (item: IItem) => (item as IRangedWeaponMod).accuracyPercentageModifier
  }
}