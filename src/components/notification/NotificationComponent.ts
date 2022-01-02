import { defineComponent, ref } from 'vue'
import Configuration from '../../../test-data/configuration.json'
import { INotification } from '../../models/utils/INotification'
import { NotificationService } from '../../services/NotificationService'
import Services from '../../services/repository/Services'

export default defineComponent({
  setup: () => {
    const service = Services.get(NotificationService)

    const toastNotifications = ref<INotification[]>([])

    service.emitter.on(service.addedEventName, (notification: INotification) => {
      if (notification.toast) {
        toastNotifications.value.push(notification)
      }
    })

    return {
      errorDuration: Number(Configuration.VITE_NOTIFICATION_ERROR_DURATION as string),
      informationDuration: Number(Configuration.VITE_NOTIFICATION_INFORMATION_DURATION as string),
      successDuration: Number(Configuration.VITE_NOTIFICATION_SUCCESS_DURATION as string),
      toastNotifications,
      warningDuration: Number(Configuration.VITE_NOTIFICATION_WARNING_DURATION as string)
    }
  }
})