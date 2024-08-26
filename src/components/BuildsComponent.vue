<template>
  <div class="builds">
    <div class="builds-title">
      {{ $t('caption.buildsList') }}
    </div>
    <Toolbar :buttons="toolbarButtons">
      <template #right>
        <NotificationButton />
      </template>
    </Toolbar>
    <BuildsList
      v-model:filter-and-sorting-data="filterAndSortingData"
      :build-summaries="buildSummaries"
      :is-loading="isLoading"
      :is-under-toolbar="true"
      :show-not-exported="true"
      @update:filter-and-sorting-data="onFilterAndSortingDataChanged"
      @update:selected-builds="onBuildClick"
    />
  </div>
</template>










<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
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

const router = useRouter()

const _buildService = Services.get(BuildService)
const _buildPropertiesService = Services.get(BuildPropertiesService)
const _exportService = Services.get(ExportService)
const _globalFilterService = Services.get(GlobalFilterService)
const _globalSidebarService = Services.get(GlobalSidebarService)
const _importService = Services.get(ImportService)
const _itemService = Services.get(ItemService)
const _sortingService = Services.get(SortingService)

let _builds: IBuild[] = []
let toolbarButtons: IToolbarButton[] = [
  {
    action: () => openNewBuild(),
    canBeMovedToSidebar: () => false,
    caption: () => 'caption.new',
    isDisabled: () => isLoading.value,
    icon: () => 'plus',
    name: 'newBuild',
    position: () => 'left',
    showCaption: () => true,
    variant: () => 'success',
    visible: () => true
  },
  {
    action: () => displayExportSidebar(),
    canBeMovedToSidebar: () => true,
    caption: () => 'caption.exportBuilds',
    isDisabled: () => isLoading.value || !canImportExport.value,
    icon: () => 'download',
    name: 'export',
    position: () => 'left',
    showCaption: () => false,
    style: () => 'discreet',
    visible: () => true
  },
  {
    action: () => displayImportSidebar(),
    canBeMovedToSidebar: () => true,
    caption: () => 'caption.importBuilds',
    isDisabled: () => isLoading.value || !canImportExport.value,
    icon: () => 'file-upload',
    name: 'import',
    position: () => 'left',
    showCaption: () => false,
    style: () => 'discreet',
    visible: () => true
  },
  {
    action: () => displayMerchantItemsOptions(),
    canBeMovedToSidebar: () => true,
    caption: () => 'caption.merchantItemsOptions',
    isDisabled: () => isLoading.value,
    icon: () => 'user-tag',
    name: 'merchantIptions',
    position: () => 'right',
    showCaption: () => false,
    style: () => 'discreet',
    visible: () => true
  },
  {
    action: () => displayGeneralOptions(),
    canBeMovedToSidebar: () => true,
    caption: () => 'caption.options',
    isDisabled: () => isLoading.value,
    icon: () => 'cog',
    name: 'generalOptions',
    position: () => 'right',
    showCaption: () => false,
    style: () => 'discreet',
    visible: () => true
  }
]

const buildSummaries = ref<IBuildSummary[]>([])
const filterAndSortingData = ref<BuildFilterAndSortingData>(new BuildFilterAndSortingData())
const hasImported = ref(false)
const isLoading = ref(true)

const canImportExport = computed(() => !isLoading.value && buildSummaries.value.length > 0)
const hasBuildsNotExported = computed(() => _builds.some(b => b.lastExported == null || b.lastExported < (b.lastUpdated ?? new Date())))

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
    Services.get(NotificationService).notify(NotificationType.warning, vueI18n.t('message.buildsNotExported'))
    sessionStorage.setItem(exportWarningShowedKey, '')
  }
}

/**
 * Displays the build export sidebar.
 */
function displayExportSidebar() {
  if (canImportExport.value) {
    _globalSidebarService.display({
      displayedComponentType: 'BuildsExportSidebar',
      displayedComponentParameters: buildSummaries.value
    })
  }
}

/**
 * Displays the build import sidebar.
 */
function displayImportSidebar() {
  if (canImportExport.value) {
    _globalSidebarService.display({
      displayedComponentType: 'BuildsImportSidebar',
      displayedComponentParameters: buildSummaries.value
    })
  }
}

/**
 * Displays the general options.
 */
function displayGeneralOptions() {
  Services.get(GlobalSidebarService).display({
    displayedComponentType: 'GeneralOptionsSidebar'
  })
}

/**
 * Displays the merchant items options.
 */
function displayMerchantItemsOptions() {
  Services.get(GlobalSidebarService).display({
    displayedComponentType: 'MerchantItemsOptionsSidebar'
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
 * Reacts to the click on a build.
 *
 * Opens a the build on which the user clicks.
 * @param selectedBuilds - Selected builds.
 */
function onBuildClick(selectedBuilds: IBuildSummary[]) {
  if (selectedBuilds.length === 1) {
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
      router.push({ name: 'Welcome' })

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
  router.push({ name: 'Build', params: { id } })
}

/**
 * Opens a new build.
 */
function openNewBuild() {
  router.push({ name: 'NewBuild' })
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
  flex-direction: row;
  font-size: 1.5rem;
  height: 3.5rem;
  justify-content: center;
  margin-bottom: 0.5rem;
}
</style>