import { describe, expect, it } from 'vitest'
import { MerchantItemsOptionsComponentService } from '../../../services/components/MerchantItemsOptionsComponentService'

describe('display()', () => {
  it('should emit the open merchant and items options event', () => {
    // Arrange
    let hasBeenCalled = false
    const service = new MerchantItemsOptionsComponentService()

    service.emitter.once(MerchantItemsOptionsComponentService.openMerchantItemsOptionsEvent, () => hasBeenCalled = true)

    // Act
    service.display()

    // Assert
    expect(hasBeenCalled).toBe(true)
  })
})