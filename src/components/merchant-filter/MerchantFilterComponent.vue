<template>
  <div>
    <div
      v-for="filter of filters"
      :key="filter.merchant"
      class="merchant-filter"
    >
      <Checkbox
        v-model="filter.enabled"
        v-tooltip.top="getCheckboxTooltip(filter.enabled)"
        :binary="true"
        @change="onFiltersChanged()"
      />
      <div
        :class="'merchant-filter-merchant' + (!filter.enabled ? ' merchant-filter-disabled-text' : '')"
        @click="toggleFilter(filter)"
      >
        {{ $t('caption.merchant_' + filter.merchant) }}
      </div>
      <img
        v-if="hasLevels(filter.merchant)"
        :src="'/assets/' + filter.merchant + '.webp'"
        :class="'merchant-filter-icon' + (!filter.enabled ? ' merchant-filter-icon-disabled' : '')"
        @click="toggleFilter(filter)"
      >
      <div
        v-tooltip.top="$t('caption.level')"
        class="merchant-filter-level"
      >
        <Dropdown
          v-if="hasLevels(filter.merchant)"
          v-model="filter.merchantLevel"
          :options="getMerchantLevels(filter.merchant)"
          :disabled="!filter.enabled"
          class="merchant-filter-level"
          :placeholder="$t('caption.level')"
          @change="onFiltersChanged()"
        >
          <template #option="slotProps">
            <div class="merchant-filter-level-option">
              {{ slotProps.option }}
            </div>
          </template>
        </Dropdown>
      </div>
    </div>
    <div class="merchant-filter-save-button">
      <Button
        v-if="showSaveButton"
        class="p-button-success"
        :disabled="!hasChanged"
        @click="save()"
      >
        <font-awesome-icon
          icon="save"
          class="icon-before-text"
        />
        <span>{{ $t('caption.save') }}</span>
      </Button>
    </div>
  </div>
</template>

<script lang="ts" src="./MerchantFilterComponent.ts" />
<style scoped lang="css" src="./MerchantFilterComponent.css" />