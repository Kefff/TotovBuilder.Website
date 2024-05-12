import { computed, defineComponent, onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { IBuild } from '../../models/build/IBuild'
import { IBuildSummary } from '../../models/utils/IBuildSummary'
import { ImportService } from '../../services/ImportService'
import { NotificationService, NotificationType } from '../../services/NotificationService'
import { WebsiteConfigurationService } from '../../services/WebsiteConfigurationService'
import { BuildsImportComponentService } from '../../services/components/BuildsImportComponentService'
import Services from '../../services/repository/Services'
import BuildsList from '../builds-list/BuildsListComponent.vue'

export default defineComponent({
  components: {
    BuildsList
  },
  props: {
    isImporting: {
      type: Boolean,
      required: true
    },
    hasImported: {
      type: Boolean,
      required: true
    }
  },
  emits: ['update:is-importing', 'update:has-imported'],
  setup: (props, { emit }) => {
    const vueI18n = useI18n()
    const buildsImportComponentService = Services.get(BuildsImportComponentService)
    const exportFileExtension = Services.get(WebsiteConfigurationService).configuration.exportFileExtension
    const importService = Services.get(ImportService)
    const notificationService = Services.get(NotificationService)

    const allSelected = computed(() => buildToImportSummaries.value.length === readenBuildSummaries.value.length)
    const showingList = computed(() => readenBuildSummaries.value.length > 0)

    const buildToImportSummaries = ref<IBuildSummary[]>([])
    const importInput = ref()
    const readenBuilds = ref<IBuild[]>([])
    const readenBuildSummaries = ref<IBuildSummary[]>([])

    onMounted(() => document.onkeydown = (e) => onKeyDown(e))

    /**
     * Cancels the import.
     */
    function cancelImport() {
      readenBuilds.value = []
      readenBuildSummaries.value = []
      buildToImportSummaries.value = []

      emit('update:is-importing', false)
    }

    /**
     * Imports the selected builds.
     */
    async function confirmImport() {
      const buildsToImport = readenBuilds.value.filter((rb) => buildToImportSummaries.value.some((btis) => btis.id === rb.id))
      await importService.import(buildsToImport)

      readenBuilds.value = []
      readenBuildSummaries.value = []
      buildToImportSummaries.value = []

      emit('update:is-importing', false)
      emit('update:has-imported', true)
      notificationService.notify(NotificationType.success, vueI18n.t('message.buildsImported'))
    }

    /**
     * Read builds from the imported file.
     */
    async function readBuilds() {
      readenBuilds.value = []
      readenBuildSummaries.value = []

      if (importInput.value.files.length === 0) {
        return
      }

      const buildFile = importInput.value.files[0]
      const buildsImportResult = await buildsImportComponentService.readBuilds(buildFile)

      if (buildsImportResult != null) {
        readenBuilds.value = buildsImportResult.builds
        readenBuildSummaries.value = buildsImportResult.buildSummaries
      }
    }

    /**
     * Reacts to a keyboard event.
     * @param event - Keyboard event.
     */
    function onKeyDown(event: KeyboardEvent) {
      if (!props.isImporting || !showingList.value) {
        return
      }

      if (event.key === 'a' && (event.ctrlKey || event.metaKey)) {
        event.preventDefault() // Prevents the browser save action to be triggered
        buildToImportSummaries.value = readenBuildSummaries.value
      }
    }

    /**
     * Toggles the selection.
     */
    function toggleSelection() {
      if (allSelected.value) {
        buildToImportSummaries.value = []
      } else {
        buildToImportSummaries.value = readenBuildSummaries.value
      }
    }

    /**
     * Shows the file selection popup.
     */
    function showFileSelectionPopup() {
      importInput.value.click()
    }

    return {
      allSelected,
      buildToImportSummaries,
      cancelImport,
      confirmImport,
      exportFileExtension,
      importInput,
      readBuilds,
      readenBuildSummaries,
      showFileSelectionPopup,
      showingList,
      toggleSelection
    }
  }
})