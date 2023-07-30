<template>
  <div>
    <div
      v-for="merchanFilter of merchantFilters"
      :key="merchanFilter.merchant"
      class="merchant-filter"
    >
      <Checkbox
        v-model="merchanFilter.enabled"
        v-tooltip.top="StringUtils.getCheckboxStateTooltip(merchanFilter.enabled)"
        :binary="true"
        @change="onFiltersChanged()"
      />
      <div
        :class="'merchant-filter-merchant' + (!merchanFilter.enabled ? ' merchant-filter-disabled-text' : '')"
        @click="toggleFilter(merchanFilter)"
      >
        {{ $t('caption.merchant_' + merchanFilter.merchant) }}
      </div>
      <img
        v-if="hasLevels(merchanFilter.merchant)"
        :src="'/assets/' + merchanFilter.merchant + '.webp'"
        :class="'merchant-filter-icon' + (!merchanFilter.enabled ? ' merchant-filter-icon-disabled' : '')"
        @click="toggleFilter(merchanFilter)"
      >
      <div
        v-tooltip.top="$t('caption.level')"
        class="merchant-filter-level"
      >
        <Dropdown
          v-if="hasLevels(merchanFilter.merchant)"
          v-model="merchanFilter.merchantLevel"
          :options="getMerchantLevels(merchanFilter.merchant)"
          :disabled="!merchanFilter.enabled"
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
  </div>
</template>

<script lang="ts" src="./MerchantFilterComponent.ts" />
<style scoped lang="css" src="./MerchantFilterComponent.css" />