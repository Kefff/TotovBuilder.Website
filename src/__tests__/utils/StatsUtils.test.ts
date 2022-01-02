import StatsUtils from '../../utils/StatsUtils'

describe('StringUtils.getValueClass()', () => {
  it.each([
    [1, '+1'],
    [-1, '-1'],
    [0, '0']
  ])('should get the caption corresponding to a stats value', (value: number, expected) => {
    // Assert
    expect(StatsUtils.getValueCaption(value)).toBe(expected)
  })
})

describe('StringUtils.getValueColorClass()', () => {
  it.each([
    [1, false, 'stats-value-positive'],
    [-1, false, 'stats-value-negative'],
    [1, true, 'stats-value-negative'],
    [-1, true, 'stats-value-positive'],
    [0, undefined, ''],
    [0, true, '']
  ])('should get the CSS class to apply to a stats value', (value: number, invert: boolean | undefined, expected: string) => {
    // Assert
    if (invert !== undefined) {
      expect(StatsUtils.getValueColorClass(value, invert)).toBe(expected)
    } else {
      expect(StatsUtils.getValueColorClass(value)).toBe(expected)
    }
  })
})

describe('StringUtils.getWeightColorClass()', () => {
  it.each([
    [28, ''],
    [28.1, 'stats-encumberment-light'],
    [60, 'stats-encumberment-light'],
    [60.1, 'stats-encumberment-heavy']
  ])('should get the CSS class to apply to a stats value', (value: number, expected: string) => {
    // Assert
    expect(StatsUtils.getWeightColorClass(value)).toBe(expected)
  })
})