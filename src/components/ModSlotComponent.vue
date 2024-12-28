<script setup lang="ts">
import { useBreakpoints } from '@vueuse/core'
import { Ref, computed, inject, onMounted, onUnmounted, ref, watch } from 'vue'
import { IInventoryItem } from '../models/build/IInventoryItem'
import { IItem, ItemCategoryId } from '../models/item/IItem'
import { IModSlot } from '../models/item/IModSlot'
import vueI18n from '../plugins/vueI18n'
import { GlobalFilterService } from '../services/GlobalFilterService'
import { ItemService } from '../services/ItemService'
import { ModSlotComponentService } from '../services/components/ModSlotComponentService'
import Services from '../services/repository/Services'
import { PathUtils } from '../utils/PathUtils'
import WebBrowserUtils from '../utils/WebBrowserUtils'
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
const breadcrumb = ref<string>()
const breadcrumbTooltip = ref<string>()
const breakpoints = useBreakpoints(WebBrowserUtils.breakpoints)
const isEditing = inject<Ref<boolean>>('isEditing')

const isCompactMode = breakpoints.smaller('tabletLandscape')
const modSlotName = computed(() => vueI18n.t(`caption.modSlot_${props.modSlot.name.startsWith('chamber') ? 'chamber' : props.modSlot.name}`))

onMounted(() => {
  _globalFilterService.emitter.on(GlobalFilterService.changeEvent, onMerchantFilterChanged)

  setAcceptedItemsAsync()
  getModSlotBreadcrumb()
})

onUnmounted(() => _globalFilterService.emitter.off(GlobalFilterService.changeEvent, onMerchantFilterChanged))

watch(() => props.path, () => getModSlotBreadcrumb())

/**
 * Gets the breadcrum to display in front of the name of the mod slot.
 */
function getModSlotBreadcrumb(): void {
  let modSlotNames = PathUtils.getPathModSlotNames(props.path)
  modSlotNames = modSlotNames.map(msn => vueI18n.t(`caption.modSlot_${msn.startsWith('chamber') ? 'chamber' : msn}`))
  breadcrumbTooltip.value = modSlotNames.join(' - ')

  if (modSlotNames.length > 0) {
    modSlotNames.pop()
  }

  if (modSlotNames.length === 0) {
    breadcrumb.value = undefined

    return
  }

  let bc = ''

  if (isCompactMode.value && modSlotNames.length > 2) {
    modSlotNames = modSlotNames.slice(-2)
    bc += '. . . '
  }

  bc += modSlotNames.join(' - ')
  breadcrumb.value = `${bc} - `
}

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
    :class="{ 'mod-slot-compact': isCompactMode }"
  >
    <div class="mod-slot-header">
      <Tooltip :tooltip="breadcrumbTooltip">
        <span class="mod-slot-breadcrumb">
          {{ breadcrumb }}
        </span>
        <span class="mod-slot-name">
          {{ modSlotName }}
        </span>
      </Tooltip>
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
  margin-top: 1rem;
  width: 100%;
}

.mod-slot-breadcrumb {
  font-size: 0.875rem;
  font-style: italic;
}

.mod-slot-compact {
  border-top-color: var(--surface-500);
  border-top-style: solid;
  border-top-width: 1px;
  margin-top: 0.5rem;
  padding-top: 0.5rem;
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