<template>
  <div class="builds">
    <div class="builds-title">
      {{ $t('caption.buildsList') }}
    </div>
    <Toolbar sticky-trigger-selector="#builds-content">
      <div class="toolbar-part">
        <Button
          :disabled="isLoading"
          @click="openNewBuild()"
        >
          <font-awesome-icon
            icon="plus"
            class="icon-before-text"
          />
          <span>{{ $t('caption.new') }}</span>
        </Button>
        <Tooltip
          :tooltip="$t('caption.exportBuilds')"
          :apply-hover-style="false"
        >
          <Button
            class="p-button-text p-button-sm button-discreet"
            :disabled="isLoading || !canExport"
            @click="showBuildsExportPopup()"
          >
            <font-awesome-icon icon="file-export" />
          </Button>
        </Tooltip>
        <Tooltip
          :tooltip="$t('caption.importBuilds')"
          :apply-hover-style="false"
        >
          <Button
            class="p-button-text p-button-sm button-discreet"
            :disabled="isLoading || !canImport"
            @click="showBuildsImportPopup()"
          >
            <font-awesome-icon icon="file-import" />
          </Button>
        </Tooltip>
      </div>
      <div class="toolbar-part toolbar-center" />
      <div class="toolbar-part">
        <div class="builds-toolbar-right">
          <Tooltip
            :tooltip="$t('caption.merchantItemsOptions')"
            :apply-hover-style="false"
          >
            <Button
              class="p-button-text p-button-sm button-discreet"
              :disabled="isLoading"
              @click="displayMerchantItemsOptions()"
            >
              <font-awesome-icon icon="user-tag" />
            </Button>
          </Tooltip>
          <Tooltip
            :tooltip="$t('caption.options')"
            :apply-hover-style="false"
          >
            <Button
              class="p-button-text p-button-sm button-discreet"
              @click="displayGeneralOptions()"
            >
              <font-awesome-icon icon="cog" />
            </Button>
          </Tooltip>
          <NotificationButton />
        </div>
      </div>
    </Toolbar>
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
        :show-not-exported="true"
        @update:selected-build-ids="onBuildClick"
      />
    </div>
  </div>

  <!-- Export -->
  <BuildsExport
    v-if="!isLoading"
    v-model:is-exporting="isExporting"
    :build-summaries="buildSummaries"
  />

  <!-- Import -->
  <BuildsImport
    v-if="!isLoading"
    v-model:is-importing="isImporting"
    v-model:has-imported="hasImported"
  />
</template>

<script lang="ts" src="./BuildsComponent.ts" />
<style scoped lang="css" src="./BuildsComponent.css" />