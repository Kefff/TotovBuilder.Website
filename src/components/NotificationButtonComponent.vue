<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
import { INotification } from '../models/utils/INotification'
import { GlobalSidebarService } from '../services/GlobalSidebarService'
import { NotificationService } from '../services/NotificationService'
import Services from '../services/repository/Services'
import Tooltip from './TooltipComponent.vue'

const _globalSidebarService = Services.get(GlobalSidebarService)
const _notificationService = Services.get(NotificationService)

const notifications = ref<INotification[]>([])
const newNotificationCount = ref(_notificationService.newNotificationCount)

onMounted(() => {
  _notificationService.emitter.on(_notificationService.addedEventName, onNotificationCountChanged)
  _notificationService.emitter.on(_notificationService.clearedEventName, onNotificationCountChanged)

  notifications.value = _notificationService.getNotifications()
  newNotificationCount.value = _notificationService.newNotificationCount
})

onUnmounted(() => {
  _notificationService.emitter.off(_notificationService.addedEventName, onNotificationCountChanged)
  _notificationService.emitter.off(_notificationService.clearedEventName, onNotificationCountChanged)
})

/**
 * Reacts to the click on the notification button.
 *
 * Displays the notification sidebar.
 * @param event - Event.
 */
function onClick(event?: MouseEvent) {
  // Stopping the event propagation, otherwise, when we click on the badge showing the number of notifications,
  // the method is called one time for the badge and another time for the button
  event?.stopPropagation()

  _globalSidebarService.display({
    displayedComponentType: 'NotificationsSidebar'
  })
  _notificationService.resetNewNotificationCount()
  newNotificationCount.value = _notificationService.newNotificationCount
}

/**
 * Reacts to a new notification being added.
 *
 * Updates the new notifications count.
 */
function onNotificationCountChanged() {
  notifications.value = _notificationService.getNotifications()
  newNotificationCount.value = _notificationService.newNotificationCount
}
</script>










<template>
  <Tooltip
    :apply-hover-style="false"
    :tooltip="$t('caption.notifications')"
    position="left"
  >
    <Button
      :disabled="notifications.length === 0"
      class="p-button-text p-button-sm button-discreet notification-button"
      @click="onClick()"
    >
      <font-awesome-icon icon="bell" />
      <div
        v-if="newNotificationCount > 0"
        class="notification-button-count"
      >
        <div>{{ newNotificationCount }}</div>
      </div>
    </Button>
  </Tooltip>
</template>










<style scoped>
@import '../css/button.css';

.notification-button {
  position: relative;
}

.notification-button-count {
  background-color: var(--danger-color);
  border-radius: 1rem;
  color: var(--text-color);
  font-size: 0.85rem;
  height: 1rem;
  position: absolute;
  text-align: center;
  transform: translate(0.5rem, 0.5rem);
  width: 1rem;
}

.notification-button-count > div {
  position: absolute;
  transform: translate(0, -0.050rem);
  width: 100%;
}

.notification-button-panel {
  max-height: 31.25rem;
  max-width: 31.25rem;
  overflow: auto;
}

.notification-button-panel-item {
  align-items: center;
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  margin-top: 0.5rem;
  padding: 0.5rem;
}
</style>