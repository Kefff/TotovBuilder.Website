<template>
  <DataTable
    v-model:selection="selectedBuildSummaries"
    :value="buildsSummaries"
    data-key="id"
    :sort-field="sortField"
    :sort-order="sortOrder"
    :selection-mode="selectionMode"
    :meta-key-selection="false"
    @row-select="updateSelectedBuildSummaries()"
    @row-unselect="updateSelectedBuildSummaries()"
    @sort="onSort"
  >
    <Column
      v-if="showNotExported"
      field="exported"
      :sortable="false"
    >
      <template #body="{data}">
        <div class="build-list-column">
          <span
            v-if="!data.exported"
            v-tooltip.right="getNotExportedTooltip(data)"
            class="build-list-not-exported"
          >
            <font-awesome-icon
              icon="exclamation-triangle"
            />
          </span>
        </div>
      </template>
    </Column>
    <Column
      field="name"
      :sortable="true"
    >
      <template #header>
        <div class="build-list-column">
          {{ $t('caption.name') }}
        </div>
      </template>
      <template #body="{data}">
        <div class="build-list-column">
          {{ data.name }}
        </div>
      </template>
    </Column>
    <Column
      field="verticalRecoil"
      :sortable="true"
    >
      <template #header>
        <div class="build-list-column">
          {{ $t('caption.verticalRecoil') }}
        </div>
      </template>
      <template #body="{data}">
        <div
          v-if="data.verticalRecoil != null"
          class="build-list-column"
        >
          <span>{{ data.verticalRecoil }}</span>
          <font-awesome-icon
            icon="arrows-alt-v"
            class="icon-after-text"
          />
        </div>
      </template>
    </Column>
    <Column
      field="horizontalRecoil"
      :sortable="true"
    >
      <template #header>
        <div class="build-list-column">
          {{ $t('caption.horizontalRecoil') }}
        </div>
      </template>
      <template #body="{data}">
        <div
          v-if="data.horizontalRecoil != null"
          class="build-list-column"
        >
          <span>{{ data.horizontalRecoil }}</span>
          <font-awesome-icon
            icon="arrows-alt-h"
            class="icon-after-text"
          />
        </div>
      </template>
    </Column>
    <Column
      field="ergonomics"
      :sortable="true"
    >
      <template #header>
        <div class="build-list-column">
          {{ $t('caption.ergonomics') }}
        </div>
      </template>
      <template #body="{data}">
        <div class="build-list-column">
          <div v-if="data.ergonomics != null">
            <span>{{ data.ergonomics }}</span>
            <font-awesome-icon
              icon="hand-paper"
              class="icon-after-text"
            />
          </div>
        </div>
      </template>
    </Column>
    <Column
      field="ergonomicsPercentageModifier"
      :sortable="true"
    >
      <template #header>
        <div class="build-list-column">
          {{ $t('caption.ergonomicsPercentageModifier') }}
        </div>
      </template>
      <template #body="{data}">
        <div
          v-if="data.ergonomicsPercentageModifier != null && data.ergonomicsPercentageModifier !== 0"
          class="build-list-column"
        >
          <span :class="StatsUtils.getValueColorClass(data.ergonomicsPercentageModifier)">
            {{ StatsUtils.getDisplayValue(data.ergonomicsPercentageModifier, true, true) }}
          </span>
          <font-awesome-icon
            icon="hand-paper"
            class="icon-after-text"
          />
        </div>
      </template>
    </Column>
    <Column
      field="price"
      :sortable="true"
      sortField="price.priceWithContentInMainCurrency.valueInMainCurrency"
    >
      <!-- For some reason, using "sort-field" doesn't work while using "sortField" works -->
      <template #header>
        <div class="build-list-column">
          {{ $t('caption.price') }}
        </div>
      </template>
      <template #body="{data}">
        <div class="build-list-column">
          <InventoryPrice
            :inventory-price="data.price"
            :show-space-for-icon="false"
          />
        </div>
      </template>
    </Column>
    <Column
      field="weight"
      :sortable="true"
    >
      <template #header>
        <div class="build-list-column">
          {{ $t('caption.weight') }}
        </div>
      </template>
      <template #body="{data}">
        <div
          v-if="data.weight > 0"
          class="build-list-column"
        >
          <span :class="StatsUtils.getWeightColorClass(data.weight)">{{ data.weight }}</span>
          <font-awesome-icon
            icon="weight-hanging"
            class="icon-after-text"
          />
        </div>
      </template>
    </Column>
  </DataTable>
</template>

<script lang="ts" src="./BuildsListComponent.ts" />
<style scoped lang="css" src="./BuildsListComponent.css" />