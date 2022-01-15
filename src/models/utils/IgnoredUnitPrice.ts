/**
 * Ignored unit price
 */
export enum IgnoredUnitPrice {
  /**
   * Not ignored.
   */
  notIgnored = 'notIgnored',

  /**
   * Ignored because it is in a slot that is not lootable
   */
  notLootable = 'notLootable',

  /**
   * Ignored because it is part of a preset.
   */
  inPreset = 'inPreset',

  /**
   * Manually ignored by the user.
   */
  manuallyIgnored = 'manuallyIgnored'
}