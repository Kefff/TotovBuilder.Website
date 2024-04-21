/**
 * Provides the functionalities of recoil value.
 * Specifically for inventory items, includes the dinstinction between with and without mods.
 */
export interface IInventoryItemRecoil {
  /**
   * Horizontal recoil.
   */
  horizontalRecoil: number

  /**
   * Horizontal recoil with mods.
   */
  horizontalRecoilWithMods: number

  /**
   * Vertical recoil.
   */
  verticalRecoil: number

  /**
   * Vertical recoil with mods.
   */
  verticalRecoilWithMods: number
}