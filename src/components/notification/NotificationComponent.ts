import { defineComponent, ref } from 'vue'
import { INotification } from '../../models/utils/INotification'
import { NotificationService } from '../../services/NotificationService'
import Services from '../../services/repository/Services'
import { WebsiteConfigurationService } from '../../services/WebsiteConfigurationService'

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

    return {
      errorDuration,
      informationDuration,
      successDuration,
      toastNotifications,
      warningDuration
    }
  }
})