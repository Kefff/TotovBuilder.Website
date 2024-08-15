<template>
  <div
    v-if="isEditing || modelInventoryItem != null"
    class="mod-slot"
  >
    <div class="mod-slot-slot-name">
      {{ $t('caption.modSlot_' + (modSlot.name.startsWith('chamber') ? 'chamber' : modSlot.name)) }}
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










<script setup lang="ts">
import { Ref, inject, onMounted, onUnmounted, ref } from 'vue'
import { IInventoryItem } from '../models/build/IInventoryItem'
import { IItem } from '../models/item/IItem'
import { IModSlot } from '../models/item/IModSlot'
import { GlobalFilterService } from '../services/GlobalFilterService'
import { ItemService } from '../services/ItemService'
import { ModSlotComponentService } from '../services/components/ModSlotComponentService'
import Services from '../services/repository/Services'
import { PathUtils } from '../utils/PathUtils'

const modelInventoryItem = defineModel<IInventoryItem>('inventoryItem')

const _globalFilterService = Services.get(GlobalFilterService)
const _modSlotComponentService = Services.get(ModSlotComponentService)

const props = defineProps<{
  modSlot: IModSlot,
  path: string
}>()

const acceptedItems = ref<IItem[]>([])
const acceptedItemsCategoryId = ref<string | undefined>(undefined)
const isEditing = inject<Ref<boolean>>('isEditing')

onMounted(() => {
  _globalFilterService.emitter.on(GlobalFilterService.changeEvent, setAcceptedItems)

  setAcceptedItems()
})

onUnmounted(() => _globalFilterService.emitter.off(GlobalFilterService.changeEvent, setAcceptedItems))

/**
 * Gets the category IDs and the accepted items to pass to the Item component.
 */
async function setAcceptedItems() {
  acceptedItems.value = await Services.get(ItemService).getItems(props.modSlot.compatibleItemIds, true)
  acceptedItemsCategoryId.value = _modSlotComponentService.getAcceptedItemsCategoryId(acceptedItems.value)
}
</script>










<style scoped>
.mod-slot {
  margin-top: 0.25rem;
  margin-left: 3.125rem;
}

.mod-slot-required-ok {
  color: var(--success-color);
}

.mod-slot-required-nok {
  color: var(--error-color);
}

.mod-slot-slot-name {
  margin-bottom: 0.25rem;
}
</style>