import { round } from 'round-ts'
import { TarkovValuesService } from '../services/TarkovValuesService'
import Services from '../services/repository/Services'

/**
 * Represents an utility class for manipulating item stats values.
 */
export default class StatsUtils {
  /**
   * Gets the text to display for a stats value.
   * @param value - Value.
   * @param isBonusMalus - Indicates whether the value is a bonus or malus and thus requires that a '+' sign be displayed when it is greater than 0. false by default.
   * @param decimalNumbers - Maximal number of decimal numbers. The value is rounded to respect it. 1 by default.
   * @param fixedDecimalNumbers - Number of decimal numbers to display. Zeros are added to atteign the desired decimal numbers when needed. Undefined by default.
   * @param language - Language in which the value must be localized. By default, take the language of the browser.
   * @returns Caption.
   */
  public static getDisplayValue(
    value: number,
    isBonusMalus: boolean = false,
    decimalNumbers: number = 1,
    fixedDecimalNumbers: number | undefined = undefined,
    language: string | undefined = undefined) {
    language ??= navigator.language

    let displayValue: string
    value = round(value, decimalNumbers)

    if (fixedDecimalNumbers != null) {
      const roundingMultiplier = Math.pow(10, fixedDecimalNumbers)
      displayValue = (Math.round(value * roundingMultiplier) / roundingMultiplier)
        .toLocaleString(
          language,
          {
            minimumFractionDigits: fixedDecimalNumbers,
            maximumFractionDigits: fixedDecimalNumbers
          })
    } else {
      displayValue = value.toLocaleString(language)
    }

    if (isBonusMalus && value > 0) {
      displayValue = '+' + displayValue
    }

    return displayValue
  }

  /**
   * Gets the text to display for a stats percentage.
   * @param value - Value corresponding to a percentage.
   * @param isBonusMalus - Indicates whether hte value is a bonus or malus an thus requires a '+' sign be displayed when it is greater than 0. false by default.
   * @param decimalNumbers - Maximal number of decimal numbers. The value is rounded to respect it. 1 by default.
   * @param fixedDecimalNumbers - Number of decimal numbers to display. Zeros are added to atteign the desired decimal numbers when needed. Undefined by default.
   * @param language - Language in which the value must be localized. By default, take the language of the browser.
   * @returns
   */
  public static getPercentageDisplayValue(
    value: number,
    isBonusMalus: boolean = false,
    decimalNumbers: number = 1,
    fixedDecimalNumbers: number | undefined = undefined,
    language: string | undefined = undefined): string {
    language ??= navigator.language

    let displayValue: string
    value = round(value * 100, decimalNumbers)

    if (fixedDecimalNumbers != null) {
      const roundingMultiplier = Math.pow(10, fixedDecimalNumbers)
      displayValue = (Math.round(value * roundingMultiplier) / roundingMultiplier)
        .toLocaleString(
          language,
          {
            minimumFractionDigits: fixedDecimalNumbers,
            maximumFractionDigits: fixedDecimalNumbers
          })
    } else {
      displayValue = value.toLocaleString(language)
    }

    displayValue += '%'

    if (isBonusMalus && value > 0) {
      displayValue = '+' + displayValue
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
