<script setup lang="ts">
import { computed, inject, onMounted, Ref, ref, watch } from 'vue'
import { IInventoryItem } from '../models/build/IInventoryItem'
import { IInventoryModSlot } from '../models/build/IInventoryModSlot'
import { ItemCategoryId } from '../models/item/IItem'
import { IModSlot } from '../models/item/IModSlot'
import { IModdable } from '../models/item/IModdable'
import { ItemSelectionRestrictionList } from '../models/utils/ItemSelectionRestrictionList'
import { PathUtils } from '../utils/PathUtils'
import ItemHierarchyIndicator from './ItemHierarchyIndicatorComponent.vue'
import ModSlot from './ModSlotComponent.vue'

const modelInventoryModSlots = defineModel<IInventoryModSlot[]>('inventoryModSlots', { required: true })
const modelItemSelectionRestrictions = defineModel<ItemSelectionRestrictionList>('itemSelectionRestrictions')

const props = defineProps<{
  moddableItem: IModdable,
  path: string
}>()

const isEditing = inject<Ref<boolean>>('isEditing')
const isInitializing = ref(true)
const modSlots = ref<IModSlot[]>(props.moddableItem.modSlots)

const inventoryItems = computed(() => {
  const inventoryItems = []

  for (const modSlot of modSlots.value) {
    const inventoryItem = modelInventoryModSlots.value.find(ims => ims.modSlotName === modSlot.name)?.item
    inventoryItems.push(inventoryItem)
  }

  return inventoryItems
})
const lastModSlotWithItemIndex = computed(() => inventoryItems.value.findLastIndex(ii => ii != null))

onMounted(() => initialize())

watch(() => props.moddableItem.id, () => initialize())

/**
 * Gets the mod slots of the parent item and adds them to the list of inventory mod slots received.
 */
function initialize(): void {
  isInitializing.value = true

  modSlots.value = props.moddableItem.modSlots

  if (props.moddableItem.categoryId === ItemCategoryId.notFound) {
    // When an item in a build is not found, we assume it is moddable in order to be able
    // to display its possible mods.
    // We create a fake list of mod slots for it.
    modSlots.value = []

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
 * Reacts to an inventory item being changed.
 *
 * Signals to the parent item a mod slot item has changed.
 */
function onItemChanged(modSlotName: string, newInventoryItem: IInventoryItem | undefined): void {
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
  <div v-if="!isInitializing && (modSlots.length > 0 || isEditing)">
    <div
      v-for="(modSlot, index) of modSlots"
      :key="`${path}/${PathUtils.modSlotPrefix}${modSlot.name}`"
      class="item-mods-mod"
    >
      <ItemHierarchyIndicator
        :is-first="index === 0"
        :is-last="(isEditing ?? false) ? index === modSlots.length - 1 : index === lastModSlotWithItemIndex"
        :is-visible="inventoryItems[index] != null || (isEditing ?? false)"
        mode="mods"
      />
      <ModSlot
        v-model:item-selection-restrictions="modelItemSelectionRestrictions"
        :inventory-item="inventoryItems[index]"
        :mod-slot="modSlot"
        :path="`${path}/${PathUtils.modSlotPrefix}${modSlot.name}`"
        @update:inventory-item="onItemChanged(modSlot.name, $event)"
      />
    </div>
  </div>
</template>









<style scoped>
.item-mods-mod {
  display: flex;
}
</style>









<style>
.item-mods-mod:first-child > .mod-slot {
  margin-top: 0.5rem;
}
</style>