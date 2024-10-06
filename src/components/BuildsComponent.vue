<template>
  <div class="builds">
    <div class="builds-title builds-title-outside-toolbar">
      {{ $t('caption.buildsList') }}
    </div>
    <Toolbar
      ref="buildsToolbar"
      :buttons="toolbarButtons"
    >
      <template #center>
        <div class="builds-title builds-title-in-toolbar">
          {{ $t('caption.buildsList') }}
        </div>
      </template>
      <template #right>
        <NotificationButton />
      </template>
    </Toolbar>
    <BuildsList
      v-model:filter-and-sorting-data="filterAndSortingData"
      :build-summaries="buildSummaries"
      :element-to-stick-to="toolbarContainer"
      :is-loading="isLoading"
      selection-button-caption="caption.edit"
      selection-button-icon="edit"
      @update:filter-and-sorting-data="onFilterAndSortingDataChanged"
      @update:selected-builds="onBuildSelected"
    />
  </div>
</template>










<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, useTemplateRef, watch } from 'vue'
import { useRouter } from 'vue-router'
import { IBuild } from '../models/build/IBuild'
import BuildFilterAndSortingData from '../models/utils/BuildFilterAndSortingData'
import { IBuildSummary } from '../models/utils/IBuildSummary'
import { IToolbarButton } from '../models/utils/IToolbarButton'
import { SortingOrder } from '../models/utils/SortingOrder'
import vueI18n from '../plugins/vueI18n'
import { BuildPropertiesService } from '../services/BuildPropertiesService'
import { BuildService } from '../services/BuildService'
import { ExportService } from '../services/ExportService'
import { GlobalFilterService } from '../services/GlobalFilterService'
import { GlobalSidebarService } from '../services/GlobalSidebarService'
import { ImportService } from '../services/ImportService'
import { ItemService } from '../services/ItemService'
import {
  NotificationService,
  NotificationType
} from '../services/NotificationService'
import { WebsiteConfigurationService } from '../services/WebsiteConfigurationService'
import { ServiceInitializationState } from '../services/repository/ServiceInitializationState'
import Services from '../services/repository/Services'
import { SortingService } from '../services/sorting/SortingService'
import { BuildSummarySortingFunctions } from '../services/sorting/functions/BuildSummarySortingFunctions'
import BuildsList from './BuildsListComponent.vue'
import NotificationButton from './NotificationButtonComponent.vue'
import Toolbar from './ToolbarComponent.vue'


const _buildService = Services.get(BuildService)
const _buildPropertiesService = Services.get(BuildPropertiesService)
const _exportService = Services.get(ExportService)
const _globalFilterService = Services.get(GlobalFilterService)
const _globalSidebarService = Services.get(GlobalSidebarService)
const _importService = Services.get(ImportService)
const _itemService = Services.get(ItemService)
const _router = useRouter()
const _sortingService = Services.get(SortingService)

let _builds: IBuild[] = []
const toolbarButtons: IToolbarButton[] = [
  {
    action: goToHome,
    canBeMovedToSidebar: () => false,
    caption: () => vueI18n.t('caption.backToHome'),
    followedBySeparation: true,
    icon: () => 'arrow-left',
    name: 'backToHome',
    showCaption: () => 'never',
    style: () => 'discreet',
    tooltipPosition: () => 'right'
  },
  {
    action: openNewBuild,
    canBeMovedToSidebar: () => false,
    caption: () => vueI18n.t('caption.new'),
    icon: () => 'plus',
    isDisabled: () => isLoading.value,
    name: 'newBuild',
    showCaption: () => 'always',
    tooltipPosition: () => 'right',
    variant: () => 'success'
  },
  {
    action: displayShareSidebar,
    caption: () => vueI18n.t('caption.shareBuilds'),
    icon: () => 'share-alt',
    isDisabled: () => isLoading.value || !canImportExport.value || buildSummaries.value.length === 0,
    name: 'share',
    showCaption: () => 'never',
    style: () => 'discreet'
  },
  {
    action: displayExportSidebar,
    caption: () => vueI18n.t('caption.exportBuilds'),
    icon: () => 'download',
    isDisabled: () => isLoading.value || !canImportExport.value,
    name: 'export',
    showCaption: () => 'never',
    style: () => 'discreet'
  },
  {
    action: displayImportSidebar,
    caption: () => vueI18n.t('caption.importBuilds'),
    icon: () => 'file-upload',
    isDisabled: () => isLoading.value || !canImportExport.value,
    name: 'import',
    showCaption: () => 'never',
    style: () => 'discreet'
  },
  {
    action: displayMerchantItemsOptions,
    caption: () => vueI18n.t('caption.merchants'),
    icon: () => 'user-tag',
    isDisabled: () => isLoading.value,
    name: 'merchantItemsOptions',
    position: () => 'right',
    style: () => 'outlined'
  },
  {
    action: displayGeneralOptions,
    caption: () => vueI18n.t('caption.options'),
    icon: () => 'cog',
    name: 'generalOptions',
    position: () => 'right',
    showCaption: () => 'never',
    style: () => 'discreet'
  }
]

