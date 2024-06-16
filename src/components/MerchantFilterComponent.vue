<template>
  <div>
    <div
      v-for="(merchantFilter, index) of merchantFiltersInternal"
      :key="merchantFilter.merchant"
      class="merchant-filter"
    >
      <Checkbox
        :binary="true"
        :model-value="merchantFilter.enabled"
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
      <Tooltip
        :apply-hover-style="false"
        :tooltip="$t('caption.level')"
      >
        <Dropdown
          v-if="hasLevels(merchantFilter.merchant)"
          :disabled="!merchantFilter.enabled"
          :model-value="merchantFilter.merchantLevel"
          :options="getMerchantLevels(merchantFilter.merchant)"
          :placeholder="$t('caption.level')"
          @update:model-value="onMerchantFilterChanged(index, merchantFilter.enabled, $event)"
        >
          <template #option="slotProps">
            <div class="merchant-filter-level-option">
              {{ slotProps.option }}
            </div>
          </template>
        </Dropdown>
      </Tooltip>
    </div>
  </div>
</template>










<script setup lang="ts">
import { computed } from 'vue'
import Images from '../images'
import { IMerchantFilter } from '../models/utils/IMerchantFilter'
import { GlobalFilterService } from '../services/GlobalFilterService'
import Services from '../services/repository/Services'
import StringUtils from '../utils/StringUtils'

const globalFilterService = Services.get(GlobalFilterService)

const modelMerchantFilters = defineModel<IMerchantFilter[]>('merchantFilters', { required: true })

const merchantFiltersInternal = computed(() => [...modelMerchantFilters.value].sort((m1, m2) => StringUtils.compare(m1.merchant, m2.merchant)))

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
  const newMerchantFilters: IMerchantFilter[] = [...merchantFiltersInternal.value]
  newMerchantFilters[index].enabled = enabled
  newMerchantFilters[index].merchantLevel = merchantLevel

  modelMerchantFilters.value = newMerchantFilters
}
</script>










<style scoped>
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