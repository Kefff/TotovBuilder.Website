/**
 * Provides the functionalities of a mod slot.
 */
export interface IModSlot {
  /**
   * IDs of compatible items.
   */
  compatibleItemIds: string[]

  /**
    * ID.
    */
  id: string

  /**
   * Maximum number of times the item can be stacked in this mod slot.
   * Mainly used to force the ammunition quantity to 1 in the special chamber mod slot.
   */
  maxStackableAmount: number

  /**
    * Name.
    */
  name: string

  /**
    * Determines whether having an item in the mod slot is required for the parent item to be usable.
    */
  required: boolean
}