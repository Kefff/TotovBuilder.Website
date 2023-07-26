import { NotificationType } from '../../services/NotificationService'

/**
 * Provides the functionalities of a notification button.
 */
export interface INotificationButton {
  /**
   * Action executed when clicking on the button.
   * If left undefined, the button will just close the notification.
   */
  action: (() => void) | undefined

  /**
   * Caption displayed on the button.
   */
  caption: string

  /**
   * Icon displayed on the button.
   */
  icon: string | undefined

  /**
   * Name of the button.
   */
  name: string

  /**
   * Type of the button.
   * Used to choose the button color.
   */
  type: NotificationType | undefined
}