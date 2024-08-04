import { describe, expect, it } from 'vitest'
import { GlobalSidebarComponentType, IGlobalSidebarOptions } from '../../models/utils/IGlobalSidebarOptions'
import { GlobalSidebarService } from '../../services/GlobalSidebarService'

describe('GlobalSideBarService', () => {
  describe('close()', () => {
    it('should emit the close global sidebar event', () => {
      // Arrange
      let globalSidebarToCloseType: GlobalSidebarComponentType | undefined = undefined
      const service = new GlobalSidebarService()

      service.emitter.once(GlobalSidebarService.closeGlobalSidebarEvent, (type: GlobalSidebarComponentType) => globalSidebarToCloseType = type)

      // Act
      service.close('BuildsListSidebar')

      // Assert
      expect(globalSidebarToCloseType).toBe('BuildsListSidebar')
    })
  })

  describe('display()', () => {
    it('should emit the open global sidebar event', () => {
      // Arrange
      const options: IGlobalSidebarOptions = {
        displayedComponentType: 'GeneralOptionsSidebar',
        position: 'left'
      }
      let globalSidebarToOpenOptions: IGlobalSidebarOptions | undefined = undefined
      const service = new GlobalSidebarService()

      service.emitter.once(GlobalSidebarService.openGlobalSidebarEvent, (options: IGlobalSidebarOptions) => globalSidebarToOpenOptions = options)

      // Act
      service.display(options)

      // Assert
      expect(globalSidebarToOpenOptions).toStrictEqual(options)
    })

    it('should register a close action', () => {
      // Arrange
      let executed = false
      const service = new GlobalSidebarService()

      // Act
      service.display({
        displayedComponentType: 'GeneralOptionsSidebar',
        position: 'left',
        onCloseAction: () => {
          executed = true
        }
      })
      service.executeOnCloseActions('GeneralOptionsSidebar')

      // Assert
      expect(executed).toBe(true)
    })
  })

  describe('executeOnClosingActions()', () => {
    it('should execute closing actions when closing the global sidebar and unregister actions', async () => {
      // Arrange
      let action1ExecutionCount = 0
      let action2ExecutionCount = 0
      let action3ExecutionCount = 0

      const action1 = () => { action1ExecutionCount++ }
      const action2 = () => {
        return new Promise<void>(resolve => {
          action2ExecutionCount++
          resolve()
        })
      }
      const action3 = () => { action3ExecutionCount++ }
      const service = new GlobalSidebarService()

      // Act
      service.registerOnCloseAction('GeneralOptionsSidebar', action1)
      service.registerOnCloseAction('GeneralOptionsSidebar', action2)
      service.registerOnCloseAction('ChangelogSidebar', action3)

      await service.executeOnCloseActions('GeneralOptionsSidebar')
      await service.executeOnCloseActions('GeneralOptionsSidebar')

      // Assert
      expect(action1ExecutionCount).toBe(1)
      expect(action2ExecutionCount).toBe(1)
      expect(action3ExecutionCount).toBe(0)
    })
  })
})