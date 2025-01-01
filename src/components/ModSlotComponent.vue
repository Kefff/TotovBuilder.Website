<script setup lang="ts">
import { Ref, computed, inject, onMounted, onUnmounted, ref } from 'vue'
import { IInventoryItem } from '../models/build/IInventoryItem'
import { IItem, ItemCategoryId } from '../models/item/IItem'
import { IModSlot } from '../models/item/IModSlot'
import vueI18n from '../plugins/vueI18n'
import { GlobalFilterService } from '../services/GlobalFilterService'
import { ItemService } from '../services/ItemService'
import Services from '../services/repository/Services'
import { PathUtils } from '../utils/PathUtils'
import Item from './ItemComponent.vue'
import Tooltip from './TooltipComponent.vue'

const modelInventoryItem = defineModel<IInventoryItem>('inventoryItem')

const props = defineProps<{
  modSlot: IModSlot,
  path: string
}>()

const _globalFilterService = Services.get(GlobalFilterService)
const _itemService = Services.get(ItemService)

let _acceptedItemsNeedsUpdated = true

const acceptedItems = ref<IItem[]>([])
const acceptedItemsCategoryId = ref<ItemCategoryId | undefined>(undefined)
const isEditing = inject<Ref<boolean>>('isEditing')

const modSlotName = computed(() => vueI18n.t(`caption.modSlot_${props.modSlot.name.startsWith('chamber') ? 'chamber' : props.modSlot.name}`))

onMounted(() => _globalFilterService.emitter.on(GlobalFilterService.changeEvent, onMerchantFilterChanged))

onUnmounted(() => _globalFilterService.emitter.off(GlobalFilterService.changeEvent, onMerchantFilterChanged))

/**
 * Gets the items the user can select in the mod slot.
 * @param forceItemsListUpdate - Indicates whether the cached list of accepted items must be updated.
 * `getAcceptedItemsAsync` is designed to be executed by the `ItemsListComponent`, notably, when the
 * merchants filter changes and the component is displayed.
 * In theory, the merchant filter change event should update `_acceptedItemsNeedsUpdated` and it
 * should be sufficient to indicate that le cached list must be updated.
 * But since we cannot know whether `_acceptedItemsNeedsUpdated` has been updated by the event
 * before `getAcceptedItemsAsync` is called, we need to make sure `getAcceptedItemsAsync`
 * will update the cached item list thanks to this parameter.
 */
async function getAcceptedItemsAsync(forceItemsListUpdate: boolean): Promise<IItem[]> {
  if (_acceptedItemsNeedsUpdated || forceItemsListUpdate) {
    acceptedItems.value = await _itemService.getItemsAsync(props.modSlot.compatibleItemIds, true)
    // TODO : VOIR COMMENT GERER LE acceptedItemsCategoryId QUI PERMET DE METTRE EN LECTURE SEULE LA CATEGORIE DANS LES FILTRES DES MODSSLOTS
    //acceptedItemsCategoryId.value = _modSlotComponentService.getAcceptedItemsCategoryId(acceptedItems.value)
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
      :accepted-items-category-id="acceptedItemsCategoryId"
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
  font-weight: bold;
}

.mod-slot-required-ok {
  color: var(--success-color);
}

.mod-slot-required-nok {
  color: var(--error-color);
}
</style>