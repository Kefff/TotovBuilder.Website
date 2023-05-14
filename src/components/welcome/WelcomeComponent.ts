import { defineComponent, ref, watch } from 'vue'
import router from '../../plugins/vueRouter'
import { BuildService } from '../../services/BuildService'
import Services from '../../services/repository/Services'
import BuildsImport from '../builds-import/BuildsImportComponent.vue'
import MerchantItemsOptions from '../merchant-items-options/MerchantItemsOptionsComponent.vue'
import DisplayOptions from '../display-options/DisplayOptionsComponent.vue'

export default defineComponent({
  components: {
    BuildsImport,
    DisplayOptions,
    MerchantItemsOptions
  },
  setup: () => {
    const hasBuilds = Services.get(BuildService).getAll().length > 0

    const displayOptionsSidebarVisible = ref(false)
    const isImporting = ref(false)
    const hasImported = ref(false)
    const merchantItemsOptionsSidebarVisible = ref(false)

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
      isImporting,
      merchantItemsOptionsSidebarVisible,
      openNewBuild,
      showBuildsImportPopup
    }
  }
})