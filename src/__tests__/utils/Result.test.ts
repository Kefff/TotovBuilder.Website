import Result, { FailureType } from '../../utils/Result'
import Configuration from '../../../test-data/configuration.json'

describe('get value()', () => {
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
    expect(() => result.value).toThrow()
  })

  it('should throw if the result is an error', () => {
    // Arrange
    const result = Result.fail()

    // Act / Assert
    expect(() => result.value).toThrow()
  })
})

describe('fail()', () => {
  it('should create a failure result', () => {
    // Act
    const result1 = Result.fail()
    const result2 = Result.fail(FailureType.warning, failureLocation, failureMessage)
    const result3 = Result.fail(FailureType.error, failureLocation, failureMessage)

    Configuration.VITE_DEBUG = 'false'
    const result4 = Result.fail(FailureType.error, failureLocation, failureMessage)

    // Assert
    expect(result1.success).toBe(false)
    expect(result1.failureContext).toBe('')
    expect(result1.failureMessage).toBe('')

    expect(result2.success).toBe(false)
    expect(result2.failureContext).toBe(failureLocation)
    expect(result2.failureMessage).toBe(failureMessage)

    expect(result3.success).toBe(false)
    expect(result3.failureContext).toBe(failureLocation)
    expect(result3.failureMessage).toBe(failureMessage)

    expect(result4.success).toBe(false)
    expect(result4.failureContext).toBe(failureLocation)
    expect(result4.failureMessage).toBe(failureMessage)
  })
})

describe('failFrom()', () => {
  it('should create a failure result from another result', () => {
    // Arrange
    const originalResult1 = Result.ok(30)
    const originalResult2 = Result.fail(FailureType.hidden, failureLocation, failureMessage)

    // Act
    const result1 = Result.failFrom(originalResult1, FailureType.warning)
    const result2 = Result.failFrom(originalResult2)

    // Assert
    expect(result1.success).toBe(false)
    expect(result1.failureContext).toBe('')
    expect(result1.failureMessage).toBe('')

    expect(result2.success).toBe(false)
    expect(result2.failureContext).toBe(failureLocation)
    expect(result2.failureMessage).toBe(failureMessage)
  })
})

describe('ok()', () => {
  it('should create a successful result', () => {
    // Act
    const result = Result.ok()

    // Assert
    expect(result.success).toBe(true)
    expect(result.failureMessage).toBe('')
    expect(result.failureContext).toBe('')
  })

  it('should create a successful result with data', () => {
    // Act
    const result1 = Result.ok(1)
    const result2 = Result.ok('one')

    // Assert
    expect(result1.success).toBe(true)
    expect(result1.value).toBe(1)
    expect(result1.failureMessage).toBe('')
    expect(result1.failureContext).toBe('')

    expect(result2.success).toBe(true)
    expect(result2.value).toBe('one')
    expect(result2.failureMessage).toBe('')
    expect(result2.failureContext).toBe('')
  })
})

const failureLocation = 'result.test.ts'
const failureMessage = 'This is a failure'