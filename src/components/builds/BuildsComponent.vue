<template>
  <div class="builds">
    <div class="builds-title">
      {{ $t('caption.buildsList') }}
    </div>
    <div :class="toolbarCssClass">
      <div class="toolbar-line">
        <div class="toolbar-part">
          <Button
            :class="isLoading ? ' p-disabled' : ''"
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
            :class="'p-button-text p-button-sm button-discreet' + (!canExport ? ' p-disabled' : '')"
            @click="showBuildsExportPopup()"
          >
            <font-awesome-icon icon="file-export" />
          </Button>
          <Button
            v-tooltip.top="$t('caption.importBuilds')"
            :class="'p-button-text p-button-sm button-discreet' + (!canImport ? ' p-disabled' : '')"
            @click="showBuildsImportPopup()"
          >
            <font-awesome-icon icon="file-import" />
          </Button>
        </div>
        <div class="toolbar-part toolbar-center" />
        <div class="toolbar-part">
          <div class="builds-toolbar-right">
            <MerchantItemsOptions />
            <DisplayOptions v-model:visible="displayOptionsSidebarVisible" />
            <NotificationButton />
          </div>
        </div>
      </div>
      <div class="toolbar-gradient" />
    </div>
    <div
      v-show="!isLoading && buildsSummaries.length > 0"
      id="builds-content"
    >
      <BuildsList
        v-model="selectedBuildSummary"
        :builds-summaries="buildsSummaries"
        :multiple="false"
      />
    </div>
    <div
      v-show="isLoading"
      class="builds-loading"
    >
      <Loading />
    </div>
  </div>

  <!-- Export -->
  <BuildsExport
    v-if="!isLoading"
    v-model="isExporting"
    :builds-summaries="buildsSummaries"
  />

  <!-- Import -->
  <BuildsImport
    v-if="!isLoading"
    v-model="isImporting"
    v-model:has-imported="hasImported"
  />
</template>

<script lang="ts" src="./BuildsComponent.ts" />
<style scoped lang="css" src="./BuildsComponent.css" />