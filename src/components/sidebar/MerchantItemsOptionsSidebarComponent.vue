<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { IGlobalFilter } from '../../models/utils/IGlobalFilter'
import { GlobalFilterService } from '../../services/GlobalFilterService'
import { GlobalSidebarService } from '../../services/GlobalSidebarService'
import Services from '../../services/repository/Services'
import MerchantFilter from '../MerchantFilterComponent.vue'

defineProps<{ parameters: undefined }>()

const _globalFilterService = Services.get(GlobalFilterService)
const _globalSidebarService = Services.get(GlobalSidebarService)

const globalFilter = ref<IGlobalFilter>({
  excludeItemsWithoutMatchingPrice: true,
  excludePresetBaseItems: true,
  merchantFilters: []
})
const hasChanged = ref(false)

onMounted(() => {
  _globalSidebarService.registerOnCloseAction('MerchantItemsOptionsSidebar', save)
  globalFilter.value = _globalFilterService.get()
})

/**
 * Saves the global filter and closes the side bar.
 */
function save(): void {
  if (hasChanged.value) {
    _globalFilterService.save(globalFilter.value)
    hasChanged.value = false
  }
}
</script>










<template>
  <!-- Exclude items without matching prices -->
  <div
    class="sidebar-option"
    :class="{ 'sidebar-option-disabled': globalFilter.excludeItemsWithoutMatchingPrice }"
  >
    <div class="sidebar-option-icon">
      <Checkbox
        v-model="globalFilter.excludeItemsWithoutMatchingPrice"
        :binary="true"
        :false-value="true"
        :true-value="false"
        @update:model-value="() => hasChanged = true"
      />
    </div>
    <div
      style="cursor: pointer;"
      @click="() => {
        globalFilter.excludeItemsWithoutMatchingPrice = !globalFilter.excludeItemsWithoutMatchingPrice
        hasChanged = true
      }"
    >
      {{ $t('caption.showItemsWithoutMatchingPrice') }}
    </div>
  </div>
  <div class="sidebar-option-description">
    <div class="sidebar-option-icon">
      <font-awesome-icon icon="info-circle" />
    </div>
    <span>
      {{ $t('message.showItemsWithoutMatchingPriceExplanation') }}
    </span>
  </div>
  <!-- Exclude preset base item -->
  <div
    class="sidebar-option"
    :class="{ 'sidebar-option-disabled': globalFilter.excludePresetBaseItems }"
  >
    <div class="sidebar-option-icon">
      <Checkbox
        v-model="globalFilter.excludePresetBaseItems"
        :binary="true"
        :false-value="true"
        :true-value="false"
        @update:model-value="() => hasChanged = true"
      />
    </div>
    <div
      style="cursor: pointer;"
      @click="() => {
        globalFilter.excludePresetBaseItems = !globalFilter.excludePresetBaseItems
        hasChanged = true
      }"
    >
      {{ $t('caption.showPresetBaseItems') }}
    </div>
  </div>
  <!-- Merchants  -->
  <div class="sidebar-title">
    <div class="sidebar-title-icon">
      <font-awesome-icon icon="user-tag" />
    </div>
    <span>{{ $t('caption.merchants') }}</span>
  </div>
  <div class="sidebar-option">
    <MerchantFilter
      v-model:merchant-filters="globalFilter.merchantFilters"
      @update:merchant-filters="() => hasChanged = true"
    />
  </div>
</template>