<script setup lang="ts">
import { computed } from 'vue'
import Images from '../images'
import { IGlobalFilter } from '../models/utils/IGlobalFilter'
import { GlobalFilterService } from '../services/GlobalFilterService'
import Services from '../services/repository/Services'
import StringUtils from '../utils/StringUtils'

const globalFilterService = Services.get(GlobalFilterService)

const props = defineProps<{
  globalFilter: IGlobalFilter
}>()

const emit = defineEmits<{
  (e: 'update:globalFilter', value: IGlobalFilter): void
}>()

const merchantFilters = computed(() =>
  [...props.globalFilter.merchantFilters]
    .sort((m1, m2) => StringUtils.compare(m1.merchant, m2.merchant)))

/**
 * Gets the level options for a merchant.
 * @param merchantName - Merchant name.
 * @returns Level options.
 */
function getMerchantLevels(merchantName: string): number[] {
  const levels = globalFilterService.getMerchantLevels(merchantName)

  return levels
}

/**
 * Indicates whether a merchant has levels.
 * @param merchantName - Merchant name.
 * @returns true when the merchant has levels; otherwise false.
 */
function hasLevels(merchantName: string): boolean {
  const result = globalFilterService.hasLevels(merchantName)

  return result
}

/**
 * Updates the filter.
 */
function onMerchantFilterChanged(index: number, enabled: boolean, merchantLevel: number) {
  const newGlobalFilter: IGlobalFilter = {
    itemExclusionFilters: props.globalFilter.itemExclusionFilters,
    merchantFilters: merchantFilters.value
  }
  newGlobalFilter.merchantFilters[index].enabled = enabled
  newGlobalFilter.merchantFilters[index].merchantLevel = merchantLevel

  emit('update:globalFilter', newGlobalFilter)
}
</script>












<template>
  <div>
    <div
      v-for="(merchantFilter, index) of merchantFilters"
      :key="merchantFilter.merchant"
      class="merchant-filter"
    >
      <Checkbox
        v-tooltip.top="StringUtils.getCheckboxStateTooltip(merchantFilter.enabled)"
        :model-value="merchantFilter.enabled"
        :binary="true"
        @update:model-value="onMerchantFilterChanged(index, $event, merchantFilter.merchantLevel)"
      />
      <div
        :class="`merchant-filter-merchant${(!merchantFilter.enabled ? ' merchant-filter-disabled-text' : '')}`"
        @click="onMerchantFilterChanged(index, !merchantFilter.enabled, merchantFilter.merchantLevel)"
      >
        {{ $t('caption.merchant_' + merchantFilter.merchant) }}
      </div>
      <img
        :src="Images[StringUtils.toCamelCase(merchantFilter.merchant)]"
        :class="`merchant-filter-icon${!merchantFilter.enabled ? ' merchant-filter-icon-disabled' : ''}`"
        @click="onMerchantFilterChanged(index, !merchantFilter.enabled, merchantFilter.merchantLevel)"
      >
      <div v-tooltip.top="$t('caption.level')">
        <Dropdown
          v-if="hasLevels(merchantFilter.merchant)"
          :model-value="merchantFilter.merchantLevel"
          :options="getMerchantLevels(merchantFilter.merchant)"
          :disabled="!merchantFilter.enabled"
          :placeholder="$t('caption.level')"
          @update:model-value="onMerchantFilterChanged(index, merchantFilter.enabled, $event)"
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












<style scoped>
@import '../css/icon.css';

.merchant-filter {
  align-items: center;
  display: grid;
  gap: 0.5rem;
  grid-template-columns: 2rem 1fr 3rem 5rem;
  height: 3.5rem;
  margin-right: 1px;
  /* Needed otherwise there is a horizontal scroll bar for some reason*/
}

.merchant-filter:last-child {
  margin-bottom: 0;
}

.merchant-filter-disabled-text {
  color: var(--util-color5);
}

.merchant-filter-icon {
  border-color: var(--util-color);
  border-radius: 3px;
  border-radius: 3px;
  border-style: solid;
  border-width: 1px;
  cursor: pointer;
  width: 3rem;
}

.merchant-filter-icon-disabled {
  filter: grayscale(100%);
}

.merchant-filter-merchant {
  cursor: pointer;
}

.merchant-filter-level-option {
  padding: 1rem;
}
</style>