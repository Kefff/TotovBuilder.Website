<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
import { INotification } from '../models/utils/INotification'
import { INotificationButton } from '../models/utils/INotificationButton'
import { NotificationService, NotificationType } from '../services/NotificationService'
import Services from '../services/repository/Services'

const _notificationService = Services.get(NotificationService)

const notifications = ref<INotification[]>([])

const doNotShowAgain = ref(false)

onMounted(() => {
  _notificationService.emitter.on(_notificationService.addedEventName, onNewNotification)
})

onUnmounted(() => {
  _notificationService.emitter.off(_notificationService.addedEventName, onNewNotification)
})

/**
 * Reacts to a notification being closed.
 *
 * Saves the "Do not show again" value.
 */
function onClose(notification: INotification): void {
  if (notification.showNotificationStorageKey != null) {
    localStorage.setItem(notification.showNotificationStorageKey, (!doNotShowAgain.value).toString())
  }

  doNotShowAgain.value = false
}

/**
 * Executes the action linked to a notification button.
 * @param notification - Notification linked to the button.
 * @param button - Notification button.
 */
function executeButtonAction(notification: INotification, button: INotificationButton): void {
  if (button.action != null) {
    button.action()
  }

  onClose(notification)

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
function getSeverity(button: INotificationButton): string {
  switch (button.type) {
    case NotificationType.error:
      return 'danger'
    case NotificationType.warning:
      return 'warning'
    default:
      return button.type as string
  }
}

/**
 * Reacts to the a new notification.
 *
 * Adds the new notification to the notifications list.
 */
function onNewNotification(notification: INotification): void {
  notifications.value.push(notification)
}
</script>










<template>
  <div class="notification">
    <Message
      v-for="notification of notifications"
      :key="notification.id"
      :closable="notification.closable"
      :life="notification.toastDuration"
      :severity="notification.type"
      :sticky="false"
      @close="() => onClose(notification)"
      @life-end="() => onClose(notification)"
    >
      <div class="notification-text">
        {{ notification.message }}
      </div>
      <div
        v-if="notification.showNotificationStorageKey != null"
        class="notification-do-not-show-again"
      >
        <Checkbox
          v-model="doNotShowAgain"
          :binary="true"
        />
        <span>{{ $t('caption.doNotShowAgain') }}</span>
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
              class="icon-before-text"
              :icon="button.icon"
            />
            <span class="notification-buttons-text">{{ button.caption }}</span>
          </Button>
        </div>
      </div>
    </Message>
  </div>
</template>










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
  z-index: 9999;
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

.notification-do-not-show-again {
  display: flex;
  gap: 0.5rem;
  margin-top: 0.5rem;
}

/* Smartphone in portrait */
@media only screen and (max-width: 480px) {
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
@media only screen and (min-width: 992px) and (max-width: 1299px) {}

/* PC */
@media only screen and (min-width: 1300px) {}
</style>