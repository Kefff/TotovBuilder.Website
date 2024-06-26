import { anything, instance, mock, verify } from 'ts-mockito'
import { LogService } from '../../services/LogService'
import Services from '../../services/repository/Services'
import Result, { FailureType } from '../../utils/Result'
import { describe, expect, it } from 'vitest'

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
    // Arrange
    const logServiceMock = mock<LogService>()

    Services.configure(LogService, undefined, instance(logServiceMock))

    // Act
    const result1 = Result.fail()
    const result2 = Result.fail(FailureType.warning, failureLocation, failureMessage)
    const result3 = Result.fail(FailureType.error, failureLocation, failureMessage)
    const result4 = Result.fail(FailureType.exception, failureLocation, failureMessage)

    import.meta.env.VITE_DEBUG = 'false'
    const result5 = Result.fail(FailureType.warning, failureLocation, failureMessage)
    const result6 = Result.fail(FailureType.error, failureLocation, failureMessage)
    const result7 = Result.fail(FailureType.exception, failureLocation, failureMessage)

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

    expect(result5.success).toBe(false)
    expect(result5.failureContext).toBe(failureLocation)
    expect(result5.failureMessage).toBe(failureMessage)

    expect(result6.success).toBe(false)
    expect(result6.failureContext).toBe(failureLocation)
    expect(result6.failureMessage).toBe(failureMessage)

    expect(result7.success).toBe(false)
    expect(result7.failureContext).toBe(failureLocation)
    expect(result7.failureMessage).toBe(failureMessage)

    verify(logServiceMock.logError(failureMessage)).times(1)
    verify(logServiceMock.logError('message.failureDebug', anything())).times(1)
    verify(logServiceMock.logException(failureMessage)).times(1)
    verify(logServiceMock.logException('message.failureDebug', anything())).times(1)
    verify(logServiceMock.logWarning(failureMessage)).times(1)
    verify(logServiceMock.logWarning('message.failureDebug', anything())).times(1)
  })
})

describe('failFrom()', () => {
  it('should create a failure result from another result', () => {
    // Arrange
    const originalResult1 = Result.fail(FailureType.hidden)
    const originalResult2 = Result.fail(FailureType.error, failureLocation, failureMessage)

    // Act
    const result1 = Result.failFrom(originalResult1)
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