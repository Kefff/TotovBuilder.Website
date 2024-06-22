<template>
  <Tooltip
    :apply-hover-style="false"
    :tooltip="$t('caption.notifications')"
    position="left"
  >
    <Button
      :disabled="notifications.length === 0"
      class="p-button-text p-button-sm button-discreet"
      @click="toggleNotificationPanel"
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

  <OverlayPanel
    ref="notificationPanel"
    :dismissable="true"
  >
    <div class="notification-button-panel">
      <div v-if="notifications.length > 0">
        <a
          class="notification-button-panel-dismiss-all link"
          @click="clearNotifications()"
        >{{ $t('caption.dismissAll') }}</a>
      </div>
      <div
        v-for="notification of notifications"
        :key="notification.id"
        class="notification-button-panel-item"
      >
        <div class="notification-button-panel-item-type-icon">
          <font-awesome-icon
            :icon="getNotificationIcon(notification.type)"
            :class="'notification-button-panel-item-type-icon-' + notification.type"
          />
        </div>
        <div class="notification-button-panel-item-text">
          {{ notification.date.toLocaleTimeString() + ' : ' + notification.message }}
        </div>
        <font-awesome-icon
          icon="times"
          class="notification-button-panel-item-delete-icon"
          @click="clearNotification(notification.id)"
        />
      </div>
    </div>
  </OverlayPanel>
</template>

<script lang="ts" src="./NotificationButtonComponent.ts" />
<style scoped lang="css" src="./NotificationButtonComponent.css" />