import { defineComponent, onMounted, ref, watch } from 'vue'
import router from '../../plugins/vueRouter'
import { BuildService } from '../../services/BuildService'
import { GlobalSidebarService } from '../../services/GlobalSidebarService'
import { WebsiteConfigurationService } from '../../services/WebsiteConfigurationService'
import { ServiceInitializationState } from '../../services/repository/ServiceInitializationState'
import Services from '../../services/repository/Services'
import Loading from '../LoadingComponent.vue'
import BuildsImport from '../builds-import/BuildsImportComponent.vue'

export default defineComponent({
  components: {
    BuildsImport,
    Loading
  },
  setup: () => {
    const websiteConfigurationService = Services.get(WebsiteConfigurationService)

    const generalOptionsSidebarVisible = ref(false)
    const hasBuilds = ref(false)
    const hasImported = ref(false)
    const isImporting = ref(false)
    const isLoading = ref(true)
    const merchantItemsOptionsSidebarVisible = ref(false)

    onMounted(() => {
      if (websiteConfigurationService.initializationState === ServiceInitializationState.initializing) {
        websiteConfigurationService.emitter.once(WebsiteConfigurationService.initializationFinishedEvent, onWebsiteConfigurationServiceInitialized)
      } else {
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