import { computed, defineComponent, onMounted, ref } from '@vue/runtime-dom'
import BuildsList from '../builds-list/BuildsListComponent.vue'
import Services from '../../services/repository/Services'
import { ImportService } from '../../services/ImportService'
import { IBuildSummary } from '../../models/utils/IBuildSummary'
import { BuildPropertiesService } from '../../services/BuildPropertiesService'
import { NotificationService, NotificationType } from '../../services/NotificationService'
import { IBuild } from '../../models/build/IBuild'
import { useI18n } from 'vue-i18n'
import { WebsiteConfigurationService } from '../../services/WebsiteConfigurationService'
import { VersionService } from '../../services/VersionService'

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
      notificationService.notify(NotificationType.success, i18n.t('message.buildsImported'), true)
    }

    /**
     * Read builds from the imported file.
     */
    async function readBuilds() {
      readenBuildSummaries.value = []

      if (importInput.value.files.length === 0) {
        return
      }

      const buildPropertiesService = Services.get(BuildPropertiesService)
      const buildFile = importInput.value.files[0]

      const buildsResult = await Services.get(ImportService).getBuildsFromFile(buildFile)

      if (!buildsResult.success) {
        Services.get(NotificationService).notify(NotificationType.error, buildsResult.failureMessage)

        return
      }

      for (const build of buildsResult.value) {
        Services.get(VersionService).executeBuildMigrations(build) // Executing migrations on the build in case it is obsolete
      }

      readenBuilds.value = buildsResult.value

      for (const build of readenBuilds.value) {
        const summaryResult = await buildPropertiesService.getSummary(build)

        if (!summaryResult.success) {
          Services.get(NotificationService).notify(NotificationType.error, summaryResult.failureMessage)

          return
        }

        readenBuildSummaries.value.push(summaryResult.value)
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