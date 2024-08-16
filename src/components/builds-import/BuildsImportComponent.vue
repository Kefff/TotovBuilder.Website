<template>
  <Dialog
    v-model:visible="isImporting"
    :closable="false"
    :header="$t('message.selectBuildsToImport')"
    :modal="true"
    :draggable="false"
  >
    <BuildsList
      v-if="showingList"
      v-model:selected-build-summaries="buildToImportSummaries"
      :build-summaries="readenBuildSummaries"
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
        <div
          v-if="showingList"
          class="builds-import-buttons-left-buttons"
        >
          <Button
            class="builds-import-buttons-import-button"
            @click="confirmImport()"
          >
            <font-awesome-icon
              icon="file-upload"
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
        </div>
        <Button
          class="p-button-text button-discreet builds-import-buttons-cancel-button"
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