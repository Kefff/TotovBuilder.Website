<template>
  <div class="notification-toast">
    <Message
      v-for="notification of notifications"
      :key="notification.id"
      :closable="notification.closable"
      :life="notification.toastDuration"
      :severity="notification.type"
      :sticky="false"
    >
      <p :style="{ whiteSpace: 'pre-line' }">
        <!-- <p> used to allow line breaks -->
        {{ notification.message }}
      </p>
      <div class="notification-toast-buttons">
        <div
          class="notification-toast-buttons-grid"
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
            <span class="notification-toast-buttons-text">{{ button.caption }}</span>
          </Button>
        </div>
      </div>
    </Message>
  </div>
</template>

<script lang="ts" src="./NotificationComponent.ts" />
<style scoped lang="css" src="./NotificationComponent.css" />