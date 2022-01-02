import { NotificationType } from '../../services/NotificationService'

/**
 * Provides the functionalities of a notification message.
 */
export interface INotification {
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
   * Indicates whether a notification will be displayed as a toast or not.
   */
  toast: boolean

  /**
   * Toast duration.
   */
  toastDuration: number | undefined

  /**
   * Type.
   */
  type: NotificationType
}