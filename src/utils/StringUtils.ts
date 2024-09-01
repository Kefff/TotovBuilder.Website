import { BuildsToTextType } from '../models/utils/IBuildsToTextOptions'

/**
 * Represents an utility class for manipulating strings.
 */
export default class StringUtils {
  /**
   * Indicates whether a string contains another string without casing.
   * @param container - String that should contain the other string.
   * @param searchedString - String that should be contained in the string.
   * @returns True if the string is contained in the other string; otherwise false.
   */
  public static contains(container: string, searchedString: string): boolean {
    return container.toUpperCase().includes(searchedString.toUpperCase())
  }

  /**
   * Indicates whether a string contains other strings without casing.
   * @param container - String that should contain the other strings.
   * @param searchedStrings - Strings that should be contained in the string.
   * @returns True if all the strings are contained in the string; otherwise false.
   */
  public static containsAll(container: string, searchedStrings: string[]): boolean {
    const results: boolean[] = []

    for (const searchedString of searchedStrings) {
      results.push(this.contains(container, searchedString))
    }

    return results.every(r => r === true)
  }

  /**
   * Indicates whether a string contains one of several strings without casing.
   * @param container - String that should contain the other strings.
   * @param searchedStrings - Strings that should be contained in the string.
   * @returns True if any of the strings are contained in the string; otherwise false.
   */
  public static containsAny(container: string, searchedStrings: string[]): boolean {
    for (const searchedString of searchedStrings) {
      if (this.contains(container, searchedString)) {
        return true
      }
    }

    return false
  }

  /**
   * Compares two string without casing.
   * @param string1 - First string.
   * @param string2 - Second string.
   * @returns A value indicating whether the first string is alphabetically before, after or equal to the second string.
   */
  public static compare(string1: string, string2: string): number {
    string1 = string1.toUpperCase()
    string2 = string2.toUpperCase()

    if (string1 < string2) {
      return -1
    } else if (string1 > string2) {
      return 1
    }

    return 0
  }

  /**
   * Gets a stat emoji when the type is `markdown`.
   * @param type - Type of text being constructed.
   * @param icon - Icon to display.
   * @returns Icon text.
   */
  public static getTextStatEmoji(type: BuildsToTextType, icon: string): string {
    if (type === BuildsToTextType.simpleText) {
      return ''
    }

    return `${icon} `
  }

  /**
   * Transforms a string containing `-` and `.` to a camel case string.
   * @param s - String.
   */
  public static toCamelCase(s: string): string {
    const camelCaseString = s.replace(/[-_.](.)/g, (_, char) => char.toUpperCase())

    return this.toLowerFirst(camelCaseString)
  }

  /**
   * Transforms the first letter of a string to uppercase.
   * @param s - String.
   */
  public static toUpperFirst(s: string): string {
    if (s.length === 0) {
      return s
    }

    const part1 = s[0].toUpperCase()
    const part2 = s.slice(1)

    return part1 + part2
  }

  /**
   * Transforms the first letter of a string to lowercase.
   * @param s - String.
   */
  public static toLowerFirst(s: string): string {
    if (s.length === 0) {
      return s
    }

    const part1 = s[0].toLowerCase()
    const part2 = s.substring(1)

    return part1 + part2
  }
}