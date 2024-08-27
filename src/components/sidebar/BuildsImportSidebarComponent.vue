<template>
  <div class="builds-import-sidebar">
    <div class="sidebar-option">
      <div
        v-if="!isFileSelected"
        class="builds-import-sidebar-button"
      >
        <Button @click="displayFileSelectionPopup()">
          <font-awesome-icon
            icon="file-upload"
            class="icon-before-text"
          />
          <span>{{ ` ${$t('caption.selectFile')}` }}</span>
        </Button>
      </div>
      <div v-else>
        <Toolbar :buttons="toolbarButtons" />
        <BuildsList
          v-model:selected-builds="selectedBuilds"
          :build-summaries="availableBuildSummaries"
          :is-under-toolbar="true"
          :show-not-exported="true"
          mode="export"
        >
          <template #toolbarContent>
            <Button
              :disabled="selectedBuilds?.length == 0"
              severity="success"
              @click="importBuilds()"
            >
              <font-awesome-icon
                icon="file-upload"
                class="icon-before-text"
              />
              <span>{{ ` ${$t('caption.import')}` }}</span>
              <span
                v-show="selectedBuilds.length > 1"
                style="margin-left: 0.25rem;"
              >{{ `(${selectedBuilds.length})` }}</span>
            </Button>
            <Button
              v-if="availableBuildSummaries.length > 1"
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
        </BuildsList>
      </div>
    </div>
  </div>

  <!-- Hidden input for import file selection -->
  <input
    ref="importInput"
    class="builds-import-sidebar-hidden-input"
    type="file"
    :accept="acceptedFileExtension"
    @change="readBuilds()"
  >
</template>










<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { IBuild } from '../../models/build/IBuild'
import { IBuildSummary } from '../../models/utils/IBuildSummary'
import { IToolbarButton } from '../../models/utils/IToolbarButton'
import vueI18n from '../../plugins/vueI18n'
import { GlobalSidebarService } from '../../services/GlobalSidebarService'
import { ImportService } from '../../services/ImportService'
import Services from '../../services/repository/Services'
import { WebsiteConfigurationService } from '../../services/WebsiteConfigurationService'
import BuildsList from '../BuildsListComponent.vue'
import Toolbar from '../ToolbarComponent.vue'

defineModel<undefined>('parameters')

const _globalSidebarService = Services.get(GlobalSidebarService)
const _importService = Services.get(ImportService)
const _websiteConfigurationService = Services.get(WebsiteConfigurationService)

const toolbarButtons: IToolbarButton[] = [
  {
    action: importBuilds,
    canBeMovedToSidebar: () => false,
    caption: () => `${vueI18n.t('caption.import')}` + (selectedBuilds.value.length > 1 ? ` (${selectedBuilds.value.length})` : ''),
    icon: () => 'file-upload',
    isDisabled: () => selectedBuilds.value?.length == 0,
    name: 'import',
    showCaption: () => 'always',
    variant: () => 'success'
  },
  {
    action: toggleSelection,
    canBeMovedToSidebar: () => false,
    caption: () => allSelected.value ? vueI18n.t('caption.deselectAll') : vueI18n.t('caption.selectAll'),
    icon: () => allSelected.value ? 'folder-minus' : 'folder-plus',
    isVisible: () => availableBuildSummaries.value.length > 1,
    name: 'toggleSelection',
    style: () => 'outlined'
  }
]

const acceptedFileExtension = _websiteConfigurationService.configuration.exportFileExtension
const availableBuilds = ref<IBuild[]>([])
const availableBuildSummaries = ref<IBuildSummary[]>([])
const importInput = ref<HTMLInputElement>()
const isFileSelected = ref(false)
const selectedBuilds = ref<IBuildSummary[]>([])

const allSelected = computed(() => selectedBuilds.value.length === availableBuildSummaries.value.length)

onMounted(() => {
  addEventListener('keydown', (e) => onKeyDown(e))
})

onUnmounted(() => {
  removeEventListener('keydown', (e) => onKeyDown(e))
})

/**
 * Displays the file selection popup.
 */
function displayFileSelectionPopup() {
  importInput.value!.click()
}

/**
 * Imports the selected builds.
 */
async function importBuilds() {
  const buildsToImport = availableBuilds.value.filter(ab => selectedBuilds.value.some(sb => sb.id === ab.id))
  await _importService.import(buildsToImport)
  _globalSidebarService.close('BuildsImportSidebar')
}

/**
 * Reacts to a keyboard event.
 * @param event - Keyboard event.
 */
function onKeyDown(event: KeyboardEvent) {
  if (event.key === 'a' && (event.ctrlKey || event.metaKey)) {
    event.preventDefault() // Prevents the browser action from being triggered
    selectedBuilds.value = availableBuildSummaries.value
  }
}

/**
 * Read builds from the imported file.
 */
async function readBuilds() {
  availableBuilds.value = []
  availableBuildSummaries.value = []

  if (importInput.value!.files?.length === 0) {
    return
  }

  const buildFile = importInput.value!.files?.[0]
  const buildsImportResult = await _importService.getBuildsFromFile(buildFile)

  if (buildsImportResult != null) {
    availableBuilds.value = buildsImportResult.builds
    availableBuildSummaries.value = buildsImportResult.buildSummaries
    isFileSelected.value = true
  }
}

/**
 * Toggles the selection.
 */
function toggleSelection() {
  if (allSelected.value) {
    selectedBuilds.value = []
  } else {
    selectedBuilds.value = availableBuildSummaries.value
  }
}
</script>










<style scoped>
@import '../../css/icon.css';
@import '../../css/sidebar.css';

.builds-import-sidebar {
  max-width: 40rem;
}

.builds-import-sidebar-button {
  align-items: center;
  display: flex;
  justify-content: center;
  width: 100%;
}

.builds-import-sidebar-hidden-input {
  display: none;
}
</style>