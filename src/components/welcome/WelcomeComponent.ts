import { defineComponent, onMounted, ref, watch } from 'vue'
import router from '../../plugins/vueRouter'
import { BuildService } from '../../services/BuildService'
import Services, { InitializationState } from '../../services/repository/Services'
import BuildsImport from '../builds-import/BuildsImportComponent.vue'
import MerchantItemsOptions from '../merchant-items-options/MerchantItemsOptionsComponent.vue'
import DisplayOptions from '../display-options/DisplayOptionsComponent.vue'
import Loading from '../loading/LoadingComponent.vue'
import LoadingError from '../loading-error/LoadingErrorComponent.vue'

export default defineComponent({
  components: {
    BuildsImport,
    DisplayOptions,
    Loading,
    LoadingError,
    MerchantItemsOptions
  },
  setup: () => {
    Services.emitter.once('initialized', onConfigurationLoaded)

    const displayOptionsSidebarVisible = ref(false)
    const hasBuilds = ref(false)
    const hasImported = ref(false)
    const hasLoadingError = ref(false)
    const isImporting = ref(false)
    const isLoading = ref(true)
    const merchantItemsOptionsSidebarVisible = ref(false)

    watch(() => hasImported.value, () => {
      if (hasImported.value) {
        router.push({ name: 'Builds' })
      }
    })

    onMounted(() => {
      if (Services.initializationState === InitializationState.initialized) {
        onConfigurationLoaded()
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
    function onConfigurationLoaded() {
      hasLoadingError.value = Services.initializationState === InitializationState.error

      if (hasLoadingError.value) {
        hasBuilds.value = false
      } else {
        hasBuilds.value = Services.get(BuildService).getAll().length > 0
      }

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
      hasLoadingError,
      isImporting,
      isLoading,
      merchantItemsOptionsSidebarVisible,
      openNewBuild,
      showBuildsImportPopup
    }
  }
})