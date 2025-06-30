<script setup lang="ts">
import { Ref, computed, inject, onMounted, onUnmounted, ref } from 'vue'
import { IInventoryItem } from '../models/build/IInventoryItem'
import { IItem } from '../models/item/IItem'
import { IModSlot } from '../models/item/IModSlot'
import { ItemSelectionRestrictionList } from '../models/utils/ItemSelectionRestrictionList'
import vueI18n from '../plugins/vueI18n'
import { GlobalFilterService } from '../services/GlobalFilterService'
import { ItemService } from '../services/ItemService'
import Services from '../services/repository/Services'
import { PathUtils } from '../utils/PathUtils'
import Item from './ItemComponent.vue'
import Tooltip from './TooltipComponent.vue'

const modelInventoryItem = defineModel<IInventoryItem>('inventoryItem')
const modelItemSelectionRestrictions = defineModel<ItemSelectionRestrictionList>('itemSelectionRestrictions')

const props = defineProps<{
  modSlot: IModSlot,
  path: string
}>()

const _globalFilterService = Services.get(GlobalFilterService)
const _itemService = Services.get(ItemService)

let _acceptedItemsNeedsUpdated = true

const acceptedItems = ref<IItem[]>([])
const isEditing = inject<Ref<boolean>>('isEditing')

const modSlotName = computed(() => vueI18n.t(`caption.modSlot_${props.modSlot.name.startsWith('chamber') ? 'chamber' : props.modSlot.name}`))

onMounted(() => _globalFilterService.emitter.on(GlobalFilterService.changeEvent, onMerchantFilterChanged))

onUnmounted(() => _globalFilterService.emitter.off(GlobalFilterService.changeEvent, onMerchantFilterChanged))

/**
 * Gets the items the user can select in the mod slot.
 */
async function getAcceptedItemsAsync(): Promise<IItem[]> {
  if (_acceptedItemsNeedsUpdated) {
    acceptedItems.value = await _itemService.getItemsAsync(props.modSlot.compatibleItemIds, true)
    _acceptedItemsNeedsUpdated = false
  }

  return acceptedItems.value
}

/**
 * Reacts to the merchant filter changing.
 *
 * Indicates the accepted items list needs to be updated.
 */
function onMerchantFilterChanged(): void {
  _acceptedItemsNeedsUpdated = true
}
</script>










<template>
  <div
    v-if="isEditing || modelInventoryItem != null"
    class="mod-slot"
  >
    <div class="mod-slot-header">
      <span class="mod-slot-name">
        {{ modSlotName }}
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
      v-model:item-selection-restrictions="modelItemSelectionRestrictions"
      :get-accepted-items-function="getAcceptedItemsAsync"
      :max-stackable-amount="modSlot.maxStackableAmount"
      :path="`${path}/${PathUtils.itemPrefix}${modelInventoryItem?.itemId ?? 'empty'}`"
    />
  </div>
</template>










<style scoped>
.mod-slot {
  margin-top: 1.5rem;
  width: 100%;
}

.mod-slot-header {
  align-items: center;
  display: flex;
  gap: 0.25rem;
  margin-bottom: 0.25rem;
}

.mod-slot-name {
  font-weight: bolder;
}

.mod-slot-required-ok {
  color: var(--success-color);
}

.mod-slot-required-nok {
  color: var(--error-color);
}
</style>