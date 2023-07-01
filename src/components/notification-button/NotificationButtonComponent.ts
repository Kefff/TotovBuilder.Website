import { defineComponent, onMounted, ref } from 'vue'
import { INotification } from '../../models/utils/INotification'
import { NotificationService, NotificationType } from '../../services/NotificationService'
import Services from '../../services/repository/Services'

export default defineComponent({
  setup: () => {
    const service = Services.get(NotificationService)

    const notificationPanel = ref()
    const notificationPanelToggled = ref(false)
    const notifications = ref<INotification[]>([])
    const newNotificationCount = ref(service.newNotificationCount)

    service.emitter.on(service.addedEventName, () => {
      notifications.value = service.getNotifications()
      newNotificationCount.value = service.newNotificationCount
    })

    onMounted(() => {
      notifications.value = service.getNotifications()
      newNotificationCount.value = service.newNotificationCount
    })

    /**
     * Clears a notification.
     * @param id - ID.
     */
    function clearNotification(id: string) {
      service.clearNotification(id)
      notifications.value = service.getNotifications()

      if (notifications.value.length === 0) {
        toggleNotificationPanel(undefined)
      }
    }

    /**
     * Clears all notifications.
     */
    function clearNotifications() {
      service.clearNotifications()
      notifications.value = service.getNotifications()

      if (notifications.value.length === 0) {
        toggleNotificationPanel(undefined)
      }
    }

    /**
     * Gets the icon matching a notification type.
     * @param type - Notification type.
     * @returns Icon.
     */
    function getNotificationIcon(type: NotificationType) {
      switch (type) {
        case NotificationType.error:
          return 'exclamation-circle'
        case NotificationType.success:
          return 'check'
        case NotificationType.warning:
          return 'exclamation-triangle'
        default:
          return 'info'
      }
    }

    /**
     * Toggles the notification panel.
     * @param event - Event.
     */
    function toggleNotificationPanel(event?: MouseEvent) {
      if (notifications.value.length === 0 && !notificationPanelToggled.value) {
        return
      }

      notificationPanel.value.toggle(event)
      notificationPanelToggled.value = !notificationPanelToggled.value

      if (notificationPanelToggled.value) {
        service.resetNewNotificationCount()
        newNotificationCount.value = service.newNotificationCount
      }

      // Stopping the event propagation, otherwise, when we click on the badge showing the number of notifications,
      // the method is called one time for the badge and another time for the button
      event?.stopPropagation()
    }

    return {
      clearNotification,
      clearNotifications,
      getNotificationIcon,
      newNotificationCount,
      notificationPanel,
      notifications,
      toggleNotificationPanel
    }
  }
})