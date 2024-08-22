<template>
  <div class="welcome">
    <div>
      <div
        v-if="!hasBuilds"
        class="welcome-text"
      >
        <h2>{{ $t('message.welcome1') }}Totov <span class="welcome-builder">Builder</span>{{ $t('message.welcome2') }}</h2>
        <p>Totov <span class="welcome-builder">Builder</span>{{ $t('message.welcome3') }}</p>
        <p>{{ $t('message.welcome4') }}</p>
        <p>{{ $t('message.welcome5') }}</p>
        <p>{{ $t('message.welcome6') }}</p>
      </div>
      <div
        v-else
        class="welcome-text"
      >
        <h2>{{ $t('message.welcomeBack') }}</h2>
      </div>
      <div
        v-show="isLoading"
        class="welcome-loading"
      >
        <Loading />
      </div>
      <div
        v-show="!isLoading"
        class="welcome-actions"
      >
        <div
          v-if="hasBuilds"
          class="welcome-action"
        >
          <Button
            class="welcome-button"
            @click="displayBuilds()"
          >
            <font-awesome-icon
              icon="list"
              class="icon-before-text"
            />
            <span>{{ $t('message.welcomeShowBuilds') }}</span>
          </Button>
        </div>
        <div
          v-if="!hasBuilds"
          class="welcome-action"
        >
          <Button
            class="welcome-button"
            @click="openNewBuild()"
          >
            <font-awesome-icon
              icon="plus"
              class="icon-before-text"
            />
            <span>{{ $t('caption.createNewBuild') }}</span>
          </Button>
        </div>
        <div
          v-if="!hasBuilds"
          class="welcome-action"
        >
          <Button
            class="welcome-button"
            @click="displayImportSidebar()"
          >
            <font-awesome-icon
              icon="file-upload"
              class="icon-before-text"
            />
            <span>{{ $t('caption.importBuilds') }}</span>
          </Button>
        </div>
        <div class="welcome-action">
          <Button
            class="welcome-button"
            @click="displayMerchantItemsOptions()"
          >
            <font-awesome-icon
              icon="user-tag"
              class="icon-before-text"
            />
            <span>{{ $t('message.welcomeConfigureMerchants') }}</span>
          </Button>
        </div>
        <div class="welcome-action">
          <Button
            class="welcome-button"
            @click="displayGeneralOptions()"
          >
            <font-awesome-icon
              icon="language"
              class="icon-before-text"
            />
            <span>{{ $t('message.welcomeChooseLanguage') }}</span>
          </Button>
        </div>
      </div>
      <div class="welcome-warning">
        <h3 class="welcome-warning-title">
          <font-awesome-icon
            icon="exclamation-triangle"
            class="welcome-warning-icon"
          />
          {{ $t('message.welcomeWarning1') }}
        </h3>
        <p class="welcome-warning-text">
          {{ $t('message.welcomeWarning2') }} <span><font-awesome-icon icon="file-export" /> {{ $t('caption.exportBuilds') }}</span> {{ $t('message.welcomeWarning3') }}
        </p>
        <p class="welcome-warning-lost">
          {{ $t('message.welcomeWarning4') }}
        </p>
        <p class="welcome-warning-text">
          {{ $t('message.welcomeWarning5') }} <span><font-awesome-icon icon="file-import" /> {{ $t('caption.importBuilds') }}</span> {{ $t('message.welcomeWarning6') }}
        </p>
      </div>
    </div>
  </div>
</template>










<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
import router from '../plugins/vueRouter'
import { BuildService } from '../services/BuildService'
import { GlobalSidebarService } from '../services/GlobalSidebarService'
import { ImportService } from '../services/ImportService'
import { ServiceInitializationState } from '../services/repository/ServiceInitializationState'
import Services from '../services/repository/Services'
import { WebsiteConfigurationService } from '../services/WebsiteConfigurationService'
import Loading from './LoadingComponent.vue'

