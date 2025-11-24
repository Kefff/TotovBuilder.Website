<script setup lang="ts">
import Images from '../images'
import { IMerchantFilter } from '../models/utils/IMerchantFilter'
import { GlobalFilterService } from '../services/GlobalFilterService'
import Services from '../services/repository/Services'
import StringUtils from '../utils/StringUtils'
import InputNumberField from './InputNumberFieldComponent.vue'
import Tooltip from './TooltipComponent.vue'

const modelMerchantFilters = defineModel<IMerchantFilter[]>('merchantFilters', { required: true })

const _globalFilterService = Services.get(GlobalFilterService)

/**
 * Gets the level options for a merchant.
 * @param merchantName - Merchant name.
 * @returns Level options.
 */
// function getMerchantLevels(merchantName: string): number[] {
//   const levels = _globalFilterService.getMerchantLevels(merchantName)

//   return levels
// }
function getMerchantLevels(merchantName: string): { maxLevel: number, minLevel: number } {
  const levels = _globalFilterService.getMerchantLevels(merchantName)
  const minMaxLevels = { maxLevel: levels[levels.length - 1], minLevel: levels[0] }

  return minMaxLevels
}

/**
 * Indicates whether a merchant has levels.
 * @param merchantName - Merchant name.
 * @returns `true` when the merchant has levels; otherwise `false`.
 */
function hasLevels(merchantName: string): boolean {
  const result = _globalFilterService.hasLevels(merchantName)

  return result
}

/**
 * Reacts to the merchant filter being changed.
 *
 * Updates the filter.
 */
function onMerchantFilterChanged(index: number, enabled: boolean, merchantLevel?: number): void {
  const newMerchantFilters: IMerchantFilter[] = [...modelMerchantFilters.value]
  newMerchantFilters[index].enabled = enabled
  newMerchantFilters[index].merchantLevel = merchantLevel ?? 1

  modelMerchantFilters.value = newMerchantFilters
}
</script>










<template>
  <div>
    <div
      v-for="(merchantFilter, index) of modelMerchantFilters"
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
        :disabled-on-mobile="true"
      >
        <InputNumberField
          v-if="hasLevels(merchantFilter.merchant)"
          :max="getMerchantLevels(merchantFilter.merchant).maxLevel"
          :min="getMerchantLevels(merchantFilter.merchant).minLevel"
          :placeholder="$t('caption.level')"
          :read-only="!merchantFilter.enabled"
          :required="false"
          :value="merchantFilter.merchantLevel"
          caption-mode="placeholder"
          @update:value="onMerchantFilterChanged(index, merchantFilter.enabled, $event)"
        />
      </Tooltip>
    </div>
  </div>
</template>










<style scoped>
.merchant-filter {
  align-items: center;
  display: grid;
  gap: 0.5rem;
  grid-template-columns: 2rem minmax(0, 1fr) 3rem 8.5rem;
  min-height: 3.5rem;
}

.merchant-filter:last-child {
  margin-bottom: 0;
}

.merchant-filter-icon {
  border-radius: 6px;
  cursor: pointer;
  width: 3rem;
}

.merchant-filter-merchant {
  cursor: pointer;
  word-break: break-word;
}

.merchant-filter-level-value {
  align-items: center;
  display: flex;
  justify-content: center;
  height: 100%;
  width: 2rem;
}
</style>