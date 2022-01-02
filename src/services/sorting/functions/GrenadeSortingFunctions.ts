import { IAmmunition } from '../../../models/item/IAmmunition'
import { IGrenade } from '../../../models/item/IGrenade'
import { IItem } from '../../../models/item/IItem'
import { ItemService } from '../../ItemService'
import { NotificationService, NotificationType } from '../../NotificationService'
import Services from '../../repository/Services'
import { ISortingFunctions } from './ISortingFunctions'
import { ItemSortingFunctions } from './ItemSortingFunction'

/**
 * Represents a collection of functions for sorting grenades.
 */
export class GrenadeSortingFunctions implements ISortingFunctions {
  /**
   * {@inheritDoc ISortingFunctions.comparisonFunctions}
   */
  public comparisonFunctions: { [property: string]: (item1: IItem, item2ValueToCompare: string | number, item2: IItem, item1ValueToCompare: string | number) => number } = {
    fleshDamage: ItemSortingFunctions.compareByNumber,
    explosionDelay: ItemSortingFunctions.compareByNumber,
    maximumExplosionRange: ItemSortingFunctions.compareByNumber,
    fragmentsAmount: ItemSortingFunctions.compareByNumber
  }

  /**
   * {@inheritDoc ISortingFunctions.valueToCompareGettingFunctions}
   */
  public getValueToCompareFunctions: { [property: string]: (item: IItem) => (string | number) | Promise<string | number> } = {
    fleshDamage: (item: IItem) => this.getFleshDamage(item),
    explosionDelay: (item: IItem) => (item as IGrenade).explosionDelay,
    maximumExplosionRange: (item: IItem) => (item as IGrenade).maximumExplosionRange,
    fragmentsAmount: (item: IItem) => (item as IGrenade).fragmentsAmount
  }

  /**
   * Gets the flesh damage of a grenade to compare.
   * @param item - Item.
   * @returns Flesh damage.
   */
  private async getFleshDamage(item: IItem): Promise<number> {
    const grenade = item as IGrenade
    let fleshDamage = 0

    if (grenade.fragmentsAmount > 0) {
      const ammunitionResult = await Services.get(ItemService).getItem(grenade.fragmentAmmunitionId)

      if (ammunitionResult.success) {
        fleshDamage = (ammunitionResult.value as IAmmunition).fleshDamage
      } else {
        Services.get(NotificationService).notify(NotificationType.error, ammunitionResult.failureMessage)
      }
    }

    return fleshDamage
  }
}