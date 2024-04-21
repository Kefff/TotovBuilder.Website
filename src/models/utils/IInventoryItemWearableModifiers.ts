/**
 * Provides the functionalities of modifiers obtained from wearable items.
 * Specifically for inventory items, includes the dinstinction between with and without mods.
 */
export interface IInventoryItemWearableModifiers {
  /**
     * Ergonomics percentage modifier.
     */
  ergonomicsPercentageModifier: number

  /**
   * Ergonomics percentage modifier with mods.
   */
  ergonomicsPercentageModifierWithMods: number

  /**
   * Movement speed percentage modifier.
   */
  movementSpeedPercentageModifier: number

  /**
   * Movement speed percentage modifier with mods.
   */
  movementSpeedPercentageModifierWithMods: number

  /**
   * Turning speed percentage modifier.
   */
  turningSpeedPercentageModifier: number

  /**
   * Turning speed percentage modifier with mods.
   */
  turningSpeedPercentageModifierWithMods: number
}