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
    let action2Promise: Promise<void>

    const action1 = () => { action1ExecutionCount++ }
    const action2 = () => {
      action2Promise = new Promise<void>(resolve => {
        action2ExecutionCount++
        resolve()
      })

      return action2Promise
    }
    const service = new GlobalSidebarService()

    // Act
    service.registerOnClosingAction(action1)
    service.registerOnClosingAction(action2)

    service.executeOnClosingActions()
    await action2Promise!

    service.executeOnClosingActions()
    await action2Promise!

    // Assert
    expect(action1ExecutionCount).toBe(1)
    expect(action2ExecutionCount).toBe(1)
  })
})