const buildsToolbar = useTemplateRef('buildsToolbar')
const buildSummaries = ref<IBuildSummary[]>([])
const filterAndSortingData = ref<BuildFilterAndSortingData>(new BuildFilterAndSortingData())
const hasImported = ref(false)
const isLoading = ref(true)

const canImportExport = computed(() => !isLoading.value && buildSummaries.value.length > 0)
const hasBuildsNotExported = computed(() => _builds.some(b => b.lastExported == null || b.lastExported < (b.lastUpdated ?? new Date())))
const toolbarContainer = computed(() => buildsToolbar.value?.container)

onMounted(() => {
  _buildService.emitter.on(BuildService.deletedEvent, onItemServicesInitialized)
  _exportService.emitter.on(ExportService.buildsExportedEvent, getBuilds)
  _globalFilterService.emitter.on(GlobalFilterService.changeEvent, onMerchantFilterChanged)
  _importService.emitter.on(ImportService.buildsImportedEvent, getBuilds)

  if (_itemService.initializationState === ServiceInitializationState.initializing) {
    _itemService.emitter.once(ItemService.initializationFinishedEvent, onItemServicesInitialized)
  } else {
    onItemServicesInitialized()
  }

  getFilterAndSortingData()
})

onUnmounted(() => {
  _buildService.emitter.off(BuildService.deletedEvent, onItemServicesInitialized)
  _exportService.emitter.off(ExportService.buildsExportedEvent, getBuilds)
  _globalFilterService.emitter.off(GlobalFilterService.changeEvent, onMerchantFilterChanged)
  _importService.emitter.off(ImportService.buildsImportedEvent, getBuilds)
})

watch(() => hasImported.value, () => {
  // Updating the list of builds after import
  if (hasImported.value) {
    getBuilds()
    hasImported.value = false
  }
})

/**
 * Checks whether builds have not been exported. Displays a warning if that is the case.
 */
function checkBuildsNotExported() {
  const exportWarningShowedKey = Services.get(WebsiteConfigurationService).configuration.exportWarningShowedStorageKey
  const exportWarningShowed = sessionStorage.getItem(exportWarningShowedKey)

  if (hasBuildsNotExported.value && exportWarningShowed == null) {
    Services.get(NotificationService).notify(
      NotificationType.warning,
      vueI18n.t('message.buildsNotExported'),
      0,
      [
        {
          action: () => Services.get(GlobalSidebarService).display({
            displayedComponentType: 'BuildsExportSidebar',
            displayedComponentParameters: buildSummaries.value
          }),
          caption: vueI18n.t('caption.exportBuilds'),
          icon: 'download',
          name: 'exportBuilds',
          type: NotificationType.success
        }
      ],
      true
    )
    sessionStorage.setItem(exportWarningShowedKey, '')
  }
}

/**
 * Displays the build export sidebar.
 */
function displayExportSidebar() {
  if (canImportExport.value) {
    _globalSidebarService.display({
      displayedComponentParameters: buildSummaries.value,
      displayedComponentType: 'BuildsExportSidebar'
    })
  }
}

/**
 * Displays the build import sidebar.
 */
function displayImportSidebar() {
  if (canImportExport.value) {
    _globalSidebarService.display({
      displayedComponentParameters: buildSummaries.value,
      displayedComponentType: 'BuildsImportSidebar'
    })
  }
}

/**
 * Displays the general options sidebar.
 */
function displayGeneralOptions() {
  Services.get(GlobalSidebarService).display({
    displayedComponentType: 'GeneralOptionsSidebar'
  })
}

/**
 * Displays the merchant items options sidebar.
 */
function displayMerchantItemsOptions() {
  Services.get(GlobalSidebarService).display({
    displayedComponentType: 'MerchantItemsOptionsSidebar'
  })
}

/**
 * Displays the builds share sidebar options.
 */
