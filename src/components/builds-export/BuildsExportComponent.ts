
import { computed, defineComponent, onMounted, PropType, ref } from 'vue'
import { IBuild } from '../../models/build/IBuild'
import { IBuildSummary } from '../../models/utils/IBuildSummary'
import { BuildService } from '../../services/BuildService'
import { ExportService } from '../../services/ExportService'
import Services from '../../services/repository/Services'
import BuildsList from '../builds-list/BuildsListComponent.vue'

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
  emits: ['update:isExporting'],
  setup: (props, { emit }) => {
    const buildsToExportIds = ref<string[]>([])
    const allSelected = computed(() => buildsToExportIds.value.length === props.buildSummaries.length)

    onMounted(() => document.onkeydown = (e) => onKeyDown(e))

    /**
     * Cancels the export.
     */
    function cancelExport() {
      emit('update:isExporting', false)
    }

    /**
     * Exports the selected builds.
     */
    async function confirmExport() {
      const buildService = Services.get(BuildService)
      const buildsToExport: IBuild[] = []

      for (const buildToExportId of buildsToExportIds.value) {
        const buildToExport = buildService.get(buildToExportId)

        if (buildToExport != null) {
          buildsToExport.push(buildToExport)
        }
      }

      await Services.get(ExportService).export(buildsToExport)

      emit('update:isExporting', false)
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
        event.preventDefault() // Prevents the browser save action to be triggered
        buildsToExportIds.value = props.buildSummaries.map(bs => bs.id)
      }
    }

    /**
     * Toggles the selection.
     */
    function toggleSelection() {
      if (allSelected.value) {
        buildsToExportIds.value = []
      } else {
        buildsToExportIds.value = props.buildSummaries.map(bs => bs.id)
      }
    }

    return {
      allSelected,
      buildsToExportIds,
      cancelExport,
      confirmExport,
      toggleSelection
    }
  }
})