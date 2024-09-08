<template>
  <div class="sidebar-option">
    <Button
      class="build-sidebar-button"
      @click="displayBuildsShareSideBar()"
    >
      <font-awesome-icon
        icon="share-alt"
        class="icon-before-text"
      />
      <span>{{ $t('caption.share') }}</span>
    </Button>
  </div>
  <div class="sidebar-option">
    <Button
      class="build-sidebar-button"
      outlined
      @click="copyBuild()"
    >
      <font-awesome-icon
        icon="copy"
        class="icon-before-text"
      />
      <span>{{ $t('caption.copyBuild') }}</span>
    </Button>
  </div>
  <div class="sidebar-option">
    <Button
      class="build-sidebar-button"
      outlined
      @click="exportBuild()"
    >
      <font-awesome-icon
        icon="download"
        class="icon-before-text"
      />
      <span>{{ $t('caption.export') }}</span>
    </Button>
  </div>
  <div class="sidebar-option-description">
    <div class="sidebar-option-icon">
      <font-awesome-icon icon="info-circle" />
    </div>
    <span class="build-sidebar-save-to-file-explanation">
      {{ $t('message.exportExplanation') }}
    </span>
  </div>
  <div class="sidebar-title" />
  <div class="sidebar-option">
    <Button
      class="build-sidebar-button"
      severity="danger"
      outlined
      @click="deleteBuild()"
    >
      <font-awesome-icon
        icon="trash"
        class="icon-before-text"
      />
      <span>{{ $t('caption.delete') }}</span>
    </Button>
  </div>

  <!-- Deletion confirmation dialog -->
  <Dialog
    v-model:visible="isDeleting"
    :closable="false"
    :modal="true"
    :draggable="false"
  >
    <div>
      <span>{{ $t('message.confirmDeleteBuild', { name: parameters.name }) }}</span>
    </div>
    <template #footer>
      <div class="build-sidebar-deletion-confirmation-buttons">
        <Button
          :label="$t('caption.delete')"
          severity="danger"
          @click="confirmDeletion()"
        >
          <font-awesome-icon
            icon="trash"
            class="icon-before-text"
          />
          <span>{{ $t('caption.delete') }}</span>
        </Button>
        <Button
          outlined
          @click="cancelDeletion()"
        >
          <font-awesome-icon
            icon="undo"
            class="icon-before-text"
          />
          <span>{{ $t('caption.cancel') }}</span>
        </Button>
      </div>
    </template>
  </Dialog>
</template>










<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { BuildSidebarParameters } from '../../models/utils/IGlobalSidebarOptions'
import { BuildService } from '../../services/BuildService'
import { ExportService } from '../../services/ExportService'
import { GlobalSidebarService } from '../../services/GlobalSidebarService'
import Services from '../../services/repository/Services'

const props = defineProps<{ parameters: BuildSidebarParameters }>()

const _buildService = Services.get(BuildService)
const _exportService = Services.get(ExportService)
const _globalSidebarService = Services.get(GlobalSidebarService)
const _router = useRouter()

const isDeleting = ref(false)

/**
 * Cancels the build deletion.
 */
function cancelDeletion() {
  isDeleting.value = false
}

/**
 * Confirms the build deletion.
 */
function confirmDeletion() {
  _buildService.delete(props.parameters.id)

  isDeleting.value = false
  _globalSidebarService.close('BuildSidebar')
}

/**
 * Creates a copy of the build.
 */
function copyBuild() {
  _router.push({ name: 'CopyBuild', params: { id: props.parameters.id } })
  _globalSidebarService.close('BuildSidebar')
}

/**
 * Starts the build deletion process.
 */
function deleteBuild() {
  isDeleting.value = true
}

/**
 * Displays the share build sidebar.
 */
function displayBuildsShareSideBar() {
  _globalSidebarService.display({
    displayedComponentParameters: {
      buildToShare: props.parameters
    },
    displayedComponentType: 'BuildsShareSideBar'
  })
}

/**
 * Export the build to a file.
 */
function exportBuild() {
  _exportService.export([props.parameters])
  _globalSidebarService.close('BuildSidebar')
}
</script>










<style scoped>
@import '../../css/icon.css';
@import '../../css/sidebar.css';

.build-sidebar-button {
  align-items: center;
  display: flex;
  justify-content: center;
  width: 100%;
}

.build-sidebar-deletion-confirmation-buttons {
  align-items: center;
  display: flex;
  gap: 0.5rem;
  justify-content: center;
  width: 100%;
}

.build-sidebar-name {
  margin-left: 2.5rem;
}

.build-sidebar-save-to-file-explanation {
  max-width: 20rem;
}
</style>