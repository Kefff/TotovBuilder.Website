import { defineComponent, ref } from 'vue'
import { INotification } from '../../models/utils/INotification'
import { NotificationService, NotificationType } from '../../services/NotificationService'
import Services from '../../services/repository/Services'
import { WebsiteConfigurationService } from '../../services/WebsiteConfigurationService'
import { INotificationButton } from '../../models/utils/INotificationButton'

export default defineComponent({
  setup: () => {
    const notificationService = Services.get(NotificationService)
    const websiteConfigurationService = Services.get(WebsiteConfigurationService)

    const errorDuration = websiteConfigurationService.configuration.notificationErrorDuration * 1000 // In milliseconds
    const informationDuration = websiteConfigurationService.configuration.notificationInformationDuration * 1000 // In milliseconds
    const successDuration = websiteConfigurationService.configuration.notificationSuccessDuration * 1000 // In milliseconds
    const warningDuration = websiteConfigurationService.configuration.notificationWarningDuration * 1000 // In milliseconds

    const toastNotifications = ref<INotification[]>([])

    notificationService.emitter.on(notificationService.addedEventName, (notification: INotification) => {
      if (notification.toast) {
        toastNotifications.value.push(notification)

      }
    })

    /**
     * Executes the action linked to a notification button.
     * @param notification - Notification linked to the button.
     * @param button - Notification button.
     */
    function executeButtonAction(notification: INotification, button: INotificationButton) {
      if (button.action != null) {
        button.action()
      }

      const notificationIndex = toastNotifications.value.indexOf(notification)
      toastNotifications.value.splice(notificationIndex, 1)
    }

    /**
     * Gets buttons grid templace CSS for a toast notification.
     * @param toastNotification - Toast notification.
     * @returns Buttons grid templace CSS.
     */
    function getButtonsGridTemplaceCss(toastNotification: INotification): string {
      let buttonsGridTemplaceCss = 'grid-template-columns:'
      toastNotification.buttons.forEach(() => buttonsGridTemplaceCss += ' 1fr')

      return buttonsGridTemplaceCss
    }

    /**
     * Gets the severity for a notification button.
     * @param button - Notification button.
     */
    function getSeverity(button: INotificationButton) {
      switch (button.type) {
        case NotificationType.error:
          return 'danger'
        case NotificationType.warning:
          return 'warning'
        default:
          return button.type
      }
    }

    return {
      errorDuration,
      executeButtonAction,
      getButtonsGridTemplaceCss,
      getSeverity,
      informationDuration,
      successDuration,
      toastNotifications,
      warningDuration
    }
  }
})