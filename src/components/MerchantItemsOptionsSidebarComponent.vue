<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { IGlobalFilter } from '../models/utils/IGlobalFilter'
import { GlobalFilterService } from '../services/GlobalFilterService'
import { GlobalSidebarService } from '../services/GlobalSidebarService'
import Services from '../services/repository/Services'
import ItemFilter from './ItemFilterComponent.vue'
import MerchantFilter from './MerchantFilterComponent.vue'

const globalSidebarService = Services.get(GlobalSidebarService)
globalSidebarService.registerOnClosingAction(save)

const globalFilterService = Services.get(GlobalFilterService)

defineProps<{
  parameters: undefined
}>()

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
    globalFilterService.save(globalFilter.value)
    hasChanged.value = false
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
@import '../css/sidebar.css';
</style>