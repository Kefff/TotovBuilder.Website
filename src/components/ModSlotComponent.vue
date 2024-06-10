<template>
  <div
    v-if="editing || modelInventoryItem != null"
    class="mod-slot"
  >
    <div class="mod-slot-slot-name">
      {{ $t('caption.modSlot_' + (modSlot.name.startsWith('chamber') ? 'chamber' : modSlot.name)) }}
      <span
        v-if="modSlot.required"
        v-tooltip.top="$t('caption.requiredMod')"
        :class="modelInventoryItem != null ? 'mod-slot-required-ok' : 'mod-slot-required-nok'"
      > *</span>
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
import { Ref, inject, onMounted, onUnmounted, ref, watch } from 'vue'
import { IInventoryItem } from '../models/build/IInventoryItem'
import { IItem } from '../models/item/IItem'
import { IModSlot } from '../models/item/IModSlot'
import { GlobalFilterService } from '../services/GlobalFilterService'
import { ItemService } from '../services/ItemService'
import { ModSlotComponentService } from '../services/components/ModSlotComponentService'
import Services from '../services/repository/Services'
import { PathUtils } from '../utils/PathUtils'

const globalFilterService = Services.get(GlobalFilterService)
const modSlotComponentService = Services.get(ModSlotComponentService)

const modelInventoryItem = defineModel<IInventoryItem>('inventoryItem')

const props = defineProps<{
  modSlot: IModSlot,
  path: string
}>()

const editing = inject<Ref<boolean>>('editing')

const acceptedItems = ref<IItem[]>([])
const acceptedItemsCategoryId = ref<string | undefined>(undefined)

onMounted(() => {
  globalFilterService.emitter.on(GlobalFilterService.changeEvent, updateAcceptedItems)
  updateAcceptedItems()
})

onUnmounted(() => globalFilterService.emitter.off(GlobalFilterService.changeEvent, updateAcceptedItems))

watch(() => props.modSlot.name, () => updateAcceptedItems())

/**
 * Gets the category IDs and the accepted items to pass to the Item component.
 */
async function updateAcceptedItems() {
  acceptedItems.value = await Services.get(ItemService).getItems(props.modSlot.compatibleItemIds, true)
  acceptedItemsCategoryId.value = modSlotComponentService.getAcceptedItemsCategoryId(acceptedItems.value)
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