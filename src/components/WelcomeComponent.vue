<script setup lang="ts">
import { computed, defineAsyncComponent, nextTick, onMounted, onUnmounted, ref } from 'vue'
import Images from '../images'
import { IBuild } from '../models/build/IBuild'
import vueI18n from '../plugins/vueI18n'
import router from '../plugins/vueRouter'
import { BuildService } from '../services/BuildService'
import { GlobalSidebarService } from '../services/GlobalSidebarService'
import { ImportService } from '../services/ImportService'
import { ServiceInitializationState } from '../services/repository/ServiceInitializationState'
import Services from '../services/repository/Services'
import { SeoService } from '../services/SeoService'
import { WebsiteConfigurationService } from '../services/WebsiteConfigurationService'
import StringUtils from '../utils/StringUtils'
import WebBrowserUtils from '../utils/WebBrowserUtils'
import Loading from './LoadingComponent.vue'

const BuildsList = defineAsyncComponent({
  loader: () => import('./BuildsListComponent.vue'),
  loadingComponent: Loading
})

const _buildService = Services.get(BuildService)
const _globalSidebarService = Services.get(GlobalSidebarService)
const _importService = Services.get(ImportService)
const _websiteConfigurationService = Services.get(WebsiteConfigurationService)

const _lastBuildsCount = 3

const actionsGridColumnTemplate = computed(() => {
  if (isSmartphoneLandscape.value) {
    return '1fr 1fr 1fr'
  } else if (isSmartphonePortrait.value) {
    return '1fr 1fr'
  } else {
    return '1fr 1fr 1fr 1fr 1fr'
  }
})

const hasBuilds = ref(false)
const isLoadingWebsite = ref(true)
const isLoadingLastBuilds = ref(true)
const { isSmartphoneLandscape, isSmartphonePortrait } = WebBrowserUtils.getScreenSize()

