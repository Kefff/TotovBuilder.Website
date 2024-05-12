<template>
  <div class="builds">
    <div class="builds-title">
      {{ $t('caption.buildsList') }}
    </div>
    <div :class="toolbarCssClass">
      <div class="toolbar-line">
        <div class="toolbar-part">
          <Button
            :disabled="isLoading || hasLoadingError"
            @click="openNewBuild()"
          >
            <font-awesome-icon
              icon="plus"
              class="icon-before-text"
            />
            <span>{{ $t('caption.newBuild') }}</span>
          </Button>
          <Button
            v-tooltip.top="$t('caption.exportBuilds')"
            class="p-button-text p-button-sm button-discreet"
            :disabled="isLoading || hasLoadingError || !canExport"
            @click="showBuildsExportPopup()"
          >
            <font-awesome-icon icon="file-export" />
          </Button>
          <Button
            v-tooltip.top="$t('caption.importBuilds')"
            class="p-button-text p-button-sm button-discreet"
            :disabled="isLoading || hasLoadingError || !canImport"
            @click="showBuildsImportPopup()"
          >
            <font-awesome-icon icon="file-import" />
          </Button>
        </div>
        <div class="toolbar-part toolbar-center" />
        <div class="toolbar-part">
          <div class="builds-toolbar-right">
            <MerchantItemsOptions />
            <GeneralOptions />
            <NotificationButton />
          </div>
        </div>
      </div>
      <div class="toolbar-gradient" />
    </div>
    <div
      v-show="isLoading"
      class="builds-loading"
    >
      <Loading />
    </div>
    <div
      v-show="!isLoading && buildSummaries.length > 0"
      id="builds-content"
    >
      <BuildsList
        :build-summaries="buildSummaries"
        @update:selected-build-ids="($event: string[]) => onBuildClick($event)"
      />
    </div>
  </div>

  <!-- Export -->
  <BuildsExport
    v-if="!isLoading && !hasLoadingError"
    v-model:is-exporting="isExporting"
    :build-summaries="buildSummaries"
  />

  <!-- Import -->
  <BuildsImport
    v-if="!isLoading && !hasLoadingError"
    v-model:is-importing="isImporting"
    v-model:has-imported="hasImported"
  />

  <!-- Loading error -->
  <LoadingError
    v-model:hasItemsLoadingError="hasItemsLoadingError"
    v-model:hasWebsiteConfigurationLoadingError="hasWebsiteConfigurationLoadingError"
  />
</template>

<script lang="ts" src="./BuildsComponent.ts" />
<style scoped lang="css" src="./BuildsComponent.css" />