<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { IItem } from '../../models/item/IItem'
import { IModdable } from '../../models/item/IModdable'
import { ItemService } from '../../services/ItemService'
import Services from '../../services/repository/Services'
import ItemCardSelector from '../item-card/ItemCardSelectorComponent.vue'
import StatsItems from './StatsItemsComponent.vue'

const props = defineProps<{
  item: IItem
}>()

const _itemService = Services.get(ItemService)

const moddable = computed(() => props.item as IModdable)

const modSlotItems = ref<{ modSlotName: string, compatibleItems: IItem[] }[]>([])

onMounted(() => getCompatibleModsAsync())

/**
 * Gets the captions of the accepted ammunition.
 */
async function getCompatibleModsAsync(): Promise<void> {
  const msi: { modSlotName: string, compatibleItems: IItem[] }[] = []

  for (const modSlot of moddable.value.modSlots) {
    const compatibleItems = await _itemService.getItemsAsync(modSlot.compatibleItemIds, false)
    msi.push({
      compatibleItems,
      modSlotName: `modSlot_${modSlot.name}`
    })
  }

  modSlotItems.value = msi
}
</script>










<template>
  <StatsItems
    v-for="msi of modSlotItems"
    :key="msi.modSlotName"
    :caption="`${$t('caption.modSlot')} - ${$t('caption.' + msi.modSlotName)}`"
    :items="msi.compatibleItems"
  >
    <template #specializedStats="slotProps">
      <ItemCardSelector :item="slotProps.item" />
    </template>
  </StatsItems>
</template>