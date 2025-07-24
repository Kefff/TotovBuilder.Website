<script setup lang="ts">
import { computed, nextTick, onMounted, onUnmounted, ref, useTemplateRef, watch } from 'vue'
import { useRouter } from 'vue-router'
import { IBuild } from '../models/build/IBuild'
import BuildFilterAndSortingData from '../models/utils/BuildFilterAndSortingData'
import { IToolbarButton } from '../models/utils/IToolbarButton'
import { SortingOrder } from '../models/utils/SortingOrder'
import vueI18n from '../plugins/vueI18n'
import { BuildService } from '../services/BuildService'
import { ExportService } from '../services/ExportService'
import { GeneralOptionsService } from '../services/GeneralOptionsService'
import { GlobalFilterService } from '../services/GlobalFilterService'
import { GlobalSidebarService } from '../services/GlobalSidebarService'
import { ImportService } from '../services/ImportService'
import {
  NotificationService,
  NotificationType
} from '../services/NotificationService'
import { WebsiteConfigurationService } from '../services/WebsiteConfigurationService'
import Services from '../services/repository/Services'
import BuildsList from './BuildsListComponent.vue'
import NotificationButton from './NotificationButtonComponent.vue'
import Toolbar from './ToolbarComponent.vue'

const _buildService = Services.get(BuildService)
const _exportService = Services.get(ExportService)
const _globalFilterService = Services.get(GlobalFilterService)
const _globalSidebarService = Services.get(GlobalSidebarService)
const _importService = Services.get(ImportService)
const _notificationService = Services.get(NotificationService)
const _websiteConfigurationService = Services.get(WebsiteConfigurationService)

