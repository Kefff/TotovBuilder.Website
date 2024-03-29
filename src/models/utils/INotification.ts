import { NotificationType } from '../../services/NotificationService'
import { INotificationButton } from './INotificationButton'

/**
 * Provides the functionalities of a notification message.
 */
export interface INotification {
  /**
   * Buttons displayed on the notification.
   */
  buttons: INotificationButton[]

  /**
   * Indicates whether the default close button is displayed.
   */
  closable: boolean,

  /**
   * Date.
   */
  date: Date,

  /**
   * ID.
   */
  id: string,

  /**
   * Message.
   */
  message: string

  /**
   * Toast duration.
   */
  toastDuration: number | undefined

  /**
   * Type.
   */
  type: NotificationType
}