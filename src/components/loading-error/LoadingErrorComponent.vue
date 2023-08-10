<template>
  <Dialog
    v-model:visible="hasLoadingError"
    :closable="false"
    :modal="true"
    :draggable="false"
  >
    <div class="loading-error-message">
      <img src="/assets/prapor_angry.webp">
      <p>{{ $t('message.websiteLoadingError') }}</p>
    </div>
    <div class="loading-error-buttons">
      <Button
        class="loading-error-button"
        @click="reload()"
      >
        <font-awesome-icon
          icon="undo"
          class="icon-before-text"
        />
        <span>{{ $t('caption.reloadPage') }}</span>
      </Button>
      <Button
        class="loading-error-button"
        @click="signal()"
      >
        <font-awesome-icon
          icon="bug"
          class="icon-before-text"
        />
        <span>{{ $t('caption.signalProblem') }}</span>
      </Button>
    </div>
  </Dialog>
</template>

<script lang="ts" src="./LoadingErrorComponent.ts" />
<style scoped lang="css" src="./LoadingErrorComponent.css" />
