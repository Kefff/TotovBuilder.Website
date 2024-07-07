<template>
  <div class="notification">
    <Message
      v-for="notification of notifications"
      :key="notification.id"
      :closable="notification.closable"
      :life="notification.toastDuration"
      :severity="notification.type"
      :sticky="false"
    >
      <div class="notification-text">
        {{ notification.message }}
      </div>
      <div class="notification-buttons">
        <div
          class="notification-buttons-grid"
          :style="getButtonsGridTemplaceCss(notification)"
        >
          <Button
            v-for="button of notification.buttons"
            :key="button.name"
            :severity="getSeverity(button)"
            :class="button.type == null ? 'p-button-text button-discreet' : ''"
            @click="executeButtonAction(notification, button)"
          >
            <font-awesome-icon
              v-if="button.icon != null"
              :icon="button.icon"
            />
            <span class="notification-buttons-text">{{ button.caption }}</span>
          </Button>
        </div>
      </div>
    </Message>
  </div>
</template>










<script setup lang="ts">
import { ref } from 'vue'
import { INotification } from '../models/utils/INotification'
import { INotificationButton } from '../models/utils/INotificationButton'
import { NotificationService, NotificationType } from '../services/NotificationService'
import Services from '../services/repository/Services'

const notificationService = Services.get(NotificationService)

const notifications = ref<INotification[]>([])

notificationService.emitter.on(notificationService.addedEventName, (notification: INotification) => {
  notifications.value.push(notification)
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

  const notificationIndex = notifications.value.indexOf(notification)
  notifications.value.splice(notificationIndex, 1)
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
</script>










<style scoped>
.notification {
  align-items: flex-end;
  bottom: 0;
  display: flex;
  flex-direction: column;
  max-width: 33%;
  margin-left: 1rem;
  margin-right: 1rem;
  position: fixed;
  right: 0;
  z-index: 2;
}

.notification-text {
  /* Keeps line breaks */
  white-space: preserve;
}

.notification > .p-message {
  margin-bottom: 1rem;
  margin-top: 0;
  width: fit-content;
}

.notification > .p-message:first-child {
  margin-top: 1rem;
}

.notification-buttons {
  align-items: center;
  display: flex;
  justify-content: center;
  margin-top: 0.5rem
}

.notification-buttons-grid {
  display: grid;
  grid-gap: 1rem;
}

.notification-buttons-text {
  width: 100%;
}

/* Smartphone in portrait */
@media only screen and (min-width: 320px) and (max-width: 480px) {
  .notification {
    max-width: unset;
  }
}

/* Smartphone in landscape */
@media only screen and (min-width: 481px) and (max-width: 767px) {
  .notification {
    max-width: unset;
  }
}

/* Tablet in portrait */
@media only screen and (min-width: 768px) and (max-width: 991px) {}

/* Tablet in landscape */
@media only screen and (min-width: 992px) and (max-width: 1199px) {}

/* PC */
@media only screen and (min-width: 1200px) {}
</style>