import { describe, expect, it } from 'vitest'
import Result from '../../utils/Result'

describe('get value', () => {
  it('should get the value', () => {
    // Arrange
    const result = Result.ok(10)

    // Act / Assert
    expect(result.value).toBe(10)
  })

  it('should throw if the result is not expected to have a value', () => {
    // Arrange
    const result = Result.ok()

    // Act / Assert
    expect(() => result.value).toThrow('Undefined result value.')
  })

  it('should throw if the result is an error', () => {
    // Arrange
    const result = Result.fail('Error')

    // Act / Assert
    expect(() => result.value).toThrow('Cannot read "value" property of an error result.')
  })
})

describe('fail', () => {
  it('should create a failure result', () => {
    // Act
    const result = Result.fail(failureMessage)

    // Assert
    expect(result.success).toBe(false)
    expect(result.failureMessage).toBe(failureMessage)
  })
})

describe('ok', () => {
  it('should create a successful result', () => {
    // Act
    const result = Result.ok()

    // Assert
    expect(result.success).toBe(true)
    expect(result.failureMessage).toBe('')
  })

  it('should create a successful result with data', () => {
    // Act
    const result1 = Result.ok(1)
    const result2 = Result.ok('one')

    // Assert
    expect(result1.success).toBe(true)
    expect(result1.value).toBe(1)
    expect(result1.failureMessage).toBe('')

    expect(result2.success).toBe(true)
    expect(result2.value).toBe('one')
    expect(result2.failureMessage).toBe('')
  })
})

const failureMessage = 'This is a failure'