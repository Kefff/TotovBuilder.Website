import StatsUtils from '../../utils/StatsUtils'
import { useTarkovValuesServiceMock } from '../__mocks__/TarkovValuesServiceMock'
import { describe, expect, it } from 'vitest'

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
    // Assert
    expect(StatsUtils.getDisplayValue(value, isBonusMalus, decimalNumbers, fixedDecimalNumbers)).toBe(expected)
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
    // Assert
    expect(StatsUtils.getPercentageDisplayValue(value, isBonusMalus, decimalNumbers, fixedDecimalNumbers)).toBe(expected)
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
    if (invert != null) {
      expect(StatsUtils.getValueColorClass(value, invert)).toBe(expected)
    } else {
      expect(StatsUtils.getValueColorClass(value)).toBe(expected)
    }
  })
})

describe('StringUtils.getWeightColorClass()', () => {
  it.each([
    [24, ''],
    [24.1, 'stats-encumberment-light'],
    [65, 'stats-encumberment-light'],
    [65.1, 'stats-encumberment-heavy']
  ])('should get the CSS class to apply to a stats value', (value: number, expected: string) => {
    // Arrange
    useTarkovValuesServiceMock()

    // Assert
    expect(StatsUtils.getWeightColorClass(value)).toBe(expected)
  })
})