const _router = useRouter()
const _toolbarButtons: IToolbarButton[] = [
  {
    action: goToHome,
    caption: () => vueI18n.t('caption.goToHome'),
    icon: () => 'home',
    name: 'goToHome',
    showCaption: () => 'never',
    style: () => 'discreet'
  },
  {
    action: goToItemList,
    caption: () => vueI18n.t('caption.goToItemList'),
    followedBySeparation: true,
    icon: () => 'list',
    name: 'goToItemList',
    showCaption: () => 'never',
    style: () => 'discreet'
  },
  {
    action: openNewBuild,
    canBeMovedToSidebar: () => false,
    caption: () => vueI18n.t('caption.new'),
    icon: () => 'plus',
    isDisabled: () => isLoading.value,
    name: 'newBuild',
    showCaption: () => 'always',
    variant: () => 'success'
  },
  {
    action: displayShareSidebar,
    caption: () => vueI18n.t('caption.shareBuilds'),
    icon: () => 'share-alt',
    isDisabled: () => isLoading.value || !hasBuilds.value,
    name: 'share',
    showCaption: () => 'never',
    style: () => 'discreet'
  },
  {
    action: displayExportSidebar,
    caption: () => vueI18n.t('caption.exportBuilds'),
    icon: () => 'download',
    isDisabled: () => isLoading.value || !hasBuilds.value,
    name: 'export',
    showCaption: () => 'never',
    style: () => 'discreet'
  },
  {
    action: displayImportSidebar,
    caption: () => vueI18n.t('caption.importBuilds'),
    icon: () => 'file-upload',
    isDisabled: () => isLoading.value,
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

const toolbarContainer = computed(() => buildsToolbar.value?.container)

const buildsToolbar = useTemplateRef('buildsToolbar')
const currentPage = ref(0)
const filterAndSortingData = ref<BuildFilterAndSortingData>()
const isLoading = ref(true)
const hasBuilds = ref(false)

onMounted(() => {
  _exportService.emitter.on(ExportService.buildsExportedEvent, getBuilds)
  _globalFilterService.emitter.on(GlobalFilterService.changeEvent, onMerchantFilterChanged)
  _importService.emitter.on(ImportService.buildsImportedEvent, getBuilds)

  initialize()
})

onUnmounted(() => {
  _exportService.emitter.off(ExportService.buildsExportedEvent, getBuilds)
  _globalFilterService.emitter.off(GlobalFilterService.changeEvent, onMerchantFilterChanged)
  _importService.emitter.off(ImportService.buildsImportedEvent, getBuilds)
})

watch(
  currentPage,
  () => {
    sessionStorage.setItem(_websiteConfigurationService.configuration.buildsPageStorageKey, currentPage.value.toString())
  })

/**
 * Checks whether builds have not been exported. Displays a warning if that is the case.
 */
function checkBuildsNotExported(buildSummaries: IBuild[]): void {
  const exportWarning = Services.get(GeneralOptionsService).getExportWarningOption()

  if (!exportWarning) {
    return
  }

  const exportWarningShowed = sessionStorage.getItem(_websiteConfigurationService.configuration.exportWarningShowedStorageKey)

  if (exportWarningShowed != null) {
    return
  }

  const hasBuildsNotExported = buildSummaries.some(b => b.lastExported == null || b.lastExported < (b.lastUpdated ?? new Date()))

  if (!hasBuildsNotExported) {
    return
  }

  _notificationService.notify(
    NotificationType.warning,
    vueI18n.t('message.buildsNotExported'),
    0,
    [
      {
        action: displayExportSidebar,
        caption: vueI18n.t('caption.exportBuilds'),
        icon: 'download',
        name: 'exportBuilds',
        type: NotificationType.success
      }
    ],
    true,
    _websiteConfigurationService.configuration.exportWarningStorageKey
  )
  sessionStorage.setItem(_websiteConfigurationService.configuration.exportWarningShowedStorageKey, '')
}

/**
 * Displays the build export sidebar.
 */
function displayExportSidebar(): void {
  _globalSidebarService.display({
    displayedComponentParameters: {
      getBuildsToExportFunction: getBuilds
    },
    displayedComponentType: 'BuildsExportSidebar'
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
 * Displays the general options sidebar.
 */
function displayGeneralOptions(): void {
  _globalSidebarService.display({
    displayedComponentType: 'GeneralOptionsSidebar'
  })
}

/**
 * Displays the merchant items options sidebar.
 */
function displayMerchantItemsOptions(): void {
  _globalSidebarService.display({
    displayedComponentType: 'MerchantItemsOptionsSidebar'
  })
}

/**
 * Displays the builds share sidebar options.
 */
function displayShareSidebar(): void {
  _globalSidebarService.display({
    displayedComponentParameters: {
      getBuildsToShareFunction: getBuilds
    },
    displayedComponentType: 'BuildsShareSideBar'
  })
}

/**
 * Gets the builds.
 */
function getBuilds(): IBuild[] {
  isLoading.value = true

  const builds = _buildService.getAll()
  hasBuilds.value = builds.length > 0

  if (!hasBuilds.value) {
    goToHome()

    return []
  }

  checkBuildsNotExported(builds)

  nextTick(() => isLoading.value = false)

  return builds
}

/**
 * Initializes the component.
 */
function initialize(): void {
  const page = sessionStorage.getItem(_websiteConfigurationService.configuration.buildsPageStorageKey)
  currentPage.value = page != null
    ? Number.parseInt(page)
    : 0
  const property = localStorage.getItem(_websiteConfigurationService.configuration.buildsSortPropertyStorageKey) ?? 'name'
  const order = Number(localStorage.getItem(_websiteConfigurationService.configuration.buildsSortOrderStorageKey) ?? SortingOrder.asc)

  const fasd = new BuildFilterAndSortingData()
  fasd.filter = sessionStorage.getItem(_websiteConfigurationService.configuration.buildsFilterStorageKey) ?? undefined
  fasd.property = property
  fasd.order = order

  filterAndSortingData.value = fasd
}

/**
 * Redirects to the welcome page.
 */
function goToHome(): void {
  _router.push({ name: 'Welcome' })
}

/**
 * Redirects to the item list page.
 */
function goToItemList(): void {
  _router.push({ name: 'Items' })
}

/**
 * Reacts to a build being selected.
 *
 * Opens the build the user has selected.
 * @param selectedBuilds - Selected builds.
 */
function onBuildSelected(selectedBuilds: IBuild[] | undefined): void {
  if (selectedBuilds != null && selectedBuilds.length > 0) {
    openBuild(selectedBuilds[0].id)
  }
}

/**
 * Reacts to the filter and sorting data being changed.
 *
 * Saves filter and sorting data.
 */
function onFilterAndSortingDataChanged(): void {
  if (filterAndSortingData.value == null) {
    return
  }

  currentPage.value = 0

  if (filterAndSortingData.value.filter == null) {
    sessionStorage.removeItem(_websiteConfigurationService.configuration.buildsFilterStorageKey)
  }
  else {
    sessionStorage.setItem(_websiteConfigurationService.configuration.buildsFilterStorageKey, filterAndSortingData.value.filter)
  }

  localStorage.setItem(_websiteConfigurationService.configuration.buildsSortPropertyStorageKey, filterAndSortingData.value.property)
  localStorage.setItem(_websiteConfigurationService.configuration.buildsSortOrderStorageKey, filterAndSortingData.value.order.toString())
}

/**
 * Reacts to the merchant filter being changed.
 *
 * Gets builds.
 */
function onMerchantFilterChanged(): void {
  getBuilds()
}

/**
 * Opens a build.
 * @param id - ID of the build.
 */
function openBuild(id: string): void {
  _router.push({ name: 'Build', params: { id } })
}

/**
 * Opens a new build.
 */
function openNewBuild(): void {
  _router.push({ name: 'NewBuild' })
}
</script>










<template>
  <div class="builds">
    <div class="builds-title builds-title-outside-toolbar">
      {{ $t('caption.buildList') }}
    </div>
    <Toolbar
      ref="buildsToolbar"
      :buttons="_toolbarButtons"
    >
      <template #center>
        <div class="builds-title builds-title-in-toolbar">
          {{ $t('caption.buildList') }}
        </div>
      </template>
      <template #right>
        <NotificationButton />
      </template>
    </Toolbar>
    <BuildsList
      v-model:current-page="currentPage"
      v-model:filter-and-sorting-data="filterAndSortingData"
      :element-to-stick-to="toolbarContainer"
      :get-builds-function="getBuilds"
      :selection-options="{
        canUnselect: true,
        isEnabled: true,
        isMultiSelection: false,
        selectionButtonCaption: 'caption.edit',
        selectionButtonIcon: 'edit'
      }"
      @update:filter-and-sorting-data="onFilterAndSortingDataChanged"
      @update:selected-builds="onBuildSelected"
    />
  </div>
</template>










<style scoped>
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