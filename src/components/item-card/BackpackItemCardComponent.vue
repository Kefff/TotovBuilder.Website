<script setup lang="ts">
import { computed } from 'vue'
import { IBackpack } from '../../models/item/IBackpack'
import { IItem } from '../../models/item/IItem'
import ItemFilterAndSortingData from '../../models/utils/ItemFilterAndSortingData'
import { IWearableModifiers } from '../../models/utils/IWearableModifiers'
import ContainerItemCard from './ContainerItemCardComponent.vue'
import WearableItemCard from './WearableItemCardComponent.vue'

const props = withDefaults(
  defineProps<{
    comparisonItem?: IItem,
    displayEmptyLines?: boolean,
    filterAndSortingData?: ItemFilterAndSortingData,
    item: IItem,
    wearableModifiersOverride?: IWearableModifiers
  }>(),
  {
    comparisonItem: undefined,
    displayEmptyLines: true,
    filterAndSortingData: undefined,
    wearableModifiersOverride: undefined
  })

const backpack = computed(() => props.item as IBackpack)
const comparisonItemInternal = computed(() => props.comparisonItem as IBackpack | undefined)
const wearableModifiers = computed(() => props.wearableModifiersOverride ?? backpack.value.presetWearableModifiers)
</script>










<template>
  <ContainerItemCard
    :filter-and-sorting-data="filterAndSortingData"
    :item="backpack"
  />
  <WearableItemCard
    :display-empty-lines="displayEmptyLines"
    :filter-and-sorting-data="filterAndSortingData"
    :item="backpack"
    :wearable-modifiers-override="wearableModifiers"
  />
</template>