import { describe, expect, it } from 'vitest'
import { CompatibilityRequest } from '../../../services/compatibility/CompatibilityRequest'
import { CompatibilityRequestType } from '../../../services/compatibility/CompatibilityRequestType'
import { CompatibilityService } from '../../../services/compatibility/CompatibilityService'

describe('checkCompatibility()', () => {
  it.each([
    [true],
    [false]
  ])('should send an event for checking an item compatibility and return a promise that will be resolved by the event recipient', async (expected: boolean) => {
    // Arrange
    const service = new CompatibilityService()
    service.emitter.once(CompatibilityRequestType.mod, (request: CompatibilityRequest) => {
      request.setResult(Promise.resolve(expected))
    })

    // Act
    const result = await service.checkCompatibility(CompatibilityRequestType.mod, '123', 'abc')

    // Assert
    expect(result).toBe(expected)
  })
})