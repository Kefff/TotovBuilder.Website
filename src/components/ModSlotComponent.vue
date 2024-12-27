<script setup lang="ts">
import { Ref, inject, onMounted, onUnmounted, ref } from 'vue'
import { IInventoryItem } from '../models/build/IInventoryItem'
import { IItem, ItemCategoryId } from '../models/item/IItem'
import { IModSlot } from '../models/item/IModSlot'
import { GlobalFilterService } from '../services/GlobalFilterService'
import { ItemService } from '../services/ItemService'
import { ModSlotComponentService } from '../services/components/ModSlotComponentService'
import Services from '../services/repository/Services'
import { PathUtils } from '../utils/PathUtils'
import Item from './ItemComponent.vue'
import Tooltip from './TooltipComponent.vue'

const modelInventoryItem = defineModel<IInventoryItem>('inventoryItem')

const _globalFilterService = Services.get(GlobalFilterService)
const _modSlotComponentService = Services.get(ModSlotComponentService)

const props = defineProps<{
  modSlot: IModSlot,
  path: string
}>()

const acceptedItems = ref<IItem[]>([])
const acceptedItemsCategoryId = ref<ItemCategoryId | undefined>(undefined)
const isEditing = inject<Ref<boolean>>('isEditing')

onMounted(() => {
  _globalFilterService.emitter.on(GlobalFilterService.changeEvent, onMerchantFilterChanged)

  setAcceptedItemsAsync()
})

onUnmounted(() => _globalFilterService.emitter.off(GlobalFilterService.changeEvent, onMerchantFilterChanged))

/**
 * Reacts to the merchant filter being changed.
 *
 * Updates the accepted items to reflect the change in merchant filters.
 */
function onMerchantFilterChanged(): void {
  setAcceptedItemsAsync()
}

/**
 * Gets the category IDs and the accepted items to pass to the Item component.
 */
async function setAcceptedItemsAsync(): Promise<void> {
  acceptedItems.value = await Services.get(ItemService).getItemsAsync(props.modSlot.compatibleItemIds, true)
  acceptedItemsCategoryId.value = _modSlotComponentService.getAcceptedItemsCategoryId(acceptedItems.value)
}
</script>










<template>
  <div
    v-if="isEditing || modelInventoryItem != null"
    class="mod-slot"
  >
    <div>
      <span class="mod-slot-name">
        {{ $t('caption.modSlot_' + (modSlot.name.startsWith('chamber') ? 'chamber' : modSlot.name)) }}
      </span>
      <Tooltip :tooltip="$t('caption.requiredMod')">
        <span
          v-if="modSlot.required"
          :class="modelInventoryItem != null ? 'mod-slot-required-ok' : 'mod-slot-required-nok'"
        >
          *
        </span>
      </Tooltip>
    </div>
    <Item
      v-model:inventory-item="modelInventoryItem"
      :accepted-items="acceptedItems"
      :accepted-items-category-id="acceptedItemsCategoryId"
      :path="`${path}/${PathUtils.itemPrefix}${modelInventoryItem?.itemId ?? 'empty'}`"
      :max-stackable-amount="modSlot.maxStackableAmount"
    />
  </div>
</template>










<style scoped>
.mod-slot {
  margin-top: 2rem;
}

.mod-slot-name {
  font-weight: bold;
}

.mod-slot-required-ok {
  color: var(--success-color);
}

.mod-slot-required-nok {
  color: var(--error-color);
}
</style>