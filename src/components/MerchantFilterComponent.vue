<template>
  <div>
    <div
      v-for="(merchantFilter, index) of merchantFiltersInternal"
      :key="merchantFilter.merchant"
      class="merchant-filter"
    >
      <div
        class="sidebar-option-icon"
        :class="!merchantFilter.enabled ? 'sidebar-option-disabled' : ''"
      >
        <Checkbox
          :binary="true"
          :model-value="merchantFilter.enabled"
          @update:model-value="onMerchantFilterChanged(index, $event, merchantFilter.merchantLevel)"
        />
      </div>
      <div
        class="merchant-filter-merchant"
        :class="!merchantFilter.enabled ? 'sidebar-option-disabled' : ''"
        @click="onMerchantFilterChanged(index, !merchantFilter.enabled, merchantFilter.merchantLevel)"
      >
        {{ $t('caption.merchant_' + merchantFilter.merchant) }}
      </div>
      <img
        :src="Images[StringUtils.toCamelCase(merchantFilter.merchant)]"
        class="merchant-filter-icon"
        :class="!merchantFilter.enabled ? 'sidebar-option-disabled' : ''"
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
@import '../css/sidebar.css';

.merchant-filter {
  align-items: center;
  display: grid;
  gap: 0.5rem;
  grid-template-columns: 2rem 1fr 3rem 5.25rem;
  height: 3.5rem;
}

.merchant-filter:last-child {
  margin-bottom: 0;
}

.merchant-filter-icon {
  border-radius: 3px;
  cursor: pointer;
  width: 3rem;
}

.merchant-filter-merchant {
  cursor: pointer;
}

.merchant-filter-level-option {
  padding: 1rem;
}
</style>