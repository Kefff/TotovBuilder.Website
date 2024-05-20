<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { IGlobalFilter } from '../models/utils/IGlobalFilter'
import { GlobalFilterService } from '../services/GlobalFilterService'
import { GlobalSidebarService } from '../services/GlobalSidebarService'
import Services from '../services/repository/Services'
import ItemFilter from './item-filter/ItemFilterComponent.vue'
import MerchantFilter from './merchant-filter/MerchantFilterComponent.vue'


defineProps<{
  parameters: undefined
}>()

const globalSidebarService = Services.get(GlobalSidebarService)
globalSidebarService.registerOnClosingAction(save)

const globalFilterService = Services.get(GlobalFilterService)

const globalFilter = ref<IGlobalFilter>({
  itemExclusionFilters: [],
  merchantFilters: []
})
const hasChanged = ref(false)

onMounted(() => {
  globalFilter.value = globalFilterService.get()
})

/**
 * Saves the global filter and closes the side bar.
 */
function save() {
  if (hasChanged.value) {
    hasChanged.value = false
    globalFilterService.save(globalFilter.value)
  }
}
</script>












<template>
  <div class="sidebar-title">
    <div class="sidebar-title-icon">
      <font-awesome-icon icon="user-tag" />
    </div>
    <span>{{ $t('caption.merchants') }}</span>
  </div>
  <div class="sidebar-option">
    <MerchantFilter
      v-model:global-filter="globalFilter"
      @update:global-filter="() => hasChanged = true"
    />
  </div>
  <div class="sidebar-title">
    <div class="sidebar-title-icon">
      <font-awesome-icon icon="shopping-basket" />
    </div>
    <span>{{ $t('caption.items') }}</span>
  </div>
  <div class="sidebar-option">
    <ItemFilter
      v-model:global-filter="globalFilter"
      @update:global-filter="() => hasChanged = true"
    />
  </div>
</template>











<style scoped>
@import '../css/button.css';
@import '../css/icon.css';
@import '../css/sidebar.css';
</style>