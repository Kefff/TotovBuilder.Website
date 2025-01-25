<script setup lang="ts">
import { CarouselResponsiveOptions } from 'primevue/carousel'
import { computed, inject, Ref, ref } from 'vue'
import { IInventorySlot } from '../models/build/IInventorySlot'
import { PathUtils } from '../utils/PathUtils'
import WebBrowserUtils from '../utils/WebBrowserUtils'
import InventorySlot from './InventorySlotComponent.vue'

const modelInventorySlots = defineModel<IInventorySlot[]>('inventorySlots', { required: true })

defineProps<{
  path: string
}>()

const inventorySlotsInternal = computed(() => {
  if (isEditing?.value) {
    return modelInventorySlots.value
  }

  const inventorySlots = modelInventorySlots.value.filter(is => is.items.some((i) => i != null))

  return inventorySlots
})

const isEditing = inject<Ref<boolean>>('isEditing')
const responsiveOptions = ref<CarouselResponsiveOptions[]>([
  {
    breakpoint: `${WebBrowserUtils.breakpoints.pcLarge}px`,
    numVisible: 1,
    numScroll: 1
  }
])

/**
 * Reacts to an inventory item being changed.
 *
 * Signals to the build one of its inventory slots has changed.
 */
function onInventorySlotChanged(index: number, updatedInventorySlot: IInventorySlot): void {
  const updatedInventorySlots = [...inventorySlotsInternal.value]
  updatedInventorySlots[index] = updatedInventorySlot
  modelInventorySlots.value = updatedInventorySlots
}
</script>










<template>
  <Carousel
    :value="inventorySlotsInternal"
    :num-visible="2"
    :num-scroll="1"
    :responsive-options="responsiveOptions"
  >
    <template #item="slotProps">
      <InventorySlot
        v-model:inventory-slot="slotProps.data"
        :path="`${path}/${PathUtils.inventorySlotPrefix}${slotProps.data.typeId}`"
        @update:inventory-slot="onInventorySlotChanged(slotProps.index, $event)"
      />
    </template>
  </Carousel>
</template>










<style scoped></style>