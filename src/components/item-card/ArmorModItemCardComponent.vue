<script setup lang="ts">
import { computed } from 'vue'
import { IArmorMod } from '../../models/item/IArmorMod'
import { IItem } from '../../models/item/IItem'
import { IArmorModifiers } from '../../models/utils/IArmorModifiers'
import ItemFilterAndSortingData from '../../models/utils/ItemFilterAndSortingData'
import { IWearableModifiers } from '../../models/utils/IWearableModifiers'
import ArmorItemCard from './ArmorItemCardComponent.vue'

const props = withDefaults(
  defineProps<{
    armorModifiersOverride?: IArmorModifiers,
    comparisonItem?: IItem,
    displayEmptyLines?: boolean,
    filterAndSortingData?: ItemFilterAndSortingData,
    item: IItem,
    wearableModifiersOverride?: IWearableModifiers
  }>(),
  {
    armorModifiersOverride: undefined,
    comparisonItem: undefined,
    displayEmptyLines: true,
    filterAndSortingData: undefined,
    wearableModifiersOverride: undefined
  })

const armorMod = computed(() => props.item as IArmorMod)
const armorModifiers = computed(() => props.armorModifiersOverride ?? armorMod.value.presetArmorModifiers)
const comparisonItemInternal = computed(() => props.comparisonItem as IArmorMod | undefined)
const wearableModifiers = computed(() => props.wearableModifiersOverride ?? armorMod.value.presetWearableModifiers)
</script>










<template>
  <ArmorItemCard
    :armor-modifiers-override="armorModifiers"
    :display-empty-lines="displayEmptyLines"
    :filter-and-sorting-data="filterAndSortingData"
    :item="armorMod"
    :wearable-modifiers-override="wearableModifiers"
  />
</template>