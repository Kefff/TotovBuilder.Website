
import { computed, defineComponent, onMounted, onUnmounted, PropType, ref } from 'vue'
import { IBuild } from '../../models/build/IBuild'
import { IBuildSummary } from '../../models/utils/IBuildSummary'
import { BuildService } from '../../services/BuildService'
import { ExportService } from '../../services/ExportService'
import Services from '../../services/repository/Services'
import BuildsList from '../BuildsListComponent.vue'

export default defineComponent({
  components: {
    BuildsList
  },
  props: {
    buildSummaries: {
      type: Array as PropType<IBuildSummary[]>,
      required: true
    },
    isExporting: {
      type: Boolean,
      required: true
    }
  },
  emits: ['update:is-exporting'],
  setup: (props, { emit }) => {
    const allSelected = computed(() => buildToExportSummaries.value.length === props.buildSummaries.length)

    const buildToExportSummaries = ref<IBuildSummary[]>([])

    onMounted(() => {
      addEventListener('keydown', (e) => onKeyDown(e))
    })

    onUnmounted(() => {
      removeEventListener('keydown', (e) => onKeyDown(e))
    })

    /**
     * Cancels the export.
     */
    function cancelExport() {
      emit('update:is-exporting', false)
    }

    /**
     * Exports the selected builds.
     */
    async function confirmExport() {
      const buildService = Services.get(BuildService)
      const buildsToExport: IBuild[] = []

      for (const buildToExportId of buildToExportSummaries.value) {
        const buildToExport = buildService.get(buildToExportId.id)

        if (buildToExport != null) {
          buildsToExport.push(buildToExport)
        }
      }

      await Services.get(ExportService).export(buildsToExport)

      emit('update:is-exporting', false)
    }

    /**
     * Reacts to a keyboard event.
     * @param event - Keyboard event.
     */
    function onKeyDown(event: KeyboardEvent) {
      if (!props.isExporting) {
        return
      }

      if (event.key === 'a' && (event.ctrlKey || event.metaKey)) {
        event.preventDefault() // Prevents the browser save action from being triggered
        buildToExportSummaries.value = props.buildSummaries
      }
    }

    /**
     * Toggles the selection.
     */
    function toggleSelection() {
      if (allSelected.value) {
        buildToExportSummaries.value = []
      } else {
        buildToExportSummaries.value = props.buildSummaries
      }
    }

    return {
      allSelected,
      buildToExportSummaries,
      cancelExport,
      confirmExport,
      toggleSelection
    }
  }
})