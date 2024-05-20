<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { IInventoryModSlot } from '../models/build/IInventoryModSlot'
import { IModSlot } from '../models/item/IModSlot'
import { IModdable } from '../models/item/IModdable'
import { PathUtils } from '../utils/PathUtils'
import ModSlot from './mod-slot/ModSlotComponent.vue'

const props = defineProps<{
  moddableItem: IModdable,
  inventoryModSlots: IInventoryModSlot[],
  path: string
}>()

const emit = defineEmits<{
  (e: 'update:inventoryModSlots', value: IInventoryModSlot[]): void
}>()

const inventoryModSlotsInternal = computed({
  get: () => props.inventoryModSlots,
  set: (value: IInventoryModSlot[]) => emit('update:inventoryModSlots', value)
})

const isInitializing = ref(true)
const moddableItemInternal = ref<IModdable>(props.moddableItem)

watch(() => props.moddableItem.id, () => initialize())

onMounted(() => initialize())

/**
 * Gets the mod slots of the parent item and adds them to the list of inventory mod slots received.
 */
function initialize() {
  isInitializing.value = true

  if (props.moddableItem.categoryId === 'notFound') {
    // When an item in a build contains is not found, we assume it is moddable in order to be able
    // to display its possible mods.
    // We create a fake list of mod slots for it.
    const modSlots: IModSlot[] = []

    for (const inventoryModSlot of props.inventoryModSlots) {
      modSlots.push({
        compatibleItemIds: [inventoryModSlot.item?.itemId ?? ''],
        maxStackableAmount: 1,
        name: inventoryModSlot.modSlotName,
        required: false
      })
    }

    moddableItemInternal.value.modSlots = modSlots
  }

  isInitializing.value = false
}
</script>












<template>
  <div v-if="!isInitializing">
    <div
      v-for="(inventoryModSlot, index) of inventoryModSlotsInternal"
      :key="path + '/' + PathUtils.modSlotPrefix + inventoryModSlot.modSlotName"
    >
      <ModSlot
        v-model:inventory-mod-slot="inventoryModSlotsInternal[index]"
        :mod-slot="moddableItemInternal.modSlots[index]"
        :path="path + '/' + PathUtils.modSlotPrefix + inventoryModSlot.modSlotName"
      />
    </div>
  </div>
</template>