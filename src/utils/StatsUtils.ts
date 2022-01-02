import * as TarkovValues from '../assets/data/tarkov-values.json'

/**
 * Represents an utility class for manipulating item stats values.
 */
export default class StatsUtils {
  /**
   * Gets the caption corresponding to a stats value.
   * @param value - Value.
   * @returns Caption.
   */
  public static getValueCaption(value: number): string {
    if (value > 0) {
      return '+' + value
    } else {
      return value.toString()
    }
  }

  /**
   * Gets the CSS color class to apply to a stats value that can be positive (green) or negative (red).
   * @param value - Value.
   * @param invert - Indicates whether a value lesser than 0 is considered to be a positive trait or not.
   * @returns CSS color class.
   */
  public static getValueColorClass(value: number, invert = false): string {
    if (value > 0) {
      return invert ? 'stats-value-negative' : 'stats-value-positive'
    } else if (value < 0) {
      return invert ? 'stats-value-positive' : 'stats-value-negative'
    }

    return ''
  }

  /**
   * Gets the CSS color class to apply to a weight value.
   * @param weight - Weight.
   * @returns CSS color class.
   */
  public static getWeightColorClass(weight: number): string {
    if (weight > TarkovValues.heavyEncumbermentWeight) {
      return 'stats-encumberment-heavy'
    } else if (weight > TarkovValues.lighEncumbermentWeight) {
      return 'stats-encumberment-light'
    }

    return ''
  }
}