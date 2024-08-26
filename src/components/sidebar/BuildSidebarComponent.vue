<template>
  <div class="sidebar-title">
    <div class="sidebar-title-icon">
      <font-awesome-icon icon="ellipsis-h" />
    </div>
    <span>{{ $t('caption.actions') }}</span>
  </div>
  <span class="build-sidebar-name">{{ parameters.name }}</span>
  <div class="sidebar-option">
    <Button
      class="p-button build-sidebar-button"
      @click="displayBuildShareSideBar()"
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
      class="p-button build-sidebar-button"
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
      v-if="!isDeleting"
      class="build-sidebar-button"
      severity="danger"
      @click="deleteBuild()"
    >
      <font-awesome-icon
        icon="trash"
        class="icon-before-text"
      />
      <span>{{ $t('caption.delete') }}</span>
    </Button>
    <div
      v-else
      class="build-sidebar-deletetion-confirmation"
    >
      <div>{{ $t('message.confirmDeleteBuild', { name: parameters.name }) }}</div>
      <Button
        class="p-button build-sidebar-button"
        outlined
        @click="cancelDeletion()"
      >
        <font-awesome-icon
          icon="undo"
          class="icon-before-text"
        />
        <span>{{ $t('caption.cancel') }}</span>
      </Button>
      <Button
        class="build-sidebar-button"
        severity="danger"
        @click="confirmDeletion()"
      >
        <font-awesome-icon
          icon="trash"
          class="icon-before-text"
        />
        <span>{{ $t('caption.delete') }}</span>
      </Button>
    </div>
  </div>
</template>










<script setup lang="ts">
import { ref } from 'vue'
import { BuildSidebarParameters } from '../../models/utils/IGlobalSidebarOptions'
import { BuildService } from '../../services/BuildService'
import { ExportService } from '../../services/ExportService'
import { GlobalSidebarService } from '../../services/GlobalSidebarService'
import Services from '../../services/repository/Services'

const props = defineProps<{ parameters: BuildSidebarParameters }>()

const _buildService = Services.get(BuildService)
const _exportService = Services.get(ExportService)
const _globalSidebarService = Services.get(GlobalSidebarService)

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
 * Starts the build deletion process.
 */
function deleteBuild() {
  isDeleting.value = true
}

/**
 * Displays the share build sidebar.
 */
function displayBuildShareSideBar() {
  _globalSidebarService.display({
    displayedComponentParameters: props.parameters,
    displayedComponentType: 'BuildShareSideBar'
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

.build-sidebar-deletetion-confirmation {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  width: 100%;
}

.build-sidebar-name {
  margin-left: 2.5rem;
}

.build-sidebar-save-to-file-explanation {
  max-width: 20rem;
}
</style>