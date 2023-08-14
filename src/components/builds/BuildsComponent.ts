import { computed, defineComponent, onMounted, onUnmounted, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { BuildPropertiesService } from '../../services/BuildPropertiesService'
import { BuildService } from '../../services/BuildService'
import {
  NotificationService,
  NotificationType
} from '../../services/NotificationService'
import Services from '../../services/repository/Services'
import StatsUtils from '../../utils/StatsUtils'
import { IBuild } from '../../models/build/IBuild'
import { IBuildSummary } from '../../models/utils/IBuildSummary'
import BuildsList from '../builds-list/BuildsListComponent.vue'
import BuildsExport from '../builds-export/BuildsExportComponent.vue'
import BuildsImport from '../builds-import/BuildsImportComponent.vue'
import NotificationButton from '../notification-button/NotificationButtonComponent.vue'
import { GlobalFilterService } from '../../services/GlobalFilterService'
import vueI18n from '../../plugins/vueI18n'
import Loading from '../loading/LoadingComponent.vue'
import { WebsiteConfigurationService } from '../../services/WebsiteConfigurationService'
import MerchantItemsOptions from '../merchant-items-options/MerchantItemsOptionsComponent.vue'
import GeneralOptions from '../general-options/GeneralOptionsComponent.vue'
import LoadingError from '../loading-error/LoadingErrorComponent.vue'
import { ServiceInitializationState } from '../../services/repository/ServiceInitializationState'
import { ItemService } from '../../services/ItemService'

export default defineComponent({
  components: {
    BuildsExport,
    BuildsImport,
    BuildsList,
    GeneralOptions,
    Loading,
    LoadingError,
    MerchantItemsOptions,
    NotificationButton
  },
  setup: () => {
    const itemService = Services.get(ItemService)
    itemService.emitter.once(ItemService.initializationFinishedEvent, onServicesInitialized)

    const globalFilterService = Services.get(GlobalFilterService)

    const router = useRouter()
    const buildsSummaries = ref<IBuildSummary[]>([])
    let builds: IBuild[] = []

    const canExport = computed(() => !isLoading.value && buildsSummaries.value.length > 0 && !isExporting.value && !isImporting.value)
    const canImport = computed(() => !isLoading.value && !isExporting.value && !isImporting.value)
    const hasBuildsNotExported = computed(() => builds.some(b => b.lastExported == null || b.lastExported < (b.lastUpdated ?? new Date())))
    const hasLoadingError = computed(() => hasItemsLoadingError.value || hasWebsiteConfigurationLoadingError.value)
    const selectedBuildSummary = computed({
      get: () => [],
      set: (value: string[]) => {
        if (value.length === 1) {
          openBuild(value[0])
        }
      }
    })

    const hasImported = ref(false)
    const hasItemsLoadingError = ref(false)
    const hasWebsiteConfigurationLoadingError = ref(false)
    const isExporting = ref(false)
    const isImporting = ref(false)
    const isLoading = ref(true)
    const merchantItemsOptionsSidebarVisible = ref(false)
    const toolbarCssClass = ref('toolbar')

    watch(() => hasImported.value, () => {
      // Updating the list of builds after import
      if (hasImported.value) {
        getBuilds()
        hasImported.value = false
      }
    })

    onMounted(() => {
      window.addEventListener('scroll', setToolbarCssClass)
      window.scrollTo(0, 0) // Scrolling to the top in case we were at the bottom of the page in the previous screen

      globalFilterService.emitter.on(GlobalFilterService.changeEvent, onMerchantFilterChanged)

      if (itemService.initializationState !== ServiceInitializationState.initializing) {
        onServicesInitialized()
      }
    })

    onUnmounted(() => {
      globalFilterService.emitter.off(GlobalFilterService.changeEvent, onMerchantFilterChanged)

      window.removeEventListener('scroll', setToolbarCssClass)
    })

    /**
     * Checks hether builds have not been exported. Displays a warning if that is the case.
     */
    function checkBuildsNotExported() {
      const exportWarningShowedKey = Services.get(WebsiteConfigurationService).configuration.exportWarningShowedStoregeKey
      const exportWarningShowed = sessionStorage.getItem(exportWarningShowedKey)

      if (hasBuildsNotExported.value && exportWarningShowed == null) {
        Services.get(NotificationService).notify(NotificationType.warning, vueI18n.t('message.buildsNotExported'), true)
        sessionStorage.setItem(exportWarningShowedKey, '')
      }
    }

    /**
     * Gets the builds.
     */
    async function getBuilds() {
      isLoading.value = true

      buildsSummaries.value = []
      builds = Services.get(BuildService).getAll()
      const buildPropertiesService = Services.get(BuildPropertiesService)

      for (const build of builds) {
        const summary = await buildPropertiesService.getSummary(build)
        buildsSummaries.value.push(summary)
      }

      isLoading.value = false
    }

    /**
     * Gets builds and ends loading.
     */
    function onServicesInitialized() {
      if (hasLoadingError.value) {
        isLoading.value = false

        return
      }

      getBuilds()

      if (builds.length === 0) {
        router.push({ name: 'Welcome' })

        return
      }

      checkBuildsNotExported()
    }

    /**
     * Updates the selected item price to reflect the change in merchant filters.
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
      buildsSummaries,
      canExport,
      canImport,
      hasImported,
      hasItemsLoadingError,
      hasLoadingError,
      hasWebsiteConfigurationLoadingError,
      isExporting,
      isImporting,
      isLoading,
      merchantItemsOptionsSidebarVisible,
      openNewBuild,
      selectedBuildSummary,
      showBuildsExportPopup,
      showBuildsImportPopup,
      StatsUtils,
      toolbarCssClass
    }
  }
})
