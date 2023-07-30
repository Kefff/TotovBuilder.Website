<template>
  <div class="notification-toast">
    <Message
      v-for="toastNotification of toastNotifications"
      :key="toastNotification.id"
      :closable="toastNotification.closable"
      :life="toastNotification.toastDuration"
      :severity="toastNotification.type"
      :sticky="false"
    >
      <p :style="{ whiteSpace: 'pre-line' }">
        <!-- <p> used to allow line breaks -->
        {{ toastNotification.message }}
      </p>
      <div class="notification-toast-buttons">
        <div
          class="notification-toast-buttons-grid"
          :style="getButtonsGridTemplaceCss(toastNotification)"
        >
          <Button
            v-for="button of toastNotification.buttons"
            :key="button.name"
            :severity="getSeverity(button)"
            :class="button.type == null ? 'p-button-text button-discreet' : ''"
            @click="executeButtonAction(toastNotification, button)"
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