import { describe, expect, it } from 'vitest'
import { GeneralOptionsComponentService } from '../../../services/components/GeneralOptionsComponentService'

describe('display()', () => {
  it('should emit the open general options event', () => {
    // Arrange
    let hasBeenCalled = false
    const service = new GeneralOptionsComponentService()

    service.emitter.once(GeneralOptionsComponentService.openGeneralOptionsEvent, () => hasBeenCalled = true)

    // Act
    service.display()

    // Assert
    expect(hasBeenCalled).toBe(true)
  })
})