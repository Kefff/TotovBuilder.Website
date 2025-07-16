import { instance, mock } from 'ts-mockito'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { Router } from 'vue-router'
import { IGlobalSidebarOptions } from '../../models/utils/IGlobalSidebarOptions'
import { GlobalSidebarService } from '../../services/GlobalSidebarService'

describe('GlobalSideBarService', () => {
  beforeEach(() => {
    vi.mock('vue-router', () => {
      const routerMock = mock<Router>()

      return {
        useRouter: (): Router => instance(routerMock)
      }
    })
  })

  describe('close', () => {
    it('should emit the closing global sidebar event', () => {
      // Arrange
      let closingSidebarIdentifier: number = -1
      const service = new GlobalSidebarService()

      service.emitter.once(GlobalSidebarService.closingGlobalSidebarEvent, (identifier: number) => closingSidebarIdentifier = identifier)

      // Act
      service.close(10)

      // Assert
      expect(closingSidebarIdentifier).toBe(10)
    })
  })

  describe('display', () => {
    it('should emit the open global sidebar event', () => {
      // Arrange
      let emitted = false

      const options: IGlobalSidebarOptions = {
        displayedComponentType: 'GeneralOptionsSidebar'
      }
      const service = new GlobalSidebarService()

      service.emitter.once(GlobalSidebarService.openedGlobalSidebarEvent, () => emitted = true)

      // Act
      service.display(options)

      // Assert
      expect(emitted).toBe(true)
    })

    it('should set a close action', async () => {
      // Arrange
      let executed = false
      const service = new GlobalSidebarService()

      // Act
      service.display({
        displayedComponentType: 'GeneralOptionsSidebar',
        onCloseAction: () => {
          executed = true
        }
      })
      await service.executeOnCloseActionsAsync(0)

      // Assert
      expect(executed).toBe(true)
    })
  })

  describe('executeOnCloseActionsAsync', () => {
    it('should execute closing actions when closing the global sidebar and remove the sidebar', async () => {
      // Arrange
      let action1ExecutionCount = 0
      let action2ExecutionCount = 0
      let action3ExecutionCount = 0

      const action1 = (): void => { action1ExecutionCount++ }
      const action2 = (): Promise<void> => {
        return new Promise<void>(resolve => {
          action2ExecutionCount++
          resolve()
        })
      }
      const action3 = (): void => { action3ExecutionCount++ }

      const service = new GlobalSidebarService()
      service.display({
        displayedComponentType: 'GeneralOptionsSidebar'
      })
      service.display({
        displayedComponentType: 'GeneralOptionsSidebar'
      })
      service.display({
        displayedComponentType: 'GeneralOptionsSidebar'
      })

      // Act
      service.setOnCloseAction(0, action1)
      service.setOnCloseAction(1, action2)
      service.setOnCloseAction(2, action3)

      await service.executeOnCloseActionsAsync(0)
      await service.executeOnCloseActionsAsync(1)

      // Assert
      expect(action1ExecutionCount).toBe(1)
      expect(action2ExecutionCount).toBe(1)
      expect(action3ExecutionCount).toBe(0)
    })
  })

  describe('isDisplayed', () => {
    it('should indicate when a sidebar is displayed', async () => {
      // Arrange
      const service = new GlobalSidebarService()

      // Act
      service.display({
        displayedComponentType: 'BuildsListSidebar'
      })
      service.display({
        displayedComponentType: 'ChangelogSidebar'
      })

      let result = service.isDisplayed()

      // Assert
      expect(result).toBe(true)

      // Act
      await service.executeOnCloseActionsAsync(0)
      result = service.isDisplayed()

      // Assert
      expect(result).toBe(true)

      // Act
      await service.executeOnCloseActionsAsync(1)
      result = service.isDisplayed()

      // Assert
      expect(result).toBe(false)
    })
  })

  describe('setOnCloseAction', () => {
    it('should do nothing when the sidebar corresponding to the identifier is not found', () => {
      // Arrange
      const service = new GlobalSidebarService()

      service.display({
        displayedComponentType: 'BuildsListSidebar'
      })

      // Act
      service.setOnCloseAction(1, () => { })

      // Assert
      expect(service.displayedSidebars[0].options.onCloseAction).toBeUndefined()
    })
  })
})