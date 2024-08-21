<template>
  <div class="sidebar-title">
    <div class="sidebar-title-icon">
      <font-awesome-icon icon="download" />
    </div>
    <span>{{ $t('message.selectBuildsToExport') }}</span>
  </div>
  <div class="sidebar-option">
    <BuildsList
      v-model:selected-builds="selectedBuilds"
      :build-summaries="parameters"
      mode="export"
      :show-not-exported="true"
    >
      <template #toolbarContent>
        <Button
          :disabled="selectedBuilds?.length == 0"
          class="p-button-success"
          @click="exportBuilds()"
        >
          <font-awesome-icon
            icon="download"
            class="icon-before-text"
          />
          <span>{{ ` ${$t('caption.save')}` }}</span>
          <span
            v-show="selectedBuilds.length > 1"
            style="margin-left: 0.25rem;"
          >{{ `(${selectedBuilds.length})` }}</span>
        </Button>
        <Button
          v-if="parameters.length > 1"
          outlined
          @click="toggleSelection()"
        >
          <font-awesome-icon
            icon="list"
            class="icon-before-text"
          />
          <span v-if="allSelected">{{ $t('caption.deselectAll') }}</span>
          <span v-else>{{ $t('caption.selectAll') }}</span>
        </Button>
      </template>
    </buildslist>
  </div>
</template>










<script setup lang="ts">
import { computed, ref } from 'vue'
import { IBuild } from '../../models/build/IBuild'
import { IBuildSummary } from '../../models/utils/IBuildSummary'
import { BuildsExportSidebarParameters } from '../../models/utils/IGlobalSidebarOptions'
import { BuildService } from '../../services/BuildService'
import { ExportService } from '../../services/ExportService'
import { GlobalSidebarService } from '../../services/GlobalSidebarService'
import Services from '../../services/repository/Services'
import BuildsList from '../BuildsListComponent.vue'

const props = defineProps<{ parameters: BuildsExportSidebarParameters }>()

const _buildService = Services.get(BuildService)
const _exportService = Services.get(ExportService)
const _globalSidebarService = Services.get(GlobalSidebarService)

const selectedBuilds = ref<IBuildSummary[]>([])

const allSelected = computed(() => selectedBuilds.value.length === props.parameters.length)

/**
 * Exports the selected builds.
 */
async function exportBuilds() {
  const buildsToExport: IBuild[] = []

  for (const buildToExportId of selectedBuilds.value) {
    const buildToExport = _buildService.get(buildToExportId.id)

    if (buildToExport != null) {
      buildsToExport.push(buildToExport)
    }
  }

  await _exportService.export(buildsToExport)
  _globalSidebarService.close('BuildsExportSidebar')
}

/**
 * Toggles the selection.
 */
function toggleSelection() {
  if (allSelected.value) {
    selectedBuilds.value = []
  } else {
    selectedBuilds.value = props.parameters
  }
}
</script>










<style scoped>
@import '../../css/icon.css';
@import '../../css/sidebar.css';
</style>