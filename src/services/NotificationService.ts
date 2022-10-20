import { Guid } from 'guid-typescript'
import { INotification } from '../models/utils/INotification'
import { TinyEmitter } from 'tiny-emitter'
import Services from './repository/Services'
import { WebsiteConfigurationService } from './WebsiteConfigurationService'

/**
 * Represents a service responsible for managing notification messages.
 */
export class NotificationService {
  /**
   * Event emitter used to signal changes in the notification lists.
   */
  public emitter = new TinyEmitter()

  /**
   * Amount of new notifications.
   */
  public newNotificationCount = 0

  /**
   * Name of the event signaling that a new notification has been added to the collection.
   */
  public addedEventName = 'added'

  /**
   * Collection of notifications.
   */
  private notifications: INotification[] = []

  /**
   * Clears a notification.
   * @param id - ID of the notification to clear.
   */
  public clearNotification(id: string): void {
    const index = this.notifications.findIndex((n) => n.id === id)

    if (index >= 0) {
      this.notifications.splice(index, 1)
    }
  }

  /**
   * Clears all notification.
   */
  public clearNotifications(): void {
    this.notifications = []
  }

  /**
   * Gets the notifications ordered by most recent.
   * @returns notifications - Notifications.
   */
  public getNotifications(): INotification[] {
    return [...this.notifications.sort((n1, n2) => n2.date.getTime() - n1.date.getTime())]
  }

  /**
   * Adds a notification message to the list of notifications to display.
   * @param type - Type of notification.
   * @param message - Message.
   * @param toast - Indicates whether a notification will be displayed as a toast or not.
   * @param toastDuration - Duration of the toast. Zero means the toast will be displayed until manually closed by the user.
   */
  public notify(type: NotificationType, message: string, toast = false, toastDuration: number | undefined = undefined): void {
    if (toast) {
      if (toastDuration === undefined) {
        const websiteConfigurationService = Services.get(WebsiteConfigurationService)

        switch (type) {
          case NotificationType.error: {
            toastDuration = Number(websiteConfigurationService.configuration.notificationErrorDuration) * 1000 // In milliseconds
            break
          }
          case NotificationType.information: {
            toastDuration = Number(websiteConfigurationService.configuration.notificationInformationDuration) * 1000 // In milliseconds
            break
          }
          case NotificationType.success: {
            toastDuration = Number(websiteConfigurationService.configuration.notificationSuccessDuration) * 1000 // In milliseconds
            break
          }
          case NotificationType.warning: {
            toastDuration = Number(websiteConfigurationService.configuration.notificationWarningDuration) * 1000 // In milliseconds
            break
          }
        }
      } else if (toastDuration === 0) {
        toastDuration = 3600000
      }
    }

    switch (type) {
      case NotificationType.error:
      case NotificationType.warning: {
        this.newNotificationCount++
        break
      }
    }

    const notification: INotification = {
      date: new Date(),
      id: Guid.create().toString(),
      message,
      toast,
      toastDuration,
      type
    }

    this.notifications.push(notification)
    this.emitter.emit(this.addedEventName, notification)
  }

  /**
   * Resets the amount of new notifications.
   */
  public resetNewNotificationCount(): void {
    this.newNotificationCount = 0
  }
}

/**
 * Notification types.
 */
export enum NotificationType {
  /**
   * Error.
   */
  error = 'error',

  /**
   * Information
   */
  information = 'info',

  /**
   * Success.
   */
  success = 'success',

  /**
   * Warning
   */
  warning = 'warn'
}