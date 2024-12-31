<script setup lang="ts">
import { useEventListener } from '@vueuse/core'
import { computed, ref, useTemplateRef } from 'vue'
import { IBuild } from '../../models/build/IBuild'
import { IBuildSummary } from '../../models/utils/IBuildSummary'
import { BuildsExportSidebarParameters } from '../../models/utils/IGlobalSidebarOptions'
import { IToolbarButton } from '../../models/utils/IToolbarButton'
import vueI18n from '../../plugins/vueI18n'
import { BuildService } from '../../services/BuildService'
import { ExportService } from '../../services/ExportService'
import { GlobalSidebarService } from '../../services/GlobalSidebarService'
import Services from '../../services/repository/Services'
import BuildsList from '../BuildsListComponent.vue'
import Toolbar from '../ToolbarComponent.vue'

const modelParameters = defineModel<BuildsExportSidebarParameters>('parameters', { required: true })

const _buildService = Services.get(BuildService)
const _exportService = Services.get(ExportService)
const _globalSidebarService = Services.get(GlobalSidebarService)

const toolbarButtons: IToolbarButton[] = [
  {
    action: exportBuildsAsync,
    canBeMovedToSidebar: () => false,
    caption: () => `${vueI18n.t('caption.save')}` + (selectedBuilds.value.length > 1 ? ` (${selectedBuilds.value.length})` : ''),
    icon: () => 'download',
    isDisabled: () => selectedBuilds.value?.length == 0,
    name: 'export',
    showCaption: () => 'always',
    variant: () => 'success'
  },
  {
    action: toggleSelection,
    canBeMovedToSidebar: () => false,
    caption: () => allSelected.value ? vueI18n.t('caption.deselectAll') : vueI18n.t('caption.selectAll'),
    icon: () => allSelected.value ? 'folder-minus' : 'folder-plus',
    isVisible: () => modelParameters.value.length > 1,
    name: 'toggleSelection',
    style: () => 'outlined'
  }
]

const allSelected = computed(() => selectedBuilds.value.length === modelParameters.value.length)
const toolbarContainer = computed(() => buildsExportToolbar.value?.container)

const buildsExportToolbar = useTemplateRef('buildsExportToolbar')
const selectedBuilds = ref<IBuildSummary[]>([])

useEventListener(document, 'keydown', onKeyDown)

/**
 * Exports the selected builds.
 */
async function exportBuildsAsync(): Promise<void> {
  const buildsToExport: IBuild[] = []

  for (const buildToExportId of selectedBuilds.value) {
    const buildToExport = _buildService.get(buildToExportId.id)

    if (buildToExport != null) {
      buildsToExport.push(buildToExport)
    }
  }

  await _exportService.exportAsync(buildsToExport)
  _globalSidebarService.close('BuildsExportSidebar')
}

/**
 * Reacts to a keyboard event.
 * @param event - Keyboard event.
 */
function onKeyDown(event: KeyboardEvent): void {
  if (event.key === 'a' && (event.ctrlKey || event.metaKey)) {
    event.preventDefault() // Prevents the browser action from being triggered
    selectedBuilds.value = modelParameters.value
  }
}

/**
 * Toggles the selection.
 */
function toggleSelection(): void {
  if (allSelected.value) {
    selectedBuilds.value = []
  } else {
    selectedBuilds.value = modelParameters.value
  }
}
</script>










<template>
  <div class="builds-export-sidebar">
    <div class="builds-export-sidebar-selection">
      <Toolbar
        ref="buildsExportToolbar"
        :buttons="toolbarButtons"
        style="margin-top: 1px;"
      />
      <BuildsList
        v-model:selected-builds="selectedBuilds"
        :build-summaries="parameters"
        :element-to-stick-to="toolbarContainer"
        :infinite-scrolling="true"
        :max-elements-per-line="1"
        :selection-options="{
          canUnselect: true,
          isEnabled: true,
          isMultiSelection: true
        }"
        :show-actions-button="false"
        :show-not-exported="true"
      />
    </div>
  </div>
</template>










<style scoped>
.builds-export-sidebar {
  height: 100%;
  max-width: 40rem;
}

.builds-export-sidebar-selection {
  display: flex;
  flex-direction: column;
  height: 100%;
}
</style>