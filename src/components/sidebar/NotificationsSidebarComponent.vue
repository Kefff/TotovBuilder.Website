<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
import { INotification } from '../../models/utils/INotification'
import { GlobalSidebarService } from '../../services/GlobalSidebarService'
import { NotificationService, NotificationType } from '../../services/NotificationService'
import Services from '../../services/repository/Services'

defineProps<{ parameters: undefined }>()

const _globalSidebarService = Services.get(GlobalSidebarService)
const _notificationService = Services.get(NotificationService)

const notifications = ref<INotification[]>([])

onMounted(() => {
  _notificationService.emitter.on(_notificationService.addedEventName, onNotificationAdded)

  notifications.value = _notificationService.getNotifications()
})

onUnmounted(() => {
  _notificationService.emitter.off(_notificationService.addedEventName, onNotificationAdded)
})

/**
 * Clears all notifications.
 */
function clearNotifications(id?: string): void {
  if (id == null) {
    _notificationService.clearNotifications()
  } else {
    _notificationService.clearNotification(id)
  }

  notifications.value = _notificationService.getNotifications()

  if (notifications.value.length === 0) {
    _globalSidebarService.close('NotificationsSidebar')
  }
}

/**
 * Gets the icon matching a notification type.
 * @param type - Notification type.
 * @returns Icon.
 */
function getNotificationIcon(type: NotificationType): string {
  switch (type) {
    case NotificationType.error:
      return 'exclamation-circle'
    case NotificationType.success:
      return 'check'
    case NotificationType.warning:
      return 'exclamation-triangle'
    default:
      return 'info-circle'
  }
}

/**
 * Reacts to a new notification being added.
 *
 * Updates the new notifications count.
 */
function onNotificationAdded(): void {
  notifications.value = _notificationService.getNotifications()
}
</script>










<template>
  <div class="sidebar-option">
    <div class="notifications">
      <div
        v-show="notifications.length > 0"
        class="notifications-dismiss-all"
      >
        <a
          class="link"
          @click="clearNotifications()"
        >{{ $t('caption.dismissAll') }}</a>
      </div>
      <div v-if="notifications.length === 0">
        {{ $t('caption.noNotifications') }}
      </div>
      <div
        v-for="notification of notifications"
        :key="notification.id"
        class="notifications-item"
      >
        <div class="notifications-item-type-icon">
          <font-awesome-icon
            :icon="getNotificationIcon(notification.type)"
            :class="'notifications-item-type-icon-' + notification.type"
          />
        </div>
        <div class="notifications-item-text">
          {{ notification.date.toLocaleTimeString() + ' : ' + notification.message }}
        </div>
        <font-awesome-icon
          icon="times"
          class="notifications-item-delete-icon"
          @click="clearNotifications(notification.id)"
        />
      </div>
    </div>
  </div>
</template>










<style scoped>
@import '../../css/link.css';
@import '../../css/sidebar.css';

.notifications {
  max-height: 31.25rem;
  max-width: 31.25rem;
  overflow: auto;
}

.notifications-dismiss-all {
  text-align: right;
}

.notifications-item {
  align-items: center;
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  margin-top: 1rem;
}

.notifications-item-delete-icon {
  color: var(--error-color);
  margin-left: auto;
}

.notifications-item-delete-icon:hover {
  cursor: pointer;
}

.notifications-item-text {
  margin-right: 0.5rem;
  white-space: preserve;
}

.notifications-item-type-icon {
  text-align: center;
}

.notifications-item-type-icon-error {
  color: var(--error-color);
  width: 1rem;
  margin-right: 0.5rem;
}

.notifications-item-type-icon-info {
  color: var(--info-color);
  width: 1rem;
  margin-right: 0.5rem;
}

.notifications-item-type-icon-success {
  color: var(--success-color);
  width: 1rem;
  margin-right: 0.5rem;
}

.notifications-item-type-icon-warn {
  color: var(--warning-color);
  width: 1rem;
  margin-right: 0.5rem;
}
</style>