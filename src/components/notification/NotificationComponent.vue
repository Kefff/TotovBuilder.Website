<template>
  <div class="notification-toast">
    <Message
      v-for="toastNotification of toastNotifications"
      :key="toastNotification.id"
      :closable="true"
      :life="toastNotification.toastDuration"
      :severity="toastNotification.type"
      :sticky="false"
    >
      <p :style="{ whiteSpace: 'pre-wrap' }">
        {{ toastNotification.message }}
      </p>
    </Message>
  </div>
</template>

<script lang="ts" src="./NotificationComponent.ts" />
<style scoped lang="css" src="./NotificationComponent.css" />