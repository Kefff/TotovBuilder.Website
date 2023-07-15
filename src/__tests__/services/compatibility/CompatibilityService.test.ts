import { CompatibilityRequest } from '../../../services/compatibility/CompatibilityRequest'
import { CompatibilityRequestType } from '../../../services/compatibility/CompatibilityRequestType'
import { CompatibilityService } from '../../../services/compatibility/CompatibilityService'
import Result, { FailureType } from '../../../utils/Result'
import { describe, expect, it } from 'vitest'

describe('checkCompatibility()', () => {
  it('should send an event for checking an item compatibility and return a promise that will be resolved by the event recipient', async () => {
    // Arrange
    const service = new CompatibilityService()
    service.emitter.once(CompatibilityRequestType.mod, (request: CompatibilityRequest) => {
      request.setResult(Promise.resolve(Result.fail(
        FailureType.hidden,
        undefined,
        'Error ' + request.requestType + ' ' + request.itemId + (request.path != null ? ' ' + request.path : ''))))
    })

    // Act
    const result = await service.checkCompatibility(CompatibilityRequestType.mod, '123', 'abc')

    // Assert
    expect(result.success).toBe(false)
    expect(result.failureMessage).toBe('Error mod 123 abc')
  })
})