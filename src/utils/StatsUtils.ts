import { round } from 'round-ts'
import Services from '../services/repository/Services'
import { TarkovValuesService } from '../services/TarkovValuesService'

/**
 * Represents an utility class for manipulating item stats values.
 */
export default class StatsUtils {
  /**
   * Gets the text to display for a stats value.
   * @param value - Value.
   * @param isBonusMalus - Indicates whether the value is a bonus or malus and thus requires that a '+' or '-' sign be displayed.
   * @param isPercentage - Indicates whether the value is a percentage or not ans thus requires that the values must be multiplyed by 100 and that a '%' sign be displayed.
   * @returns Caption.
   */
  public static getDisplayValue(value: number, isBonusMalus: boolean, isPercentage: boolean): string {
    let displayValue: string

    if (isPercentage) {
      value = round(value * 100)
    }

    if (isBonusMalus && value > 0) {
      displayValue = '+' + value
    } else {
      displayValue = value.toString()
    }

    if (isPercentage) {
      displayValue = displayValue + '%'
    }

    return displayValue
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
    if (weight > Services.get(TarkovValuesService).values.heavyEncumbermentWeight) {
      return 'stats-encumberment-heavy'
    } else if (weight > Services.get(TarkovValuesService).values.lightEncumbermentWeight) {
      return 'stats-encumberment-light'
    }

    return ''
  }
}
