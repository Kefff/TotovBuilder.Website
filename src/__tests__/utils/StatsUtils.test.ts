import StatsUtils from '../../utils/StatsUtils'
import { useTarkovValuesServiceMock } from '../../__mocks__/TarkovValuesServiceMock'
import { describe, expect, it } from 'vitest'

describe('StringUtils.getValueClass()', () => {
  it.each([
    [1, false, false, '1'],
    [-1, false, false, '-1'],
    [0, false, false, '0'],
    [0.01, true, true, '+1%'],
    [-0.01, true, true, '-1%'],
    [0, true, true, '0%']
  ])('should get the caption corresponding to a stats value', (value: number, isBonusMalus: boolean, isPercentage: boolean, expected) => {
    // Assert
    expect(StatsUtils.getDisplayValue(value, isBonusMalus, isPercentage)).toBe(expected)
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