<template>
  <Dialog
    v-model:visible="modelValue"
    :closable="false"
    :header="$t('message.selectBuildsToExport')"
    :modal="true"
    :draggable="false"
    append-to="self"
  >
    <BuildsList
      v-model="buildsToExportIds"
      :builds-summaries="buildsSummaries"
      :multiple="true"
    />
    <template #footer>
      <div class="builds-export-buttons">
        <Button
          :disabled="buildsToExportIds.length === 0"
          @click="confirmExport()"
        >
          <font-awesome-icon
            icon="file-export"
            class="icon-before-text"
          />
          <span>{{ $t('caption.export') }}</span>
        </Button>
        <Button
          v-if="buildsSummaries.length > 1"
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
          class="p-button-text builds-export-cancel-button button-discreet"
          @click="cancelExport()"
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

<script lang="ts" src="./BuildsExportComponent.ts" />
<style scoped lang="css" src="./BuildsExportComponent.css" />