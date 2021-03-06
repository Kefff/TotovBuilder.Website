/**
 * Represents an utility class for manipulating strings.
 */
export default class StringUtils {
  /**
   * Indicates whether a string contains another string without casing.
   * @param container - String that should contain the other string.
   * @param contained - String that should be contained in the other string.
   * @returns True if the string is contained in the other string; otherwise false.
   */
  public static contains(container: string, contained: string): boolean {
    return container.toUpperCase().includes(contained.toUpperCase())
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
   * Transforms the first letter of a string to uppercase.
   * @param s - String.
   */
  public static toUpperFirst(s: string): string {
    if (s.length === 0) {
      return s
    }

    const part1 = s[0].toUpperCase()
    const part2 = s.substr(1)

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
    const part2 = s.substr(1)

    return part1 + part2
  }
}