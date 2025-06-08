<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { BuildSidebarParameters } from '../../models/utils/IGlobalSidebarOptions'
import { ShareButtons } from '../../models/utils/ShareButtons'
import { BuildService } from '../../services/BuildService'
import { ExportService } from '../../services/ExportService'
import { GlobalSidebarService } from '../../services/GlobalSidebarService'
import Services from '../../services/repository/Services'
import BuildShareButtons from '../BuildShareButtonsComponent.vue'

const modelParameters = defineModel<BuildSidebarParameters>('parameters', { required: true })

const props = defineProps<{ identifier: number }>()

const _buildService = Services.get(BuildService)
const _exportService = Services.get(ExportService)
const _globalSidebarService = Services.get(GlobalSidebarService)

const _router = useRouter()

const isDeleting = ref(false)

onMounted(() => {
  // Dynamically setting the action of the Discord button because it does not open a share link
  // but opens the BuildsShareSideBar
  ShareButtons.discord.onClick = (): void => {
    Services.get(GlobalSidebarService).display({
      displayedComponentType: 'BuildsShareSideBar',
      displayedComponentParameters: {
        buildToShare: modelParameters.value
      }
    })
  }
})

/**
 * Cancels the build deletion.
 */
function cancelDeletion(): void {
  isDeleting.value = false
}

/**
 * Confirms the build deletion.
 */
function confirmDeletion(): void {
  _buildService.delete(modelParameters.value.id)

  isDeleting.value = false
  _globalSidebarService.close(props.identifier)
}

/**
 * Creates a copy of the build.
 */
function copyBuild(): void {
  _router.push({ name: 'CopyBuild', params: { id: modelParameters.value.id } })
  _globalSidebarService.close(props.identifier)
}

/**
 * Starts the build deletion process.
 */
function deleteBuild(): void {
  isDeleting.value = true
}

/**
 * Displays the share build sidebar.
 */
function displayBuildsShareSideBar(): void {
  _globalSidebarService.display({
    displayedComponentParameters: {
      buildToShare: modelParameters.value
    },
    displayedComponentType: 'BuildsShareSideBar'
  })
}

/**
 * Export the build to a file.
 */
function exportBuild(): void {
  _exportService.exportAsync([modelParameters.value])
  _globalSidebarService.close(props.identifier)
}
</script>










<template>
  <div class="sidebar-option build-sidebar-quick-share">
    <BuildShareButtons :build="parameters" />
  </div>
  <div class="sidebar-option">
    <Button
      class="build-sidebar-button"
      outlined
      @click="displayBuildsShareSideBar()"
    >
      <font-awesome-icon
        icon="share-alt"
        class="icon-before-text"
      />
      <span>{{ $t('caption.more-sharing-options') }}</span>
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










<style scoped>
.build-sidebar-button {
  align-items: center;
  display: flex;
  justify-content: center;
  width: 100%;
}

.build-sidebar-deletion-confirmation-buttons {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.5rem;
}

.build-sidebar-deletion-confirmation-buttons > button {
  display: flex;
  justify-content: center;
}

.build-sidebar-name {
  margin-left: 2.5rem;
}

.build-sidebar-quick-share {
  display: flex;
  justify-content: center;
}

.build-sidebar-save-to-file-explanation {
  max-width: 20rem;
}
</style>