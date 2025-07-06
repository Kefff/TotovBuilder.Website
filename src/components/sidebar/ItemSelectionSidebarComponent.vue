<script setup lang="ts">
import { ItemSelectionSidebarParameters } from '../../models/utils/IGlobalSidebarOptions'
import { GlobalSidebarService } from '../../services/GlobalSidebarService'
import Services from '../../services/repository/Services'
import ItemsList from '../ItemsListComponent.vue'

defineModel<ItemSelectionSidebarParameters>('parameters', { required: true })

const props = defineProps<{ identifier: number }>()

const _globalSidebarService = Services.get(GlobalSidebarService)

/**
 * Reacts to the selected items being changed.
 *
 * Updates the selected items and closes the sidebar.
 */
function onSelectedItemsChanged(): void {
  _globalSidebarService.close(props.identifier)
}
</script>










<template>
  <div class="items-selection-sidebar">
    <ItemsList
      v-model:filter-and-sorting-data="parameters.filterAndSortingData"
      v-model:selected-items="parameters.selectedItems"
      :build-items-with-path="parameters.buildItemsWithPath"
      :can-unselect="false"
      :get-items-function="parameters.getSelectableItemsFunction"
      :has-selection="true"
      :infinite-scrolling="true"
      :max-elements-per-line="1"
      :mono-selection="true"
      :path="parameters.path"
      :selection-options="{
        canUnselect: false,
        isEnabled: true,
        isMultiSelection: false,
        showStatsComparison: true
      }"
      @update:selected-items="onSelectedItemsChanged"
    />
  </div>
</template>










<style scoped>
.items-selection-sidebar {
  height: 100%;
  max-width: 40rem;
}
</style>