<template>
  <div class="builds">
    <div class="toolbar">
      <div class="toolbar-line">
        <div class="toolbar-part">
          <Button @click="openNewBuild()">
            <font-awesome-icon
              icon="plus"
              class="icon-before-text"
            />
            <span>{{ $t('caption.new') }}</span>
          </Button>
          <Button
            v-tooltip.top="$t('caption.moreFunctionalities')"
            class="p-button-text p-button-sm toolbar-button-discreet"
            @click="toggleAdvancedPanel"
          >
            <font-awesome-icon icon="cog" />
          </Button>
          <NotificationButton />
        </div>
      </div>
      <div class="toolbar-gradient" />
    </div>
    <div v-if="!isLoading && buildsSummaries.length > 0">
      <BuildsList
        v-model="selectedBuildSummary"
        :builds-summaries="buildsSummaries"
        :multiple="false"
      />
    </div>
    <div
      v-if="isLoading"
      class="builds-loading"
    >
      <Loading />
    </div>
  </div>

  <!-- Advanced menu -->
  <OverlayPanel
    ref="advancedPanel"
    :dismissable="true"
  >
    <div class="builds-advanced-panel">
      <div
        :class="'builds-advanced-panel-item' + (!canExport ? ' p-disabled' : '')"
        @click="showBuildsExportPopup()"
      >
        <font-awesome-icon
          icon="file-export"
          class="icon-before-text"
        />
        <span>{{ $t('caption.export') }}</span>
      </div>
      <div
        class="builds-advanced-panel-item"
        @click="showBuildsImportPopup()"
      >
        <font-awesome-icon
          icon="file-import"
          class="icon-before-text"
        />
        <span>{{ $t('caption.import') }}</span>
      </div>
      <div class="builds-advanced-panel-item">
        <LanguageSelector />
      </div>
      <div
        class="builds-advanced-panel-item builds-merchant-filter"
      >
        <MerchantFilter />
      </div>
    </div>
  </OverlayPanel>

  <!-- Export -->
  <BuildsExport
    v-model="isExporting"
    :builds-summaries="buildsSummaries"
  />

  <!-- Import -->
  <BuildsImport
    v-model="isImporting"
    v-model:has-imported="hasImported"
  />
</template>

<script lang="ts" src="./BuildsComponent.ts" />
<style scoped lang="css" src="./BuildsComponent.css" />