import { defineComponent, ref, watch } from 'vue'
import router from '../../plugins/vueRouter'
import { BuildService } from '../../services/BuildService'
import Services from '../../services/repository/Services'
import BuildsImport from '../builds-import/BuildsImportComponent.vue'
import MerchantFilter from '../merchant-filter/MerchantFilterComponent.vue'
import LanguageSelector from '../language-selector/LanguageSelectorComponent.vue'

export default defineComponent({
  components: {
    BuildsImport,
    LanguageSelector,
    MerchantFilter
  },
  setup: () => {
    const hasBuilds = Services.get(BuildService).getAll().length > 0

    const isImporting = ref(false)
    const hasImported = ref(false)

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
      hasBuilds,
      hasImported,
      isImporting,
      openNewBuild,
      showBuildsImportPopup
    }
  }
})