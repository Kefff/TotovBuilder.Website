<template>
  <div>
    <div
      v-for="merchantFilter of merchantFilters"
      :key="merchantFilter.merchant"
      class="merchant-filter"
    >
      <Checkbox
        v-model="merchantFilter.enabled"
        v-tooltip.top="StringUtils.getCheckboxStateTooltip(merchantFilter.enabled)"
        :binary="true"
        @change="onFiltersChanged()"
      />
      <div
        :class="'merchant-filter-merchant' + (!merchantFilter.enabled ? ' merchant-filter-disabled-text' : '')"
        @click="toggleFilter(merchantFilter)"
      >
        {{ $t('caption.merchant_' + merchantFilter.merchant) }}
      </div>
      <img
        :src="Images[StringUtils.toCamelCase(merchantFilter.merchant)]"
        :class="'merchant-filter-icon' + (!merchantFilter.enabled ? ' merchant-filter-icon-disabled' : '')"
        @click="toggleFilter(merchantFilter)"
      >
      <div v-tooltip.top="$t('caption.level')">
        <Dropdown
          v-if="hasLevels(merchantFilter.merchant)"
          v-model="merchantFilter.merchantLevel"
          :options="getMerchantLevels(merchantFilter.merchant)"
          :disabled="!merchantFilter.enabled"
          class="merchant-filter-level"
          :placeholder="$t('caption.level')"
          @change="onFiltersChanged()"
        >
          <template #option="slotProps">
            <div>
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