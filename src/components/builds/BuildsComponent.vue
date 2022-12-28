<template>
  <div class="builds">
    <div class="builds-title">
      {{ $t('caption.buildsList') }}
    </div>
    <div :class="toolbarCssClass">
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
            v-tooltip.top="$t('caption.export')"
            :class="'p-button-text p-button-sm button-discreet' + (!canExport ? ' p-disabled' : '')"
            @click="showBuildsExportPopup()"
          >
            <font-awesome-icon icon="file-export" />
          </Button>
          <Button
            v-tooltip.top="$t('caption.import')"
            :class="'p-button-text p-button-sm button-discreet' + (!canExport ? ' p-disabled' : '')"
            @click="showBuildsImportPopup()"
          >
            <font-awesome-icon icon="file-import" />
          </Button>
        </div>
        <div class="toolbar-part toolbar-center" />
        <div class="toolbar-part">
          <div class="build-toolbar-right">
            <Button
              v-tooltip.top="$t('caption.options')"
              class="p-button-text p-button-sm button-discreet"
              @click="toggleOptionsPanel"
            >
              <font-awesome-icon icon="cog" />
            </Button>
            <NotificationButton />
          </div>
        </div>
      </div>
      <div class="toolbar-gradient" />
    </div>
    <div
      v-if="!isLoading && buildsSummaries.length > 0"
      id="builds-content"
    >
      <BuildsList
        v-model="selectedBuildSummary"
        :builds-summaries="buildsSummaries"
        :multiple="false"
      />
    </div>
    <div
      v-else-if="isLoading"
      class="builds-loading"
    >
      <Loading />
    </div>
  </div>

  <!-- Options panel -->
  <OverlayPanel
    ref="optionsPanel"
    :dismissable="true"
  >
    <div class="builds-options-panel">
      <div class="builds-options-panel-item builds-options-panel-special-item">
        <LanguageSelector />
      </div>
      <div
        class="builds-options-panel-item builds-options-panel-special-item"
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