const _globalSidebarService = Services.get(GlobalSidebarService)
const _importService = Services.get(ImportService)
const _websiteConfigurationService = Services.get(WebsiteConfigurationService)

const hasBuilds = ref(false)
const isLoading = ref(true)

onMounted(() => {
  _importService.emitter.on(ImportService.buildsImportedEvent, goToBuilds)

  if (_websiteConfigurationService.initializationState === ServiceInitializationState.initializing) {
    _websiteConfigurationService.emitter.once(WebsiteConfigurationService.initializationFinishedEvent, onWebsiteConfigurationServiceInitialized)
  } else {
    onWebsiteConfigurationServiceInitialized()
  }
})

onUnmounted(() => {
  _importService.emitter.off(ImportService.buildsImportedEvent, goToBuilds)
})

/**
 * Displays the list of builds.
 */
function displayBuilds() {
  router.push({ name: 'Builds' })
}

/**
 * Displays the general options.
 */
function displayGeneralOptions() {
  _globalSidebarService.display({
    displayedComponentType: 'GeneralOptionsSidebar'
  })
}

/**
 * Displays the build import sidebar.
 */
function displayImportSidebar() {
  _globalSidebarService.display({
    displayedComponentType: 'BuildsImportSidebar'
  })
}

/**
 * Displays the merchant items options.
 */
function displayMerchantItemsOptions() {
  _globalSidebarService.display({
    displayedComponentType: 'MerchantItemsOptionsSidebar'
  })
}

/**
 * Navigates to the builds list.
 */
function goToBuilds() {
  router.push({ name: 'Builds' })
}

/**
 * Racts to the website configuration service being iniialized.
 *
 * Gets builds and ends loading.
 */
function onWebsiteConfigurationServiceInitialized() {
  hasBuilds.value = Services.get(BuildService).getAll().length > 0
  isLoading.value = false
}

/**
 * Opens a new build.
 */
function openNewBuild() {
  router.push({ name: 'NewBuild' })
}
</script>










<style scoped>
@import '../css/icon.css';

.welcome {
  display: flex;
  flex-direction: column;
  margin-top: auto;
  margin-bottom: auto;
}

.welcome > div {
  margin-left: auto;
  margin-right: auto;
}

.welcome h2 {
  margin-bottom: 0.5rem;
  margin-top: 0;
}

.welcome h3 {
  margin-bottom: 0.5rem;
  margin-top: 0;
}

.welcome p {
  margin-bottom: 0;
  margin-top: 0.25rem;
}

.welcome h3 {
  margin-bottom: 0.5rem;
  margin-top: 0;
}

.welcome-action {
  margin-left: auto;
  margin-right: auto;
  margin-top: 1rem;
  padding-left: 1rem;
  padding-right: 1rem;
  width: 17.5rem;
}

.welcome-action:last-child {
  margin-bottom: 1rem;
}

.welcome-actions {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  margin-left: auto;
  margin-right: auto;
  margin-top: 6rem;
}

.welcome-builder {
  color: var(--error-color);
}

.welcome-button {
  height: 7.5rem;
  justify-content: center;
  margin-bottom: 1.5rem;
  margin-left: auto;
  margin-right: auto;
  width: 100%;
}

.welcome-button:last-child {
  margin-bottom: 0;
}

.welcome-loading {
  margin-bottom: 6rem;
  margin-top: 6rem;
}

.welcome-text {
  margin-top: 6rem;
}

.welcome-warning {
  margin-bottom: 6rem;
  margin-top: 6rem;
}

.welcome-warning > p {
  align-items: center;
  display: flex;
  flex-direction: row;
}

.welcome-warning-icon {
  margin-right: 0.5rem;
}

.welcome-warning-lost {
  color: var(--error-color);
}

.welcome-warning-text {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
}

.welcome-warning-text > span {
  color: var(--primary-color);
  margin-left: 0.25rem;
  margin-right: 0.25rem;
}

.welcome-warning-title {
  align-items: center;
  color: var(--warning-color);
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
}
</style>