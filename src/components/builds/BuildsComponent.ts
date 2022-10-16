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
import MerchantFilter from '../merchant-filter/MerchantFilterComponent.vue'
import { MerchantFilterService } from '../../services/MerchantFilterService'
import vueI18n from '../../plugins/vueI18n'
import LanguageSelector from '../language-selector/LanguageSelectorComponent.vue'
import Loading from '../loading/LoadingComponent.vue'
import { WebsiteConfigurationService } from '../../services/WebsiteConfigurationService'

export default defineComponent({
  components: {
    BuildsExport,
    BuildsImport,
    BuildsList,
    LanguageSelector,
    Loading,
    MerchantFilter,
    NotificationButton
  },
  setup: () => {
    const merchantFilterService = Services.get(MerchantFilterService)
    merchantFilterService.emitter.on(MerchantFilterService.changeEvent, onMerchantFilterChanged)

    const router = useRouter()
    const buildsSummaries = ref<IBuildSummary[]>([])
    let builds: IBuild[] = []

    const advancedPanel = ref()

    const canExport = computed(() => builds.length !== 0)
    const hasBuildsNotExported = computed(() => builds.some(b => b.lastExported === undefined || b.lastExported < b.lastUpdated))

    const selectedBuildSummary = computed({
      get: () => [],
      set: (value: string[]) => {
        if (value.length === 1) {
          openBuild(value[0])
        }
      }
    })

    const isExporting = ref(false)
    const isImporting = ref(false)
    const hasImported = ref(false)
    const isLoading = ref(true)

    watch(() => hasImported.value, () => {
      // Updating the list of builds after import
      if (hasImported.value) {
        getBuilds()
        hasImported.value = false
      }
    })

    onMounted(() => {
      getBuilds()

      if (builds.length === 0) {
        router.push({ name: 'Welcome' })

        return
      }

      checkBuildsNotExported()
    })

    onUnmounted(() => {
      merchantFilterService.emitter.off(MerchantFilterService.changeEvent, onMerchantFilterChanged)
    })

    /**
     * Checks hether builds have not been exported. Displays a warning if that is the case.
     */
    function checkBuildsNotExported() {
      const exportWarningShowedKey = Services.get(WebsiteConfigurationService).configuration.exportWarningShowedStoregeKey
      const exportWarningShowed = sessionStorage.getItem(exportWarningShowedKey)

      if (hasBuildsNotExported.value && exportWarningShowed == undefined) {
        Services.get(NotificationService).notify(NotificationType.warning, vueI18n.t('message.buildsNotExported'), true, 0)
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
        const summaryResult = await buildPropertiesService.getSummary(build)

        if (!summaryResult.success) {
          isLoading.value = false
          Services.get(NotificationService).notify(
            NotificationType.error,
            summaryResult.failureMessage
          )

          return
        }

        buildsSummaries.value.push(summaryResult.value)
      }

      isLoading.value = false
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
     * Shows the build export popup.
     */
    function showBuildsExportPopup() {
      if (canExport.value) {
        toggleAdvancedPanel(undefined)
        isExporting.value = true
      }
    }

    /**
     * Shows the build import popup.
     */
    function showBuildsImportPopup() {
      toggleAdvancedPanel(undefined)
      isImporting.value = true
    }

    /**
     * Toggles the advanced menu.
     * @param event - Event.
     */
    function toggleAdvancedPanel(event: unknown) {
      advancedPanel.value.toggle(event)
    }

    return {
      advancedPanel,
      buildsSummaries,
      canExport,
      hasImported,
      isExporting,
      isImporting,
      isLoading,
      openBuild,
      openNewBuild,
      selectedBuildSummary,
      showBuildsExportPopup,
      showBuildsImportPopup,
      StatsUtils,
      toggleAdvancedPanel
    }
  }
})
