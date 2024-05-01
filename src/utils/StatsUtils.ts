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
   * @param roundingDecimalCount - Number of decimal places to which the value must be rounded.
   * @param fixedDecimalCount - Number of decimal places to display. Zeros are added to atteign the desired decimal numbers when needed. 0 by default.
   * @param language - Language in which the value must be localized. By default, take the language of the browser.
   * @returns Caption.
   */
  public static getDisplayValue(
    value: number,
    isBonusMalus: boolean,
    roundingDecimalCount: number,
    fixedDecimalCount: number = 0,
    language: string | undefined = navigator.language): string {
    let displayValue: string
    value = round(value, roundingDecimalCount)

    if (fixedDecimalCount !== 0) {
      const roundingMultiplier = Math.pow(10, fixedDecimalCount)
      displayValue = (Math.round(value * roundingMultiplier) / roundingMultiplier)
        .toLocaleString(
          language,
          {
            minimumFractionDigits: fixedDecimalCount,
            maximumFractionDigits: fixedDecimalCount
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
   * @param roundDecimalCount - Number of decimal places to which the value must be rounded.
   * @param fixedDecimalNumbers - Number of decimal places to display. Zeros are added to atteign the desired decimal numbers when needed. 0 by default.
   * @param language - Language in which the value must be localized. By default, take the language of the browser.
   * @returns
   */
  public static getPercentageDisplayValue(
    value: number,
    isBonusMalus: boolean,
    roundDecimalCount: number,
    fixedDecimalNumbers: number = 0,
    language: string | undefined = navigator.language): string {
    let displayValue: string
    value = round(value * 100, roundDecimalCount)

    if (fixedDecimalNumbers !== 0) {
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
   * Gets a value display value in the standard format associated with the type of the value.
   * @param type - Type of value to display.
   * @param value - Value to display.
   * * @param language - Language in which the value must be localized. By default, take the language of the browser.
   * @returns Display value in the standard format associated with the type of value.
   */
  public static getStandardDisplayValue(type: DisplayValueType, value: number, language: string | undefined = navigator.language): string {
    switch (type) {
      case DisplayValueType.armorClass:
      case DisplayValueType.ergonomics:
      case DisplayValueType.price:
      case DisplayValueType.recoil:
        return StatsUtils.getDisplayValue(value, false, 0, undefined, language)
      case DisplayValueType.armorDamagePercentage:
      case DisplayValueType.fragmentationChangePercentage:
        return StatsUtils.getPercentageDisplayValue(value, false, 1, undefined, language)
      case DisplayValueType.accuracyModifierPercentage:
      case DisplayValueType.bleedingChanceModifierPercentage:
      case DisplayValueType.blindnessProtectionPercentage:
      case DisplayValueType.checkSpeedModifierPercentage:
      case DisplayValueType.durabilityBurnModifierPercentage:
      case DisplayValueType.ergonomicsModifier:
      case DisplayValueType.ergonomicsModifierPercentage:
      case DisplayValueType.loadSpeedModifierPercentage:
      case DisplayValueType.movementSpeedModifierPercentage:
      case DisplayValueType.recoilModifierPercentage:
      case DisplayValueType.turningSpeedModifierPercentage:
        return StatsUtils.getPercentageDisplayValue(value, true, 1, undefined, language)
      case DisplayValueType.weight:
        return StatsUtils.getDisplayValue(value, false, 3, 3, language)
      default:
        return 'Error'
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
    if (weight > Services.get(TarkovValuesService).values.heavyEncumbermentWeight) {
      return 'stats-encumberment-heavy'
    } else if (weight > Services.get(TarkovValuesService).values.lightEncumbermentWeight) {
      return 'stats-encumberment-light'
    }

    return ''
  }
}


/**
 * Specifies the display value types
 */
export enum DisplayValueType {
  // Flat values
  armorClass,
  ergonomics,
  ergonomicsModifier,
  price,
  recoil,
  weight,

  // Percentages
  accuracyModifierPercentage,
  armorDamagePercentage,
  bleedingChanceModifierPercentage,
  blindnessProtectionPercentage,
  checkSpeedModifierPercentage,
  durabilityBurnModifierPercentage,
  ergonomicsModifierPercentage,
  fragmentationChangePercentage,
  loadSpeedModifierPercentage,
  movementSpeedModifierPercentage,
  recoilModifierPercentage,
  turningSpeedModifierPercentage,
}