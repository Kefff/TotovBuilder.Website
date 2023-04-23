
<template>
  <Dialog
    v-model:visible="modelValue"
    :closable="false"
    :header="$t('message.selectBuildsToImport')"
    :modal="true"
    :draggable="false"
  >
    <BuildsList
      v-if="showingList"
      v-model="buildsToImportIds"
      :builds-summaries="readenBuildSummaries"
      :multiple="true"
      :show-not-exported="false"
    />
    <div
      v-else
      class="builds-import-file-selection"
    >
      <Button
        class="builds-import-file-selection-button"
        @click="showFileSelectionPopup()"
      >
        <font-awesome-icon
          icon="file"
          class="icon-before-text"
        />
        <span>{{ $t('caption.selectFile') }}</span>
      </Button>
    </div>
    <template #footer>
      <div class="builds-import-buttons">
        <Button
          :disabled="buildsToImportIds.length === 0"
          @click="confirmImport()"
        >
          <font-awesome-icon
            icon="file-import"
            class="icon-before-text"
          />
          <span>{{ $t('caption.importBuilds') }}</span>
        </Button>
        <Button
          v-if="readenBuildSummaries.length > 1"
          class="p-button-text button-discreet"
          @click="toggleSelection()"
        >
          <font-awesome-icon
            icon="list"
            class="icon-before-text"
          />
          <span v-if="allSelected">{{ $t('caption.deselectAll') }}</span>
          <span v-else>{{ $t('caption.selectAll') }}</span>
        </Button>
        <Button
          class="p-button-text builds-import-cancel-button button-discreet"
          @click="cancelImport()"
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

  <!-- Hidden input for import file selection -->
  <input
    ref="importInput"
    type="file"
    :accept="exportFileExtension"
    style="display: none"
    @change="readBuilds()"
  >
</template>

<script lang="ts" src="./BuildsImportComponent.ts" />
<style scoped lang="css" src="./BuildsImportComponent.css" />