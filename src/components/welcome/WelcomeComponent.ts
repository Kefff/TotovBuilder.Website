import { defineComponent, onMounted, ref, watch } from 'vue'
import router from '../../plugins/vueRouter'
import { BuildService } from '../../services/BuildService'
import Services from '../../services/repository/Services'
import BuildsImport from '../builds-import/BuildsImportComponent.vue'
import MerchantItemsOptions from '../merchant-items-options/MerchantItemsOptionsComponent.vue'
import DisplayOptions from '../display-options/DisplayOptionsComponent.vue'
import Loading from '../loading/LoadingComponent.vue'
import LoadingError from '../loading-error/LoadingErrorComponent.vue'
import { WebsiteConfigurationService } from '../../services/WebsiteConfigurationService'
import { ServiceInitializationState } from '../../services/repository/ServiceInitializationState'

export default defineComponent({
  components: {
    BuildsImport,
    DisplayOptions,
    Loading,
    LoadingError,
    MerchantItemsOptions
  },
  setup: () => {
    const websiteConfigurationService = Services.get(WebsiteConfigurationService)
    websiteConfigurationService.emitter.once(WebsiteConfigurationService.initializationFinishedEvent, onWebsiteConfigurationServiceInitialized)

    const displayOptionsSidebarVisible = ref(false)
    const hasBuilds = ref(false)
    const hasImported = ref(false)
    const hasWebsiteConfigurationLoadingError = ref(false)
    const isImporting = ref(false)
    const isLoading = ref(true)
    const merchantItemsOptionsSidebarVisible = ref(false)

    watch(() => hasImported.value, () => {
      if (hasImported.value) {
        router.push({ name: 'Builds' })
      }
    })

    onMounted(() => {
      if (websiteConfigurationService.initializationState === ServiceInitializationState.initialized) {
        onWebsiteConfigurationServiceInitialized()
      }
    })

    /**
     * Displays the list of builds.
     */
    function displayBuilds() {
      router.push({ name: 'Builds' })
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
      displayOptionsSidebarVisible,
      hasBuilds,
      hasImported,
      hasWebsiteConfigurationLoadingError,
      isImporting,
      isLoading,
      merchantItemsOptionsSidebarVisible,
      openNewBuild,
      showBuildsImportPopup
    }
  }
})