import { describe, expect, it } from 'vitest'
import { GlobalSidebarService } from '../../services/GlobalSidebarService'

describe('close()', () => {
  it('should emit the close global sidebar event', () => {
    // Arrange
    let hasBeenCalled = false
    const service = new GlobalSidebarService()

    service.emitter.once(GlobalSidebarService.closeGlobalSidebarEvent, () => hasBeenCalled = true)

    // Act
    service.close()

    // Assert
    expect(hasBeenCalled).toBe(true)
  })
})

describe('display()', () => {
  it('should emit the open global sidebar event', () => {
    // Arrange
    let hasBeenCalled = false
    const service = new GlobalSidebarService()

    service.emitter.once(GlobalSidebarService.openGlobalSidebarEvent, () => hasBeenCalled = true)

    // Act
    service.display({
      displayedComponentType: 'GeneralOptionsSidebar',
      position: 'left'
    })

    // Assert
    expect(hasBeenCalled).toBe(true)
  })
})

describe('executeOnClosingActions()', () => {
  it('should execute closing actions when closing the global sidebar and unregister actions', async () => {
    // Arrange
    let action1ExecutionCount = 0
    let action2ExecutionCount = 0

    const action1 = () => { action1ExecutionCount++ }
    const action2 = () => {
      return new Promise<void>(resolve => {
        action2ExecutionCount++
        resolve()
      })
    }
    const service = new GlobalSidebarService()

    // Act
    service.registerOnClosingAction(action1)
    service.registerOnClosingAction(action2)

    await service.executeOnClosingActions()
    await service.executeOnClosingActions()

    // Assert
    expect(action1ExecutionCount).toBe(1)
    expect(action2ExecutionCount).toBe(1)
  })
})