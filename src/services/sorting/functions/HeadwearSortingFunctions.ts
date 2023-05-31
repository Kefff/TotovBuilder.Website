import { IHeadwear } from '../../../models/item/IHeadwear'
import { IItem } from '../../../models/item/IItem'
import { ISortingFunctions } from './ISortingFunctions'
import { ItemSortingFunctions } from './ItemSortingFunction'

/**
 * Represents a collection of functions for sorting headwear.
 */
export class HeadwearSortingFunctions implements ISortingFunctions {
  /**
   * {@inheritDoc ISortingFunctions.comparisonFunctions}
   */
  public comparisonFunctions: { [property: string]: (item1: IItem, item2ValueToCompare: string | number, item2: IItem, item1ValueToCompare: string | number) => number } = {
    armorClass: ItemSortingFunctions.compareByNumber,
    durability: ItemSortingFunctions.compareByNumber,
    ergonomicsPercentageModifier: ItemSortingFunctions.compareByNumber,
    ricochetChance: ItemSortingFunctions.compareByNumber
  }

  /**
   * {@inheritDoc ISortingFunctions.valueToCompareGettingFunctions}
   */
  public getValueToCompareFunctions: { [property: string]: (item: IItem) => (string | number) | Promise<string | number> } = {
    armorClass: (item: IItem) => (item as IHeadwear).armorClass,
    durability: (item: IItem) => (item as IHeadwear).durability,
    ergonomicsPercentageModifier: (item: IItem) => (item as IHeadwear).presetErgonomicsPercentageModifier ?? (item as IHeadwear).ergonomicsPercentageModifier,
    ricochetChance: (item: IItem) => this.getRicochetChange(item)
  }

  /**
   * Gets the ricochet chance of a headwear to compare.
   * @param item - Item.
   * @returns Ricochet chance.
   */
  private getRicochetChange(item: IItem): number {
    const values: { [property: string]: number } = {
      None: 0,
      Low: 1,
      Medium: 2,
      High: 3
    }
    const value = values[(item as IHeadwear).ricochetChance]

    return value
  }
}