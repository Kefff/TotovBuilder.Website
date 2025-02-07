<script setup lang="ts">
import { useElementSize } from '@vueuse/core'
import { round } from 'round-ts'
import { computed, onMounted, ref, useTemplateRef } from 'vue'
import { InventorySlotSelectorSidebarParameters } from '../../models/utils/IGlobalSidebarOptions'
import { GlobalSidebarService } from '../../services/GlobalSidebarService'
import Services from '../../services/repository/Services'
import InventorySlotSelector from '../InventorySlotSelectorComponent.vue'

const modelParameters = defineModel<InventorySlotSelectorSidebarParameters>('parameters', { required: true })

const _globalSidebarService = Services.get(GlobalSidebarService)

const height = computed(() => `${round(selectorHeight.value * scale.value) + 2}px`) // +2 otherwise the bottom border is not visible
const scale = computed(() => round(sidebarWidth.value / selectorWidth.value, 2) - 0.01) // -0.01 otherwise the right border is not visible
const transform = computed(() => `scale(${scale.value})`)

const selectorElement = ref<HTMLDivElement | null | undefined>()
const { height: selectorHeight, width: selectorWidth } = useElementSize(selectorElement)
const sidebarElement = useTemplateRef('inventorySlotSelectorSidebar')
const { width: sidebarWidth } = useElementSize(sidebarElement)

onMounted(() => {
  selectorElement.value = sidebarElement.value?.querySelector('.inventory-slots-selector-image-container')
})

/**
 * Reacts to the selected inventory slot being changed.
 *
 * Updates the selected inventory slot and closes the sidebar.
 */
function onSelectedInventorySlotChanged(): void {
  _globalSidebarService.close('InventorySlotSelectorSidebar')
}

</script>










<template>
  <div
    ref="inventorySlotSelectorSidebar"
    class="inventory-slot-selector-sidebar"
  >
    <InventorySlotSelector
      v-model:current-inventory-slot-type="modelParameters"
      class="inventory-slot-selector-sidebar-selector"
      @update:current-inventory-slot-type="onSelectedInventorySlotChanged"
    />
  </div>
</template>










<style>
.inventory-slot-selector-sidebar {
  overflow: hidden;
  height: v-bind(height);
}

.inventory-slot-selector-sidebar-selector {
  transform: v-bind(transform);
  transform-origin: top left;
  width: 100%;
}
</style>