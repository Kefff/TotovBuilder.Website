import { NotificationService, NotificationType } from '../../services/NotificationService'
import { useWebsiteConfigurationServiceMock } from '../__mocks__/WebsiteConfigurationServiceMock'
import { describe, expect, it } from 'vitest'
import { INotification } from '../../models/utils/INotification'

describe('clearNotification()', () => {
  it('should clear a notification from the notifications collection', () => {
    // Arrange
    const service = new NotificationService()
    service.notify(NotificationType.error, 'Error')

    // Act
    service.clearNotification(service.getNotifications()[0].id)

    // Assert
    expect(service.getNotifications().length).toBe(0)
  })

  it('should do nothing when a wrong notification ID is provided', () => {
    // Arrange
    const service = new NotificationService()
    service.notify(NotificationType.error, 'Error')

    // Act
    service.clearNotification('invalid')

    // Assert
    expect(service.getNotifications().length).toBe(1)
  })
})

describe('clearNotifications()', () => {
  it('should clear all notifications', () => {
    // Arrange
    const service = new NotificationService()
    service.notify(NotificationType.error, 'Error')
    service.notify(NotificationType.warning, 'Warning')

    // Act
    service.clearNotifications()

    // Assert
    expect(service.getNotifications().length).toBe(0)
  })
})

describe('notify()', () => {
  it('should add a notification', async () => {
    // Arrange
    useWebsiteConfigurationServiceMock()

    const service = new NotificationService()
    let hasBeenCalled = false
    service.emitter.on(service.addedEventName, () => hasBeenCalled = true)

    // Act
    service.notify(NotificationType.error, 'Error', true)
    service.notify(NotificationType.information, 'Information')
    service.notify(NotificationType.success, 'Success', true)
    service.notify(NotificationType.warning, 'Warning')
    service.notify(NotificationType.warning, 'Warning', true, 0)
    service.notify(NotificationType.warning, 'Warning', true, 1000)
    service.notify(
      NotificationType.warning,
      'Warning',
      true,
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
      'Warning',
      true,
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
    expect(notifications).toMatchObject( // toMatchObject used to avoid comparing date and id properties that are different each test
      [
        {
          buttons: [],
          closable: true,
          message: 'Error',
          toast: true,
          toastDuration: 10000,
          type: 'error'
        },
        {
          buttons: [],
          closable: true,
          message: 'Information',
          toast: false,
          toastDuration: undefined,
          type: 'info'
        },
        {
          buttons: [],
          closable: true,
          message: 'Success',
          toast: true,
          toastDuration: 5000,
          type: 'success'
        },
        {
          buttons: [],
          closable: true,
          message: 'Warning',
          toast: false,
          toastDuration: undefined,
          type: 'warn'
        },
        {
          buttons: [],
          closable: true,
          message: 'Warning',
          toast: true,
          toastDuration: 3600000,
          type: 'warn'
        },
        {
          buttons: [],
          closable: true,
          message: 'Warning',
          toast: true,
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
          message: 'Warning',
          toast: true,
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
          message: 'Warning',
          toast: true,
          toastDuration: 1000,
          type: 'warn'
        }
      ] as INotification[])
    expect(hasBeenCalled).toBe(true)
    expect(service.newNotificationCount).toBe(6)
  })
})

describe('resetNewNotificationCount()', () => {
  it('should reset the new notification count', async () => {
    // Arrange
    useWebsiteConfigurationServiceMock()

    const service = new NotificationService()

    service.notify(NotificationType.error, 'Error')
    service.notify(NotificationType.information, 'Information', true)

    // Act
    service.resetNewNotificationCount()

    // Assert
    expect(service.newNotificationCount).toBe(0)
  })
})