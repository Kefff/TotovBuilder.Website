<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import Images from '../images'
import { ItemService } from '../services/ItemService'
import { WebsiteConfigurationService } from '../services/WebsiteConfigurationService'
import { ServiceInitializationState } from '../services/repository/ServiceInitializationState'
import Services from '../services/repository/Services'

const _itemService = Services.get(ItemService)
const _websiteConfigurationService = Services.get(WebsiteConfigurationService)

const hasItemError = ref(false)
const hasWebsiteConfigurationError = ref(false)

const hasLoadingError = computed(() => hasItemError.value || hasWebsiteConfigurationError.value)

onMounted(() => {
  if (_websiteConfigurationService.initializationState === ServiceInitializationState.initializing) {
    _websiteConfigurationService.emitter.once(WebsiteConfigurationService.initializationFinishedEvent, onWebsiteConfigurationServiceInitialized)
  } else {
    onWebsiteConfigurationServiceInitialized()
  }

  if (_itemService.initializationState === ServiceInitializationState.initializing) {
    _itemService.emitter.once(ItemService.initializationFinishedEvent, onItemServiceInitialized)
  } else {
    onItemServiceInitialized()
  }
})

/**
 * Reacts to the item service being initialized.
 *
 * Checks whether an item loading error has occured and signals it to the parent component.
 */
function onItemServiceInitialized(): void {
  hasItemError.value = _itemService.initializationState === ServiceInitializationState.error
}

/**
 * Reacts to the website configuration service being initialized.
 *
 * Checks whether a website configuration loading error has occured and signals it to the parent component.
 */
function onWebsiteConfigurationServiceInitialized(): void {
  hasWebsiteConfigurationError.value = _websiteConfigurationService.initializationState === ServiceInitializationState.error
}

/**
 * Reloads the page.
 */
function reload(): void {
  location.reload()
}

/**
 * Opens the report a bug link.
 */
function signal(): void {
  const url = Services.get(WebsiteConfigurationService).configuration.bugReportUrl
  window.open(url)
}
</script>










<template>
  <Dialog
    v-if="hasLoadingError"
    :visible="true"
    :closable="false"
    :modal="true"
    :draggable="false"
    :header="$t('caption.error')"
  >
    <div class="loading-error-message">
      <img
        :src="Images.praporAngry"
        class="loading-error-message-image"
      >
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










<style scoped>
.loading-error-button {
  justify-content: center;
  margin-left: auto;
  margin-right: auto;
  width: 100%;
}

.loading-error-buttons {
  display: grid;
  grid-gap: 1rem;
  grid-template-columns: 1fr 1fr;
  margin-top: 1rem;
}

.loading-error-message {
  align-items: center;
  color: var(--error-color);
  display: flex;
  font-weight: bold;
  justify-content: center;
  flex-direction: row;
  flex-wrap: nowrap;
  white-space: pre-line;
}

.loading-error-message-image {
  height: 6rem;
  width: 6rem;
}
</style>