import { computed, defineComponent, onMounted, onUnmounted, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { IBuild } from '../../models/build/IBuild'
import { IBuildSummary } from '../../models/utils/IBuildSummary'
import vueI18n from '../../plugins/vueI18n'
import { BuildPropertiesService } from '../../services/BuildPropertiesService'
import { BuildService } from '../../services/BuildService'
import { GlobalFilterService } from '../../services/GlobalFilterService'
import { GlobalSidebarService } from '../../services/GlobalSidebarService'
import { ItemService } from '../../services/ItemService'
import {
  NotificationService,
  NotificationType
} from '../../services/NotificationService'
import { WebsiteConfigurationService } from '../../services/WebsiteConfigurationService'
import { ServiceInitializationState } from '../../services/repository/ServiceInitializationState'
import Services from '../../services/repository/Services'
import StatsUtils from '../../utils/StatsUtils'
import BuildsExport from '../builds-export/BuildsExportComponent.vue'
import BuildsImport from '../builds-import/BuildsImportComponent.vue'
import BuildsList from '../builds-list/BuildsListComponent.vue'
import LoadingError from '../loading-error/LoadingErrorComponent.vue'
import Loading from '../loading/LoadingComponent.vue'
import NotificationButton from '../notification-button/NotificationButtonComponent.vue'

export default defineComponent({
  components: {
    BuildsExport,
    BuildsImport,
    BuildsList,
    Loading,
    LoadingError,
    NotificationButton
  },
  setup: () => {
    const globalFilterService = Services.get(GlobalFilterService)

    const itemService = Services.get(ItemService)
    itemService.emitter.once(ItemService.initializationFinishedEvent, onServicesInitialized)

    const router = useRouter()
    let builds: IBuild[] = []

    const canExport = computed(() => !isLoading.value && buildSummaries.value.length > 0 && !isExporting.value && !isImporting.value)
    const canImport = computed(() => !isLoading.value && !isExporting.value && !isImporting.value)
    const hasBuildsNotExported = computed(() => builds.some(b => b.lastExported == null || b.lastExported < (b.lastUpdated ?? new Date())))

    const buildSummaries = ref<IBuildSummary[]>([])
    const hasImported = ref(false)
    const isExporting = ref(false)
    const isImporting = ref(false)
    const isLoading = ref(true)
    const merchantItemsOptionsSidebarVisible = ref(false)
    const toolbarCssClass = ref('toolbar')

    onMounted(() => {
      globalFilterService.emitter.on(GlobalFilterService.changeEvent, onMerchantFilterChanged)
      window.addEventListener('scroll', setToolbarCssClass)

      window.scrollTo(0, 0) // Scrolling to the top in case we were at the bottom of the page in the previous screen

      if (itemService.initializationState !== ServiceInitializationState.initializing) {
        onServicesInitialized()
      }
    })

    onUnmounted(() => {
      globalFilterService.emitter.off(GlobalFilterService.changeEvent, onMerchantFilterChanged)
      window.removeEventListener('scroll', setToolbarCssClass)
    })

    watch(() => hasImported.value, () => {
      // Updating the list of builds after import
      if (hasImported.value) {
        getBuilds()
        hasImported.value = false
      }
    })

    /**
     * Checks hether builds have not been exported. Displays a warning if that is the case.
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
     * Displays the general options.
     */
    function displayGeneralOptions() {
      Services.get(GlobalSidebarService).display({
        displayedComponentType: 'GeneralOptionsSidebar',
        position: 'right'
      })
    }

    /**
     * Displays the merchant items options.
     */
    function displayMerchantItemsOptions() {
      Services.get(GlobalSidebarService).display({
        displayedComponentType: 'MerchantItemsOptionsSidebar',
        position: 'right'
      })
    }

    /**
     * Gets the builds.
     */
    async function getBuilds() {
      isLoading.value = true

      const execute = new Promise<void>((resolve) => {
        setTimeout(async () => { // Did not find another solution to make the loading animation appear when opening the builds list from the welcome page (nextTick does not work)
          buildSummaries.value = []
          builds = Services.get(BuildService).getAll()
          const buildPropertiesService = Services.get(BuildPropertiesService)

          for (const build of builds) {
            const summary = await buildPropertiesService.getSummary(build)
            buildSummaries.value.push(summary)
          }

          isLoading.value = false
          resolve()
        }, 1)
      })
      await execute
    }

    /**
     * Opens a the build on which the user clicks.
     * @param selectedBuildSummary - Summary of the build the user has clicked on.
     */
    function onBuildClick(selectedBuildSummary: IBuildSummary[]) {
      if (selectedBuildSummary.length === 1) {
        openBuild(selectedBuildSummary[0].id)
      }
    }

    /**
     * Updates the selected item price to reflect the change in merchant filters.
     */
    function onMerchantFilterChanged() {
      getBuilds()
    }

    /**
     * Gets builds and ends loading.
     */
    function onServicesInitialized() {
      getBuilds().then(() => {
        if (builds.length === 0) {
          router.push({ name: 'Welcome' })

          return
        }

        checkBuildsNotExported()
      })
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

    /**
     * Sets the toolbar CSS class.
     * Used to set its sticky status and work around Z index problems with PrimeVue components that appear behind the toolbar.
     */
    function setToolbarCssClass() {
      const buildContentElement = document.querySelector('#builds-content')
      const rectangle = buildContentElement?.getBoundingClientRect()
      const y = rectangle?.top ?? 0

      toolbarCssClass.value = window.scrollY <= y ? 'toolbar' : 'toolbar toolbar-sticky'
    }

    /**
     * Shows the build export popup.
     */
    function showBuildsExportPopup() {
      if (canExport.value) {
        isExporting.value = true
      }
    }

    /**
     * Shows the build import popup.
     */
    function showBuildsImportPopup() {
      isImporting.value = true
    }

    return {
      buildSummaries,
      canExport,
      canImport,
      displayGeneralOptions,
      displayMerchantItemsOptions,
      hasImported,
      isExporting,
      isImporting,
      isLoading,
      merchantItemsOptionsSidebarVisible,
      onBuildClick,
      openNewBuild,
      showBuildsExportPopup,
      showBuildsImportPopup,
      StatsUtils,
      toolbarCssClass
    }
  }
})
