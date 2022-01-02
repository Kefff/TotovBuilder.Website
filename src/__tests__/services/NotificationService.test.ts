import { NotificationService, NotificationType } from '../../services/NotificationService'

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
    const notifications = service.getNotifications()

    // Assert
    expect(notifications.sort((n1, n2) => {
      if (n1.type < n2.type) {
        return -1
      } else if (n1.type > n2.type) {
        return 1
      } else {
        return (n1.toastDuration ?? -1) - (n2.toastDuration ?? -1)
      }
    })).toMatchObject(
      [
        {
          message: 'Error',
          toast: true,
          toastDuration: 10000,
          type: 'error'
        },
        {
          message: 'Information',
          toast: false,
          toastDuration: undefined,
          type: 'info'
        },
        {
          message: 'Success',
          toast: true,
          toastDuration: 5000,
          type: 'success'
        },
        {
          message: 'Warning',
          toast: false,
          toastDuration: undefined,
          type: 'warn'
        },
        {
          message: 'Warning',
          toast: true,
          toastDuration: 1000,
          type: 'warn'
        },
        {
          message: 'Warning',
          toast: true,
          toastDuration: 3600000,
          type: 'warn'
        }
      ])
    expect(hasBeenCalled).toBe(true)
    expect(service.newNotificationCount).toBe(6)
  })
})

describe('resetNewNotificationCount()', () => {
  it('should reset the new notification count', async () => {
    // Arrange
    const service = new NotificationService()

    service.notify(NotificationType.error, 'Error')
    service.notify(NotificationType.information, 'Information', true)

    // Act
    service.resetNewNotificationCount()

    // Assert
    expect(service.newNotificationCount).toBe(0)
  })
})