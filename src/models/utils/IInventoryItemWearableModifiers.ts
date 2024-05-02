/**
 * Provides the functionalities of modifiers obtained from wearable items.
 * Specifically for inventory items, includes the dinstinction between with and without mods.
 */
export interface IInventoryItemWearableModifiers {
  /**
     * Ergonomics modifier percentage.
     */
  ergonomicsModifierPercentage: number

  /**
   * Ergonomics modifier percentage with mods.
   */
  ergonomicsModifierPercentageWithMods: number

  /**
   * Movement speed modifier percentage.
   */
  movementSpeedModifierPercentage: number

  /**
   * Movement speed modifier percentage with mods.
   */
  movementSpeedModifierPercentageWithMods: number

  /**
   * Turning speed modifier percentage.
   */
  turningSpeedModifierPercentage: number

  /**
   * Turning speed modifier percentage with mods.
   */
  turningSpeedModifierPercentageWithMods: number
}