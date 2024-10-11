<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { IGlobalFilter } from '../../models/utils/IGlobalFilter'
import { GlobalFilterService } from '../../services/GlobalFilterService'
import { GlobalSidebarService } from '../../services/GlobalSidebarService'
import Services from '../../services/repository/Services'
import ItemFilter from '../ItemFilterComponent.vue'
import MerchantFilter from '../MerchantFilterComponent.vue'

defineProps<{ parameters: undefined }>()

const _globalFilterService = Services.get(GlobalFilterService)
const _globalSidebarService = Services.get(GlobalSidebarService)

const globalFilter = ref<IGlobalFilter>({
  itemExclusionFilters: [],
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
function save() {
  if (hasChanged.value) {
    _globalFilterService.save(globalFilter.value)
    hasChanged.value = false
  }
}
</script>










<template>
  <div class="sidebar-option">
    <MerchantFilter
      v-model:merchant-filters="globalFilter.merchantFilters"
      @update:merchant-filters="() => hasChanged = true"
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
      v-model:item-exclusion-filters="globalFilter.itemExclusionFilters"
      @update:item-exclusion-filters="() => hasChanged = true"
    />
  </div>
</template>










<style scoped>
@import '../../css/sidebar.css';
</style>