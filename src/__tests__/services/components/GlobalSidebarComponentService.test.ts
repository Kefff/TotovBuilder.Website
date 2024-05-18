import { describe, expect, it } from 'vitest'
import { GlobalSidebarComponentService } from '../../../services/components/GlobalSidebarComponentService'

describe('display()', () => {
  it('should emit the open global sidebar event', () => {
    // Arrange
    let hasBeenCalled = false
    const service = new GlobalSidebarComponentService()

    service.emitter.once(GlobalSidebarComponentService.openGlobalSidebarEvent, () => hasBeenCalled = true)

    // Act
    service.display({
      displayedComponentType: 'GeneralOptions',
      position: 'left'
    })

    // Assert
    expect(hasBeenCalled).toBe(true)
  })
})