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
            <span>{{ $t('caption.newBuild') }}</span>
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
              v-tooltip.top="$t('caption.merchantsOptions')"
              class="p-button-text p-button-sm button-discreet"
              @click="merchantsOptionsSidebarVisible = true"
            >
              <font-awesome-icon
                icon="user-tag"
              />
            </Button>
            <Button
              v-tooltip.top="$t('caption.displayOptions')"
              class="p-button-text p-button-sm button-discreet"
              @click="displayOptionsSidebarVisible = true"
            >
              <font-awesome-icon
                icon="tv"
              />
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

  <!-- Display options sidebar -->
  <Sidebar
    v-model:visible="displayOptionsSidebarVisible"
    position="right"
    style="width: auto"
  >
    <div class="builds-options-title">
      <font-awesome-icon
        icon="tv"
        class="icon-before-text"
      />
      <span>{{ $t('caption.displayOptions') }}</span>
    </div>
    <div class="builds-options-panel">
      <div class="builds-options-panel-item">
        <LanguageSelector />
      </div>
    </div>
  </Sidebar>

  <!-- Merchants options sidebar -->
  <Sidebar
    v-model:visible="merchantsOptionsSidebarVisible"
    position="right"
    style="width: auto"
  >
    <div class="builds-options-title">
      <font-awesome-icon
        icon="user-tag"
        class="icon-before-text"
      />
      <span>{{ $t('caption.merchants') }}</span>
    </div>
    <div class="builds-options-panel">
      <div
        class="builds-options-panel-item builds-merchant-filter"
      >
        <MerchantFilter @has-saved="merchantsOptionsSidebarVisible = false" />
      </div>
    </div>
  </Sidebar>

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