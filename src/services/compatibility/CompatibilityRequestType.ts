/**
 * Compatibility request type.
 */
export enum CompatibilityRequestType {
  /**
   * Compatibility test for allowing an armor in a build.
   */
  armor = 'armor',

  /**
   * Compatibility test for allowing a mod on a ranged weapon or an armor.
   */
  mod = 'mod',

  /**
   * Compatibility test for allowing a tactical rig in a build.
   */
  tacticalRig = 'tacticalRig',
}