function displayShareSidebar() {
  Services.get(GlobalSidebarService).display({
    displayedComponentParameters: {
      buildSummaries: buildSummaries.value
    },
    displayedComponentType: 'BuildsShareSideBar'
  })
}

/**
 * Gets the builds.
 */
async function getBuilds() {
  isLoading.value = true

  const execute = new Promise<void>(resolve => {
    setTimeout(async () => { // Did not find another solution to make the loading animation appear when opening the builds list from the welcome page (nextTick does not work)
      const summaries: IBuildSummary[] = []
      _builds = _buildService.getAll()

      for (const build of _builds) {
        const summary = await _buildPropertiesService.getSummary(build)
        summaries.push(summary)
      }

      buildSummaries.value = summaries
      isLoading.value = false

      resolve()
    }, 1)
  })
  await execute
}

/**
 * Gets the sorting data.
 */
function getFilterAndSortingData() {
  const websiteConfigurationService = Services.get(WebsiteConfigurationService)

  filterAndSortingData.value.filter = sessionStorage.getItem(websiteConfigurationService.configuration.buildsFilterStorageKey) ?? ''
  const property = localStorage.getItem(websiteConfigurationService.configuration.buildsSortFieldStorageKey) ?? 'name'
  const order = Number(localStorage.getItem(websiteConfigurationService.configuration.buildsSortOrderStorageKey) ?? SortingOrder.asc)
  _sortingService.setSortingProperty(filterAndSortingData.value, BuildSummarySortingFunctions, property, order)
}

/**
 * Redirects to the welcome page.
 */
function goToHome() {
  _router.push({ name: 'Welcome' })
}

/**
 * Reacts to a build being selected.
 *
 * Opens a the build the user has selected.
 * @param selectedBuilds - Selected builds.
 */
function onBuildSelected(selectedBuilds: IBuildSummary[]) {
  if (selectedBuilds.length > 0) {
    openBuild(selectedBuilds[0].id)
  }
}

/**
 * Reacts to the filter and sorting data being changed.
 *
 * Saves filter and sorting data.
 */
function onFilterAndSortingDataChanged() {
  const websiteConfigurationService = Services.get(WebsiteConfigurationService)
  sessionStorage.setItem(websiteConfigurationService.configuration.buildsFilterStorageKey, filterAndSortingData.value.filter)
  localStorage.setItem(websiteConfigurationService.configuration.buildsSortFieldStorageKey, filterAndSortingData.value.property)
  localStorage.setItem(websiteConfigurationService.configuration.buildsSortOrderStorageKey, filterAndSortingData.value.order.toString())
}

/**
 * Reacts to the item service being initialized.
 *
 * Updates the selected item price to reflect the change in merchant filters.
 */
function onItemServicesInitialized() {
  getBuilds().then(() => {
    if (_builds.length === 0) {
      _router.push({ name: 'Welcome' })

      return
    }

    checkBuildsNotExported()
  })
}

/**
 * Reacts to the merchant filter being changed.
 *
 * Gets builds and ends loading.
 */
function onMerchantFilterChanged() {
  getBuilds()
}

/**
 * Opens a build.
 * @param id - ID of the build.
 */
function openBuild(id: string) {
  _router.push({ name: 'Build', params: { id } })
}

/**
 * Opens a new build.
 */
function openNewBuild() {
  _router.push({ name: 'NewBuild' })
}
</script>










<style scoped>
@import '../css/button.css';
@import '../css/icon.css';

.builds {
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
}

.builds-title {
  align-items: center;
  display: flex;
  font-size: 1.5rem;
  justify-content: center;
  min-height: 2.75rem;
  text-align: center;
}

.builds-title-in-toolbar {
  height: 100%;
}

.builds-title-outside-toolbar {
  margin-bottom: 1rem;
}

/* Smartphone in portrait */
@media only screen and (max-width: 480px) {
  .builds-title-in-toolbar {
    display: none;
  }
}

/* Smartphone in landscape */
@media only screen and (min-width: 481px) and (max-width: 767px) {
  .builds-title-in-toolbar {
    display: none;
  }
}

/* Tablet in portrait */
@media only screen and (min-width: 768px) and (max-width: 991px) {
  .builds-title-outside-toolbar {
    display: none;
  }
}

/* Tablet in landscape */
@media only screen and (min-width: 992px) and (max-width: 1299px) {
  .builds-title-outside-toolbar {
    display: none;
  }
}

/* PC */
@media only screen and (min-width: 1300px) {
  .builds-title-outside-toolbar {
    display: none;
  }
}
</style>