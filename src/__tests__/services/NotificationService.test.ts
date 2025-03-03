import { describe, expect, it } from 'vitest'
import { INotification } from '../../models/utils/INotification'
import { NotificationService, NotificationType } from '../../services/NotificationService'
import StringUtils from '../../utils/StringUtils'
import { useWebsiteConfigurationServiceMock } from '../__mocks__/WebsiteConfigurationServiceMock'

describe('NotificationService', () => {
  describe('clearNotification', () => {
    it('should clear a notification from the notifications collection', () => {
      // Arrange
      useWebsiteConfigurationServiceMock()

      const service = new NotificationService()
      let hasBeenCalled = false
      service.emitter.on(service.clearedEventName, () => hasBeenCalled = true)

      service.notify(NotificationType.error, 'Error')

      // Act
      service.clearNotification(service.getNotifications()[0].id)

      // Assert
      expect(hasBeenCalled).toBe(true)
      expect(service.getNotifications().length).toBe(0)
    })

    it('should do nothing when a wrong notification ID is provided', () => {
      // Arrange
      useWebsiteConfigurationServiceMock()

      const service = new NotificationService()
      let hasBeenCalled = false
      service.emitter.on(service.clearedEventName, () => hasBeenCalled = true)

      service.notify(NotificationType.error, 'Error')

      // Act
      service.clearNotification('invalid')

      // Assert
      expect(hasBeenCalled).toBe(false)
      expect(service.getNotifications().length).toBe(1)
    })
  })

  describe('clearNotifications', () => {
    it('should clear all notifications', () => {
      // Arrange
      useWebsiteConfigurationServiceMock()

      const service = new NotificationService()
      let hasBeenCalled = false
      service.emitter.on(service.clearedEventName, () => hasBeenCalled = true)

      service.notify(NotificationType.error, 'Error')
      service.notify(NotificationType.warning, 'Warning')

      // Act
      service.clearNotifications()

      // Assert
      expect(hasBeenCalled).toBe(true)
      expect(service.getNotifications().length).toBe(0)
    })
  })

  describe('notify', () => {
    it('should add a notification', () => {
      // Arrange
      useWebsiteConfigurationServiceMock()

      const service = new NotificationService()
      let hasBeenCalled = false
      service.emitter.on(service.addedEventName, () => hasBeenCalled = true)

      // Act
      service.notify(NotificationType.error, 'Error')
      service.notify(NotificationType.information, 'Information')
      service.notify(NotificationType.success, 'Success')
      service.notify(NotificationType.warning, 'Warning1')
      service.notify(NotificationType.warning, 'Warning2', 0)
      service.notify(NotificationType.warning, 'Warning3', 1000)
      service.notify(
        NotificationType.warning,
        'Warning4',
        1000,
        [
          {
            action: undefined,
            caption: 'Close',
            icon: 'fa-times',
            name: 'close',
            type: undefined
          }
        ])
      service.notify(
        NotificationType.warning,
        'Warning5',
        1000,
        [
          {
            action: undefined,
            caption: 'Close',
            icon: 'fa-times',
            name: 'close',
            type: undefined
          }
        ],
        true)
      const notifications = service.getNotifications()

      // Assert
      expect(hasBeenCalled).toBe(true)
      expect(service.newNotificationCount).toBe(6)
      expect(notifications.sort((n1, n2) => StringUtils.compare(n1.message, n2.message))).toMatchObject( // toMatchObject used to avoid comparing date and id properties that are different each test
        [
          {
            buttons: [],
            closable: true,
            message: 'Error',
            toastDuration: 10000,
            type: 'error'
          },
          {
            buttons: [],
            closable: true,
            message: 'Information',
            toastDuration: 5000,
            type: 'info'
          },
          {
            buttons: [],
            closable: true,
            message: 'Success',
            toastDuration: 5000,
            type: 'success'
          },
          {
            buttons: [],
            closable: true,
            message: 'Warning1',
            toastDuration: 10000,
            type: 'warn'
          },
          {
            buttons: [],
            closable: true,
            message: 'Warning2',
            toastDuration: 3600000,
            type: 'warn'
          },
          {
            buttons: [],
            closable: true,
            message: 'Warning3',
            toastDuration: 1000,
            type: 'warn'
          },
          {
            closable: false,
            buttons: [
              {
                action: undefined,
                caption: 'Close',
                icon: 'fa-times',
                name: 'close',
                type: undefined
              }
            ],
            message: 'Warning4',
            toastDuration: 1000,
            type: 'warn'
          },
          {
            closable: true,
            buttons: [
              {
                action: undefined,
                caption: 'Close',
                icon: 'fa-times',
                name: 'close',
                type: undefined
              }
            ],
            message: 'Warning5',
            toastDuration: 1000,
            type: 'warn'
          }
        ] as INotification[])
    })
  })

  describe('resetNewNotificationCount', () => {
    it('should reset the new notification count', () => {
      // Arrange
      useWebsiteConfigurationServiceMock()

      const service = new NotificationService()

      service.notify(NotificationType.error, 'Error')
      service.notify(NotificationType.information, 'Information')

      // Act
      service.resetNewNotificationCount()

      // Assert
      expect(service.newNotificationCount).toBe(0)
    })
  })
})