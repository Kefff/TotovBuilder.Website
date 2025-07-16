<script setup lang="ts">
import { computed } from 'vue'
import { IBackpack } from '../../models/item/IBackpack'
import { IItem } from '../../models/item/IItem'
import ItemFilterAndSortingData from '../../models/utils/ItemFilterAndSortingData'
import { IWearableModifiers } from '../../models/utils/IWearableModifiers'
import WebBrowserUtils from '../../utils/WebBrowserUtils'
import ContainerItemCardInternal from './ContainerItemCardInternalComponent.vue'
import WearableItemCardInternal from './WearableItemCardInternalComponent.vue'

const props = withDefaults(
  defineProps<{
    comparisonItem?: IItem,
    filterAndSortingData?: ItemFilterAndSortingData,
    item: IItem,
    wearableModifiersOverride?: IWearableModifiers
  }>(),
  {
    comparisonItem: undefined,
    filterAndSortingData: undefined,
    wearableModifiersOverride: undefined
  })

const backpack = computed(() => props.item as IBackpack)

const { isSmartphonePortrait } = WebBrowserUtils.getScreenSize()
</script>










<template>
  <div
    class="card-line"
    :class="{
      'card-line3': isSmartphonePortrait,
      'card-line4': !isSmartphonePortrait
    }"
  >
    <ContainerItemCardInternal
      :comparison-item="comparisonItem"
      :container="backpack"
      :filter-and-sorting-data="filterAndSortingData"
    />
    <WearableItemCardInternal
      :comparison-item="comparisonItem"
      :filter-and-sorting-data="filterAndSortingData"
      :wearable="backpack"
      :wearable-modifiers-override="wearableModifiersOverride"
    />
  </div>
</template>