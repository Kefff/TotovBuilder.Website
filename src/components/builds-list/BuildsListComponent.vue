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
      field="name"
      :sortable="true"
    >
      <template #header>
        <div class="build-list-column">
          {{ $t('caption.name') }}
        </div>
      </template>
      <template #body="{ data }">
        <div class="build-list-column">
          <div class="build-list-column-name-buttons">
            <span
              v-if="showNotExported && !data.exported"
              v-tooltip.right="getNotExportedTooltip(data)"
              class="build-list-not-exported"
            >
              <font-awesome-icon icon="exclamation-triangle" />
            </span>
            <ShoppingList :shopping-list="data.shoppingList" />
          </div>
          <div class="build-list-column-name">
            {{ data.name }}
          </div>
        </div>
      </template>
    </Column>
    <Column
      field="price"
      :sortable="true"
      sortField="price.priceInMainCurrency"
    >
      <!-- For some reason, using "sort-field" doesn't work while using "sortField" works -->
      <template #header>
        <div class="build-list-column">
          {{ $t('caption.price') }}
        </div>
      </template>
      <template #body="{ data }">
        <div class="build-list-column">
          <InventoryPrice :inventory-price="data.price" />
        </div>
      </template>
    </Column>
    <Column :sortable="false">
      <template #header>
        <div class="build-list-column build-list-column-merchants">
          {{ $t('caption.merchants') }}
        </div>
      </template>
      <template #body="{ data }">
        <div class="build-list-column build-list-column-merchants">
          <ShoppingListMerchants :shopping-list="data.shoppingList" />
        </div>
      </template>
    </Column>
    <Column
      field="verticalRecoil"
      :sortable="true"
      sortField="recoil.verticalRecoil"
    >
      <template #header>
        <div class="build-list-column">
          {{ $t('caption.verticalRecoil') }}
        </div>
      </template>
      <template #body="{ data }">
        <div
          v-if="data.recoil.verticalRecoil !== 0"
          class="build-list-column"
        >
          <span>{{ StatsUtils.getDisplayValue(data.recoil.verticalRecoil, false, 0) }}</span>
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
      sortField="recoil.horizontalRecoil"
    >
      <template #header>
        <div class="build-list-column">
          {{ $t('caption.horizontalRecoil') }}
        </div>
      </template>
      <template #body="{ data }">
        <div
          v-if="data.recoil.horizontalRecoil !== 0"
          class="build-list-column"
        >
          <span>{{ StatsUtils.getDisplayValue(data.recoil.horizontalRecoil, false, 0) }}</span>
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
      <template #body="{ data }">
        <div class="build-list-column">
          <div v-if="data.ergonomics !== 0">
            <span>{{ StatsUtils.getDisplayValue(data.ergonomics, false, 0) }}</span>
            <font-awesome-icon
              icon="hand-paper"
              class="icon-after-text"
            />
          </div>
        </div>
      </template>
    </Column>
    <Column
      field="armorModifiers.armorClass"
      :sortable="true"
    >
      <template #header>
        <div class="build-list-column">
          {{ $t('caption.armorClass') }}
        </div>
      </template>
      <template #body="{ data }">
        <div class="build-list-column">
          <div v-if="data.armorModifiers.armorClass !== 0">
            <span>{{ StatsUtils.getDisplayValue(data.armorModifiers.armorClass, false, 0) }}</span>
            <font-awesome-icon
              icon="award"
              class="icon-after-text"
            />
          </div>
        </div>
      </template>
    </Column>
    <Column
      field="wearableModifiers.ergonomicsPercentageModifier"
      :sortable="true"
    >
      <template #header>
        <div class="build-list-column">
          {{ $t('caption.ergonomicsPercentageModifier') }}
        </div>
      </template>
      <template #body="{ data }">
        <div
          v-if="data.wearableModifiers.ergonomicsPercentageModifier !== 0"
          class="build-list-column"
        >
          <span :class="StatsUtils.getValueColorClass(data.wearableModifiers.ergonomicsPercentageModifier)">
            {{ StatsUtils.getPercentageDisplayValue(data.wearableModifiers.ergonomicsPercentageModifier, true) }}
          </span>
          <font-awesome-icon
            icon="hand-paper"
            class="icon-after-text"
          />
        </div>
      </template>
    </Column>
    <Column
      field="wearableModifiers.movementSpeedPercentageModifier"
      :sortable="true"
    >
      <template #header>
        <div class="build-list-column">
          {{ $t('caption.movementSpeedPercentageModifier') }}
        </div>
      </template>
      <template #body="{ data }">
        <div
          v-if="data.wearableModifiers.movementSpeedPercentageModifier !== 0"
          class="build-list-column"
        >
          <span :class="StatsUtils.getValueColorClass(data.wearableModifiers.movementSpeedPercentageModifier)">
            {{ StatsUtils.getPercentageDisplayValue(data.wearableModifiers.movementSpeedPercentageModifier, true) }}
          </span>
          <font-awesome-icon
            icon="walking"
            class="icon-after-text"
          />
        </div>
      </template>
    </Column>
    <Column
      field="wearableModifiers.turningSpeedPercentageModifier"
      :sortable="true"
    >
      <template #header>
        <div class="build-list-column">
          {{ $t('caption.turningSpeedPercentageModifier') }}
        </div>
      </template>
      <template #body="{ data }">
        <div
          v-if="data.wearableModifiers.turningSpeedPercentageModifier !== 0"
          class="build-list-column"
        >
          <span :class="StatsUtils.getValueColorClass(data.wearableModifiers.turningSpeedPercentageModifier)">
            {{ StatsUtils.getPercentageDisplayValue(data.wearableModifiers.turningSpeedPercentageModifier, true) }}
          </span>
          <font-awesome-icon
            icon="undo"
            class="icon-after-text"
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
      <template #body="{ data }">
        <div
          v-if="data.weight > 0"
          class="build-list-column"
        >
          <span :class="StatsUtils.getWeightColorClass(data.weight)">{{ StatsUtils.getDisplayValue(data.weight, false, 3, 3) }}</span>
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