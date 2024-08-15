<template>
  <div class="sidebar-title">
    <div class="sidebar-title-icon">
      <font-awesome-icon icon="ellipsis-h" />
    </div>
    <div class="build-sidebar-title">
      <span>{{ $t('caption.actions', { build: parameters.name }) }}</span>
      <span>{{ parameters.name }}</span>
    </div>
  </div>
  <div class="sidebar-option">
    <div>
      <Button
        class="p-button-danger"
        @click="deleteBuild()"
      >
        <font-awesome-icon
          icon="trash"
          class="icon-before-text"
        />
        <span>{{ $t('caption.delete') }}</span>
      </Button>
    </div>
  </div>

  <Dialog
    v-model:visible="deleting"
    :closable="false"
    :modal="true"
    :draggable="false"
  >
    <div>
      <span>{{ $t('message.confirmDeleteBuild', { name: parameters.name }) }}</span>
    </div>
    <template #footer>
      <Button
        class="p-button-danger"
        :label="$t('caption.delete')"
        @click="confirmDeletion()"
      >
        <font-awesome-icon
          icon="trash"
          class="icon-before-text"
        />
        <span>{{ $t('caption.delete') }}</span>
      </Button>
      <Button
        class="p-button"
        outlined
        @click="cancelDeletion()"
      >
        <font-awesome-icon
          icon="undo"
          class="icon-before-text"
        />
        <span>{{ $t('caption.cancel') }}</span>
      </Button>
    </template>
  </Dialog>
</template>

<script setup lang="ts">
import { defineProps, ref } from 'vue'
import { BuildSidebarParameters } from '../../models/utils/IGlobalSidebarOptions'
import { BuildService } from '../../services/BuildService'
import { GlobalSidebarService } from '../../services/GlobalSidebarService'
import Services from '../../services/repository/Services'

const props = defineProps<{ parameters: BuildSidebarParameters }>()

const _buildService = Services.get(BuildService)
const _globalSidebarService = Services.get(GlobalSidebarService)

const deleting = ref(false)

/**
 * Cancels the build deletion.
 */
function cancelDeletion() {
  deleting.value = false
}

/**
 * Confirms the build deletion.
 */
function confirmDeletion() {
  _buildService.delete(props.parameters.id)

  deleting.value = false
  _globalSidebarService.close('BuildSidebar')
}

/**
 * Starts the build deletion process.
 */
function deleteBuild() {
  deleting.value = true
}

</script>

<style scoped>
@import '../../css/icon.css';
@import '../../css/sidebar.css';

.build-sidebar-title {
  display: flex;
  flex-direction: column;
}
</style>