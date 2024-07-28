import { describe, expect, it } from 'vitest'
import StringUtils from '../../utils/StringUtils'

describe('contains()', () => {
  it.each([
    ['ABC', 'BC', true],
    ['ABC', 'D', false],
    ['abc', 'bc', true],
    ['abc', 'd', false],
    ['aBc', 'bC', true],
    ['aBc', 'd', false]
  ])('should indicates if the first string contains the second string', (string1: string, string2: string, expected: boolean) => {
    // Act / Assert
    expect(StringUtils.contains(string1, string2)).toBe(expected)
  })
})

describe('containsAll()', () => {
  it.each([
    ['ABC', ['A', 'BC'], true],
    ['ABC', ['A', 'D'], false],
    ['abc', ['a', 'bc'], true],
    ['abc', ['a', 'd'], false],
    ['aBc', ['A', 'bC'], true],
    ['aBc', ['A', 'd'], false]
  ])('should indicates if the first string contains the second string', (string1: string, strings: string[], expected: boolean) => {
    // Act
    const result = StringUtils.containsAll(string1, strings)

    // Assert
    expect(result).toBe(expected)
  })
})

describe('containsAny()', () => {
  it.each([
    ['ABC', ['A', 'BC'], true],
    ['ABC', ['A', 'D'], true],
    ['ABC', ['D', 'EF'], false],
    ['abc', ['a', 'bc'], true],
    ['abc', ['a', 'd'], true],
    ['ABC', ['d', 'ef'], false],
    ['aBc', ['A', 'bC'], true],
    ['aBc', ['A', 'd'], true],
    ['aBc', ['D', 'eF'], false]
  ])('should indicates if the first string contains the second string', (string1: string, strings: string[], expected: boolean) => {
    // Act
    const result = StringUtils.containsAny(string1, strings)

    // Assert
    expect(result).toBe(expected)
  })
})

describe('compare', () => {
  it.each([
    ['AAbBCc', 'aABbCc', 0],
    ['AAbBDc', 'aABbCc', 1],
    ['AAbBCc', 'aABbDc', -1]
  ])('should compare two strings', (string1: string, string2: string, expected: number) => {
    // Assert
    expect(StringUtils.compare(string1, string2)).toBe(expected)
  })
})

describe('toCamelCase()', () => {
  it('should transform a string to camel case', () => {
    // Assert
    expect(StringUtils.toCamelCase('ThisIs-a.camelCase_string')).toBe('thisIsACamelCaseString')
  })
})

describe('toUpperFirst()', () => {
  it('should set the first letter of a string to uppercase', () => {
    // Assert
    expect(StringUtils.toUpperFirst('test')).toBe('Test')
  })

  it('should do nothing when the string is empty', () => {
    // Assert
    expect(StringUtils.toUpperFirst('')).toBe('')
  })
})

describe('toLowerFirst()', () => {
  it('should set the first letter of a string to lowercase', () => {
    // Assert
    expect(StringUtils.toLowerFirst('TEST')).toBe('tEST')
  })

  it('should do nothing when the string is empty', () => {
    // Assert
    expect(StringUtils.toLowerFirst('')).toBe('')
  })
})