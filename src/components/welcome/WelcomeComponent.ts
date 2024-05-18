import { defineComponent, onMounted, ref, watch } from 'vue'
import router from '../../plugins/vueRouter'
import { BuildService } from '../../services/BuildService'
import { WebsiteConfigurationService } from '../../services/WebsiteConfigurationService'
import { GlobalSidebarComponentService } from '../../services/components/GlobalSidebarComponentService'
import { ServiceInitializationState } from '../../services/repository/ServiceInitializationState'
import Services from '../../services/repository/Services'
import BuildsImport from '../builds-import/BuildsImportComponent.vue'
import LoadingError from '../loading-error/LoadingErrorComponent.vue'
import Loading from '../loading/LoadingComponent.vue'

export default defineComponent({
  components: {
    BuildsImport,
    Loading,
    LoadingError
  },
  setup: () => {
    const websiteConfigurationService = Services.get(WebsiteConfigurationService)
    websiteConfigurationService.emitter.once(WebsiteConfigurationService.initializationFinishedEvent, onWebsiteConfigurationServiceInitialized)

    const generalOptionsSidebarVisible = ref(false)
    const hasBuilds = ref(false)
    const hasImported = ref(false)
    const isImporting = ref(false)
    const isLoading = ref(true)
    const merchantItemsOptionsSidebarVisible = ref(false)

    onMounted(() => {
      if (websiteConfigurationService.initializationState === ServiceInitializationState.initialized) {
        onWebsiteConfigurationServiceInitialized()
      }
    })

    watch(() => hasImported.value, () => {
      if (hasImported.value) {
        router.push({ name: 'Builds' })
      }
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
      Services.get(GlobalSidebarComponentService).display({
        displayedComponentType: 'GeneralOptions',
        position: 'right'
      })
    }

    /**
     * Displays the merchant items options.
     */
    function displayMerchantItemsOptions() {
      Services.get(GlobalSidebarComponentService).display({
        displayedComponentType: 'MerchantItemsOptions',
        position: 'right'
      })
    }

    /**
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

    /**
     * Shows the build import popup.
     */
    function showBuildsImportPopup() {
      isImporting.value = true
    }

    return {
      displayBuilds,
      displayGeneralOptions,
      displayMerchantItemsOptions,
      generalOptionsSidebarVisible,
      hasBuilds,
      hasImported,
      isImporting,
      isLoading,
      merchantItemsOptionsSidebarVisible,
      openNewBuild,
      showBuildsImportPopup
    }
  }
})