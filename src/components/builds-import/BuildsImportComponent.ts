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
    modelValue: {
      type: Boolean,
      required: true
    },
    hasImported: {
      type: Boolean,
      required: true
    }
  },
  emits: ['update:modelValue', 'update:hasImported'],
  setup: (props, { emit }) => {
    const buildsImportComponentService = Services.get(BuildsImportComponentService)

    const i18n = useI18n()
    const importService = Services.get(ImportService)
    const notificationService = Services.get(NotificationService)

    const importInput = ref()
    const readenBuilds = ref<IBuild[]>([])
    const readenBuildSummaries = ref<IBuildSummary[]>([])
    const buildsToImportIds = ref<string[]>([])
    const showingList = computed(() => readenBuildSummaries.value.length > 0)
    const allSelected = computed(() => buildsToImportIds.value.length === readenBuildSummaries.value.length)

    const exportFileExtension = Services.get(WebsiteConfigurationService).configuration.exportFileExtension

    onMounted(() => document.onkeydown = (e) => onKeyDown(e))

    /**
     * Cancels the import.
     */
    function cancelImport() {
      readenBuilds.value = []
      readenBuildSummaries.value = []
      buildsToImportIds.value = []

      emit('update:modelValue', false)
    }

    /**
     * Imports the selected builds.
     */
    async function confirmImport() {
      const buildsToImport = readenBuilds.value.filter((rb) => buildsToImportIds.value.some((btii) => btii === rb.id))
      await importService.import(buildsToImport)

      readenBuilds.value = []
      readenBuildSummaries.value = []
      buildsToImportIds.value = []

      emit('update:modelValue', false)
      emit('update:hasImported', true)
      notificationService.notify(NotificationType.success, i18n.t('message.buildsImported'))
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
      if (!props.modelValue || !showingList.value) {
        return
      }

      if (event.key === 'a' && (event.ctrlKey || event.metaKey)) {
        event.preventDefault() // Prevents the browser save action to be triggered
        buildsToImportIds.value = readenBuildSummaries.value.map(rbs => rbs.id)
      }
    }

    /**
     * Toggles the selection.
     */
    function toggleSelection() {
      if (allSelected.value) {
        buildsToImportIds.value = []
      } else {
        buildsToImportIds.value = readenBuildSummaries.value.map(rbs => rbs.id)
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
      buildsToImportIds,
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