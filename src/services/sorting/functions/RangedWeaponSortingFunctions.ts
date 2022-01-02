import { IItem } from '../../../models/item/IItem'
import { IRangedWeapon } from '../../../models/item/IRangedWeapon'
import { ISortingFunctions } from './ISortingFunctions'
import { ItemSortingFunctions } from './ItemSortingFunction'

/**
 * Represents a collection of functions for sorting ranged weapons.
 */
export class RangedWeaponSortingFunctions implements ISortingFunctions {
  /**
   * {@inheritDoc ISortingFunctions.comparisonFunctions}
   */
  public comparisonFunctions: { [property: string]: (item1: IItem, item2ValueToCompare: string | number, item2: IItem, item1ValueToCompare: string | number) => number } = {
    caliber: ItemSortingFunctions.compareByString,
    fireRate: ItemSortingFunctions.compareByNumber,
    ergonomics: ItemSortingFunctions.compareByNumber,
    verticalRecoil: ItemSortingFunctions.compareByNumber,
    horizontalRecoil: ItemSortingFunctions.compareByNumber
  }

  /**
   * {@inheritDoc ISortingFunctions.valueToCompareGettingFunctions}
   */
  public getValueToCompareFunctions: { [property: string]: (item: IItem) => (string | number) | Promise<string | number> } = {
    caliber: (item: IItem) => (item as IRangedWeapon).caliber,
    fireRate: (item: IItem) => (item as IRangedWeapon).fireRate,
    ergonomics: (item: IItem) => (item as IRangedWeapon).ergonomics,
    verticalRecoil: (item: IItem) => (item as IRangedWeapon).verticalRecoil,
    horizontalRecoil: (item: IItem) => (item as IRangedWeapon).horizontalRecoil
  }
}