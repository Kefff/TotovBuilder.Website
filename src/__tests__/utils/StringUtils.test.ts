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
    // Assert
    expect(StringUtils.contains(string1, string2)).toBe(expected)
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