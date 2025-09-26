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

const modSlotItems = ref<{ caption: string | undefined, compatibleItems: IItem[], name: string }[]>([])

onMounted(() => getCompatibleModsAsync())

/**
 * Gets the compatible mods.
 */
async function getCompatibleModsAsync(): Promise<void> {
  const msi: { caption: string | undefined, compatibleItems: IItem[], name: string }[] = []

  for (const modSlot of moddable.value.modSlots) {
    const compatibleItems = await _itemService.getItemsAsync(modSlot.compatibleItemIds, false)
    msi.push({
      caption: modSlot.caption,
      compatibleItems,
      name: modSlot.name
    })
  }

  modSlotItems.value = msi
}
</script>










<template>
  <StatsItems
    v-for="msi of modSlotItems"
    :key="msi.name"
    :caption="`${$t('caption.modSlot')} - ${msi.caption ?? $t(`caption.modSlot_${msi.name}`)}`"
    :items="msi.compatibleItems"
  >
    <template #specializedStats="slotProps">
      <ItemCardSelector :item="slotProps.item" />
    </template>
  </StatsItems>
</template>