onMounted(() => {
  _importService.emitter.on(ImportService.buildsImportedEvent, goToBuilds)

  Services.get(SeoService).updateSeoMetadata()

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
function displayBuilds(): void {
  router.push({ name: 'Builds' })
}

/**
 * Displays the general options.
 */
function displayGeneralOptions(): void {
  _globalSidebarService.display({
    displayedComponentType: 'GeneralOptionsSidebar'
  })
}

/**
 * Displays the build import sidebar.
 */
function displayImportSidebar(): void {
  _globalSidebarService.display({
    displayedComponentType: 'BuildsImportSidebar'
  })
}

/**
 * Redirects to the item list page.
 */
function goToItemList(): void {
  router.push({ name: 'Items' })
}

/**
 * Displays the merchant items options.
 */
function displayMerchantItemsOptions(): void {
  _globalSidebarService.display({
    displayedComponentType: 'MerchantItemsOptionsSidebar'
  })
}

/**
 * Gets the last builds edited by the user.
 */
function getLastBuilds(): IBuild[] {
  isLoadingLastBuilds.value = true

  const builds = _buildService
    .getAll()
    .sort((build1: IBuild, build2: IBuild) => {
      const build1LastUpdatedDate = build1.lastUpdated ?? new Date()
      const build2LastUpdatedDate = build2.lastUpdated ?? new Date()

      if (build1LastUpdatedDate > build2LastUpdatedDate) {
        return 1
      } else if (build1LastUpdatedDate < build2LastUpdatedDate) {
        return -1
      } else {
        return 0
      }
    })
    .slice(-_lastBuildsCount)
  hasBuilds.value = builds.length > 0

  nextTick(() => isLoadingLastBuilds.value = false)

  return builds
}

/**
 * Navigates to the builds list.
 */
function goToBuilds(): void {
  router.push({ name: 'Builds' })
}

/**
 * Reacts to a build being selected.
 *
 * Opens a the build the user has selected.
 * @param selectedBuilds - Selected builds.
 */
function onBuildSelected(selectedBuilds: IBuild[] | undefined): void {
  if (selectedBuilds != undefined && selectedBuilds.length > 0) {
    openBuild(selectedBuilds[0].id)
  }
}

/**
 * Reacts to the website configuration service being initialized.
 *
 * Ends loading.
 */
function onWebsiteConfigurationServiceInitialized(): void {
  nextTick(() => isLoadingWebsite.value = false)
}

/**
 * Opens a build.
 * @param id - ID of the build.
 */
function openBuild(id: string): void {
  router.push({ name: 'Build', params: { id } })
}

/**
 * Opens a new build.
 */
function openNewBuild(): void {
  router.push({ name: 'NewBuild' })
}
</script>










<template>
  <div class="welcome">
    <div>
      <h1>Totov <span class="welcome-builder">Builder</span>{{ $t('message.welcome1') }}</h1>
      <p>{{ $t('message.welcome2') }}</p>
      <p>{{ $t('message.welcome3') }}</p>
      <p>{{ $t('message.welcome4') }}</p>
    </div>
    <div
      v-if="isLoadingWebsite"
      class="welcome-loading"
    >
      <Loading />
    </div>
    <div
      v-else
      v-show="!isLoadingLastBuilds"
      class="welcome-content"
    >
      <h3 v-if="hasBuilds">
        {{ $t('message.welcomeBack') }}
      </h3>
      <div class="welcome-actions">
        <div class="welcome-action">
          <Button
            class="welcome-button"
            severity="success"
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
          v-else
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
            outlined
            @click="goToItemList()"
          >
            <font-awesome-icon
              icon="clipboard-list"
              class="icon-before-text"
            />
            <span>{{ $t('caption.itemList') }}</span>
          </Button>
        </div>
        <div class="welcome-action">
          <Button
            class="welcome-button"
            outlined
            @click="displayMerchantItemsOptions()"
          >
            <font-awesome-icon
              icon="user-tag"
              class="icon-before-text"
            />
            <span>{{ $t('caption.welcomeConfigureMerchants') }}</span>
          </Button>
        </div>
        <div class="welcome-action">
          <Button
            class="welcome-button"
            outlined
            @click="displayGeneralOptions()"
          >
            <img
              class="icon-before-text"
              :src="Images['language' + StringUtils.toUpperFirst(vueI18n.locale.value)]"
            >
            <span>{{ $t('caption.language') }}</span>
          </Button>
        </div>
      </div>
      <div
        v-show="hasBuilds"
        class="welcome-build-summaries"
      >
        <h3>{{ $t('message.welcomeLastBuilds') }}</h3>
        <BuildsList
          :auto-scroll-to-first-element="false"
          :get-builds-function="getLastBuilds"
          :max-elements-per-line="_lastBuildsCount"
          :selection-options="{
            canUnselect: false,
            isEnabled: true,
            isMultiSelection: false,
            selectionButtonCaption: 'caption.edit',
            selectionButtonIcon: 'edit'
          }"
          :show-chips="false"
          :show-not-exported="false"
          @update:selected-builds="onBuildSelected"
        />
      </div>
      <div class="welcome-information">
        <h3 class="welcome-information-title">
          <font-awesome-icon
            icon="exclamation-triangle"
            class="welcome-information-icon"
          />
          <span>{{ $t('message.welcomeInformation1') }}</span>
        </h3>
        <p class="welcome-information-text">
          <span>Totov </span>
          <span class="welcome-information-lost">Builder </span>
          <span>{{ $t('message.welcomeInformation2') }}</span>
        </p>
        <p class="welcome-information-text">
          <span>{{ $t('message.welcomeInformation3') }}</span>
          <span class="welcome-information-lost">
            {{ $t('message.welcomeInformation4') }}
          </span>
          <span>.</span>
        </p>
        <p class="welcome-information-text">
          <span>{{ $t('message.welcomeInformation5') }}</span>
          <span class="welcome-information-functionality">
            <font-awesome-icon icon="download" />
            {{ $t('caption.exportBuilds') }}
          </span>
          <span>{{ $t('message.welcomeInformation6') }}</span>
          <span class="welcome-information-functionality">
            <font-awesome-icon icon="file-upload" />
            {{ $t('caption.importBuilds') }}
          </span>
          <span>{{ $t('message.welcomeInformation7') }}</span>
        </p>
      </div>
    </div>
  </div>
</template>










<style scoped>
.welcome {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.welcome h1 {
  margin-bottom: 0.5rem;
  margin-top: 0;
  font-size: 1.5rem;
  line-height: normal;
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
  width: 100%;
}

.welcome-actions {
  align-items: center;
  display: grid;
  grid-template-columns: v-bind(actionsGridColumnTemplate);
  gap: 1rem;
  justify-content: center;
  margin-top: auto;
}

.welcome-builder {
  color: var(--error-color);
}

.welcome-build-summaries {
  margin-top: 3rem;
}

.welcome-button {
  height: 7.5rem;
  justify-content: center;
  width: 100%;
}

.welcome-content {
  display: flex;
  flex-direction: column;
  height: 100%;
  margin-top: 3rem;
  max-width: 80rem;
}

.welcome-loading {
  height: 100%;
  margin-top: 3rem;
}

.welcome-information {
  margin-top: 9rem;
  margin-bottom: auto;
  padding-bottom: 6rem;
}

.welcome-information > p {
  align-items: center;
  display: flex;
  flex-direction: row;
}

.welcome-information-icon {
  margin-right: 0.5rem;
}

.welcome-information-lost {
  color: var(--error-color);
}

.welcome-information-text {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  white-space: preserve;
}

.welcome-information-functionality {
  color: var(--primary-color);
  margin-left: 0.25rem;
  margin-right: 0.25rem;
}

.welcome-information-title {
  align-items: center;
  color: var(--warning-color);
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
}
</style>










<style>
.welcome-action .p-button-outlined {
  background-color: var(--surface-transparent-0);
  border-width: 3px;
}
</style>