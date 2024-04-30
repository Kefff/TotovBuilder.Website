import { describe, expect, it } from 'vitest'
import StatsUtils from '../../utils/StatsUtils'
import { useTarkovValuesServiceMock } from '../__mocks__/TarkovValuesServiceMock'

describe('StringUtils.getDisplayValue()', () => {
  it.each([
    [1, false, 0, undefined, '1'],
    [-1, false, 0, undefined, '-1'],
    [0, false, 0, undefined, '0'],
    [1, true, 0, undefined, '+1'],
    [-1, true, 0, undefined, '-1'],
    [0, true, 0, undefined, '0'],
    [1, false, 0, 2, '1.00'],
    [-1, false, 0, 2, '-1.00'],
    [0, false, 0, 2, '0.00'],
    [1, true, 0, 2, '+1.00'],
    [-1, true, 0, 2, '-1.00'],
    [0, true, 0, 2, '0.00'],
    [1.111, false, 0, undefined, '1'],
    [-1.111, false, 0, undefined, '-1'],
    [1.111, true, 0, undefined, '+1'],
    [-1.111, true, 0, undefined, '-1'],
    [1.111, false, 0, 2, '1.00'],
    [-1.111, false, 0, 2, '-1.00'],
    [1.111, true, 0, 2, '+1.00'],
    [-1.111, true, 0, 2, '-1.00'],
    [1.999, false, 0, undefined, '2'],
    [-1.999, false, 0, undefined, '-2'],
    [1.999, true, 0, undefined, '+2'],
    [-1.999, true, 0, undefined, '-2'],
    [1.999, false, 0, 2, '2.00'],
    [-1.999, false, 0, 2, '-2.00'],
    [1.999, true, 0, 2, '+2.00'],
    [-1.999, true, 0, 2, '-2.00'],
    [1.111, false, 1, undefined, '1.1'],
    [-1.111, false, 1, undefined, '-1.1'],
    [1.111, true, 1, undefined, '+1.1'],
    [-1.111, true, 1, undefined, '-1.1'],
    [1.111, false, 1, 2, '1.10'],
    [-1.111, false, 1, 2, '-1.10'],
    [1.111, true, 1, 2, '+1.10'],
    [-1.111, true, 1, 2, '-1.10'],
    [1.199, false, 1, undefined, '1.2'],
    [-1.199, false, 1, undefined, '-1.2'],
    [1.199, true, 1, undefined, '+1.2'],
    [-1.199, true, 1, undefined, '-1.2'],
    [1.199, false, 1, 2, '1.20'],
    [-1.199, false, 1, 2, '-1.20'],
    [1.199, true, 1, 2, '+1.20'],
    [-1.199, true, 1, 2, '-1.20']
  ])('should get the caption corresponding to a stats value', (value: number, isBonusMalus: boolean, decimalNumbers: number, fixedDecimalNumbers: number | undefined, expected: string) => {
    // Act
    const result = StatsUtils.getDisplayValue(value, isBonusMalus, decimalNumbers, fixedDecimalNumbers)

    // Assert
    expect(result).toBe(expected)
  })

  it.each([
    ['en', '1,234.60'],
    ['fr', '1 234,60'],
    [undefined, '1,234.60']
  ])('should localize stat values', (language: string | undefined, expected: string) => {
    // Act
    const result = StatsUtils.getDisplayValue(1234.5678, false, 1, 2, language)

    // Assert
    expect(result).toBe(expected)
  })
})

describe('StringUtils.getPercentageDisplayValue()', () => {
  it.each([
    [1, false, 0, undefined, '100%'],
    [-1, false, 0, undefined, '-100%'],
    [0, false, 0, undefined, '0%'],
    [1, true, 0, undefined, '+100%'],
    [-1, true, 0, undefined, '-100%'],
    [0, true, 0, undefined, '0%'],
    [1, false, 0, 2, '100.00%'],
    [-1, false, 0, 2, '-100.00%'],
    [0, false, 0, 2, '0.00%'],
    [1, true, 0, 2, '+100.00%'],
    [-1, true, 0, 2, '-100.00%'],
    [0, true, 0, 2, '0.00%'],
    [0.11111, false, 0, undefined, '11%'],
    [-0.11111, false, 0, undefined, '-11%'],
    [0.11111, true, 0, undefined, '+11%'],
    [-0.11111, true, 0, undefined, '-11%'],
    [0.11111, false, 0, 2, '11.00%'],
    [-0.11111, false, 0, 2, '-11.00%'],
    [0.11111, true, 0, 2, '+11.00%'],
    [-0.11111, true, 0, 2, '-11.00%'],
    [0.19999, false, 0, undefined, '20%'],
    [-0.19999, false, 0, undefined, '-20%'],
    [0.19999, true, 0, undefined, '+20%'],
    [-0.19999, true, 0, undefined, '-20%'],
    [0.19999, false, 0, 2, '20.00%'],
    [-0.19999, false, 0, 2, '-20.00%'],
    [0.19999, true, 0, 2, '+20.00%'],
    [-0.19999, true, 0, 2, '-20.00%'],
    [0.11111, false, 1, undefined, '11.1%'],
    [-0.11111, false, 1, undefined, '-11.1%'],
    [0.11111, true, 1, undefined, '+11.1%'],
    [-0.11111, true, 1, undefined, '-11.1%'],
    [0.11111, false, 1, 2, '11.10%'],
    [-0.11111, false, 1, 2, '-11.10%'],
    [0.11111, true, 1, 2, '+11.10%'],
    [-0.11111, true, 1, 2, '-11.10%'],
    [0.11199, false, 1, undefined, '11.2%'],
    [-0.11199, false, 1, undefined, '-11.2%'],
    [0.11199, true, 1, undefined, '+11.2%'],
    [-0.11199, true, 1, undefined, '-11.2%'],
    [0.11199, false, 1, 2, '11.20%'],
    [-0.11199, false, 1, 2, '-11.20%'],
    [0.11199, true, 1, 2, '+11.20%'],
    [-0.11199, true, 1, 2, '-11.20%']
  ])('should get the caption corresponding to a stats value', (value: number, isBonusMalus: boolean, decimalNumbers: number, fixedDecimalNumbers: number | undefined, expected: string) => {
    // Act
    const result = StatsUtils.getPercentageDisplayValue(value, isBonusMalus, decimalNumbers, fixedDecimalNumbers)

    // Assert
    expect(result).toBe(expected)
  })

  it.each([
    ['en', '123,456.80%'],
    ['fr', '123 456,80%'],
    [undefined, '123,456.80%']
  ])('should localize stat values', (language: string | undefined, expected: string) => {
    // Act
    const result = StatsUtils.getPercentageDisplayValue(1234.5678, false, 1, 2, language)

    // Assert
    expect(result).toBe(expected)
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
    // Act
    const result = invert != null
      ? StatsUtils.getValueColorClass(value, invert)
      : StatsUtils.getValueColorClass(value)

    // Assert
    expect(result).toBe(expected)
  })
})

describe('StringUtils.getWeightColorClass()', () => {
  it.each([
    [26, ''],
    [26.1, 'stats-encumberment-light'],
    [65, 'stats-encumberment-light'],
    [65.1, 'stats-encumberment-heavy']
  ])('should get the CSS class to apply to a stats value', (value: number, expected: string) => {
    // Arrange
    useTarkovValuesServiceMock()

    // Act
    const result = StatsUtils.getWeightColorClass(value)

    // Assert
    expect(result).toBe(expected)
  })
})