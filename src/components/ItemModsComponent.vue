<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import { IInventoryItem } from '../models/build/IInventoryItem'
import { IInventoryModSlot } from '../models/build/IInventoryModSlot'
import { IModSlot } from '../models/item/IModSlot'
import { IModdable } from '../models/item/IModdable'
import { PathUtils } from '../utils/PathUtils'
import ModSlot from './ModSlotComponent.vue'

const modelInventoryModSlots = defineModel<IInventoryModSlot[]>('inventoryModSlots', { required: true })

const props = defineProps<{
  moddableItem: IModdable,
  path: string
}>()

const isInitializing = ref(true)
const modSlots = ref<IModSlot[]>(props.moddableItem.modSlots)

onMounted(() => initialize())

watch(() => props.moddableItem.id, () => initialize())

/**
 * Gets the mod slots of the parent item and adds them to the list of inventory mod slots received.
 */
function initialize() {
  isInitializing.value = true

  modSlots.value = props.moddableItem.modSlots

  if (props.moddableItem.categoryId === 'notFound') {
    // When an item in a build is not found, we assume it is moddable in order to be able
    // to display its possible mods.
    // We create a fake list of mod slots for it.
    for (const inventoryModSlot of modelInventoryModSlots.value) {
      modSlots.value.push({
        compatibleItemIds: [inventoryModSlot.item?.itemId ?? ''],
        maxStackableAmount: 1,
        name: inventoryModSlot.modSlotName,
        required: false
      })
    }
  }

  isInitializing.value = false
}

/**
 * Find the inventory item corresponding to a mod slot if it exists in the inventory mod slot list.
 */
function findInventoryItemOfModSlot(modSlotName: string): IInventoryItem | undefined {
  return modelInventoryModSlots.value.find(ims => ims.modSlotName === modSlotName)?.item
}

/**
 * Reacts to an inventory item being changed.
 *
 * Signals to the parent item a mod slot item has changed.
 */
function onItemChanged(modSlotName: string, newInventoryItem: IInventoryItem | undefined) {
  const newInventoryModSlots = [...modelInventoryModSlots.value]
  const newInventoryModSlot = newInventoryModSlots.find(ms => ms.modSlotName === modSlotName)

  if (newInventoryModSlot != null) {
    newInventoryModSlot.item = newInventoryItem
  } else {
    newInventoryModSlots.push({
      modSlotName,
      item: newInventoryItem
    })
  }

  modelInventoryModSlots.value = newInventoryModSlots
}
</script>










<template>
  <div v-if="!isInitializing">
    <ModSlot
      v-for="modSlot of modSlots"
      :key="`${path}/${PathUtils.modSlotPrefix}${modSlot.name}`"
      :inventory-item="findInventoryItemOfModSlot(modSlot.name)"
      :mod-slot="modSlot"
      :path="`${path}/${PathUtils.modSlotPrefix}${modSlot.name}`"
      @update:inventory-item="onItemChanged(modSlot.name, $event)"
    />
  </div>
</template>