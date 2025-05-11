<script setup lang="ts">
import { computed } from 'vue'
import { IItem } from '../../models/item/IItem'
import { IVest } from '../../models/item/IVest'
import { IArmorModifiers } from '../../models/utils/IArmorModifiers'
import ItemFilterAndSortingData from '../../models/utils/ItemFilterAndSortingData'
import { IWearableModifiers } from '../../models/utils/IWearableModifiers'
import ArmorItemCard from './ArmorItemCardComponent.vue'
import ContainerItemCard from './ContainerItemCardComponent.vue'

const props = withDefaults(
  defineProps<{
    armorModifiersOverride?: IArmorModifiers,
    displayEmptyLines?: boolean,
    filterAndSortingData?: ItemFilterAndSortingData,
    includeModsAndContent?: boolean,
    isBaseItem?: boolean,
    item: IItem,
    wearableModifiersOverride?: IWearableModifiers
  }>(),
  {
    armorModifiersOverride: undefined,
    displayEmptyLines: true,
    filterAndSortingData: undefined,
    includeModsAndContent: false,
    isBaseItem: false,
    wearableModifiersOverride: undefined
  })

const armorModifiers = computed(() => props.armorModifiersOverride ?? vest.value.presetArmorModifiers)
const vest = computed(() => props.item as IVest)
const wearableModifiers = computed(() => props.wearableModifiersOverride ?? vest.value.presetWearableModifiers)
</script>










<template>
  <ArmorItemCard
    :armor-modifiers-override="armorModifiers"
    :display-empty-lines="displayEmptyLines"
    :filter-and-sorting-data="filterAndSortingData"
    :include-mods-and-content="includeModsAndContent"
    :item="vest"
    :wearable-modifiers-override="wearableModifiers"
  >
    <template
      v-if="!isBaseItem"
      #slot
    >
      <ContainerItemCard
        :filter-and-sorting-data="filterAndSortingData"
        :item="vest"
        :class="{ 'vest-item-card-bold': includeModsAndContent }"
      />
    </template>
  </ArmorItemCard>
</template>










<style scoped>
.selected-item-item-card .vest-item-card-bold.card-line {
  font-style: italic;
  font-weight: bolder;
  gap: 0;
  /* Overrides the style of ContainerItemCard because it contains a .card-line that breaks gaps */
}
</style>