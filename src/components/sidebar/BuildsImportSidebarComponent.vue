<script setup lang="ts">
import { useEventListener } from '@vueuse/core'
import { computed, ref, useTemplateRef } from 'vue'
import { IBuild } from '../../models/build/IBuild'
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

const _acceptedFileExtension = _websiteConfigurationService.configuration.exportFileExtension
const _toolbarButtons: IToolbarButton[] = [
  {
    action: importBuildsAsync,
    canBeMovedToSidebar: () => false,
    caption: () => `${vueI18n.t('caption.import')}` + (selectedBuilds.value.length > 1 ? ` (${selectedBuilds.value.length})` : ''),
    icon: () => 'file-upload',
    isDisabled: () => selectedBuilds.value?.length === 0,
    name: 'import',
    showCaption: () => 'always',
    variant: () => 'success'
  },
  {
    action: toggleSelection,
    canBeMovedToSidebar: () => false,
    caption: () => allSelected.value ? vueI18n.t('caption.deselectAll') : vueI18n.t('caption.selectAll'),
    icon: () => allSelected.value ? 'folder-minus' : 'folder-plus',
    isVisible: () => isToggleSelectionVisible.value,
    name: 'toggleSelection',
    style: () => 'outlined'
  }
]

useEventListener(document, 'keydown', onKeyDown)

const builds = ref<IBuild[]>([])
const buildsImportToolbar = useTemplateRef('buildsImportToolbar')
const importInput = ref<HTMLInputElement>()
const isFileSelected = ref(false)
const selectedBuilds = ref<IBuild[]>([])

const isToggleSelectionVisible = computed(() => builds.value.length > 1)
const toolbarContainer = computed(() => buildsImportToolbar.value?.container)

const allSelected = ref(false)

/**
 * Displays the file selection popup.
 */
function displayFileSelectionPopup(): void {
  importInput.value!.click()
}

/**
 * Imports the selected builds.
 */
async function importBuildsAsync(): Promise<void> {
  const buildsToImport = builds.value.filter(ab => selectedBuilds.value.some(sb => sb.id === ab.id))
  await _importService.importAsync(buildsToImport)
  _globalSidebarService.close('BuildsImportSidebar')
}

/**
 * Reacts to a keyboard event.
 * @param event - Keyboard event.
 */
function onKeyDown(event: KeyboardEvent): void {
  if (event.key === 'a'
    && (event.ctrlKey
      || event.metaKey)) {
    event.preventDefault() // Prevents the browser action from being triggered
    selectedBuilds.value = builds.value
  }
}

/**
 * Read builds from the imported file.
 */
async function readBuildsAsync(): Promise<void> {
  builds.value = []

  if (importInput.value!.files?.length === 0) {
    return
  }

  const buildFile = importInput.value!.files?.[0]
  const buildsToImport = await _importService.getBuildsFromFileAsync(buildFile)

  if (buildsToImport != null) {
    builds.value = buildsToImport
    selectedBuilds.value = builds.value
    isFileSelected.value = true
  }
}

/**
 * Toggles the selection.
 */
function toggleSelection(): void {
  allSelected.value = !allSelected.value
}
</script>










<template>
  <div class="builds-import-sidebar">
    <div class="builds-import-sidebar-selection">
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
      <div
        v-else
        class="builds-import-sidebar-list"
      >
        <Toolbar
          ref="buildsImportToolbar"
          :buttons="_toolbarButtons"
          style="margin-top: 1px;"
        />
        <BuildsList
          v-model:all-selected="allSelected"
          v-model:selected-builds="selectedBuilds"
          :element-to-stick-to="toolbarContainer"
          :get-builds-function="() => builds"
          :infinite-scrolling="true"
          :max-elements-per-line="1"
          :selection-options="{
            canUnselect: true,
            isEnabled: true,
            isMultiSelection: true
          }"
          :show-actions-button="false"
          :show-not-exported="false"
        >
          <template #toolbarContent>
            <Button
              :disabled="selectedBuilds?.length == 0"
              severity="success"
              @click="importBuildsAsync()"
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
              v-if="builds.length > 1"
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
    :accept="_acceptedFileExtension"
    @change="readBuildsAsync()"
  >
</template>










<style scoped>
.builds-import-sidebar {
  height: 100%;
  max-width: 40rem;
}

.builds-import-sidebar-button {
  align-items: center;
  display: flex;
  height: 100%;
  justify-content: center;
  width: 100%;
}

.builds-import-sidebar-hidden-input {
  display: none;
}

.builds-import-sidebar-list {
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
}

.builds-import-sidebar-selection {
  display: flex;
  flex-direction: column;
  height: 100%;
}
</style>