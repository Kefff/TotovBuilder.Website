<script setup lang="ts">
import { computed } from 'vue'
import { IItem } from '../../models/item/IItem'
import { IVest } from '../../models/item/IVest'
import { IArmorModifiers } from '../../models/utils/IArmorModifiers'
import ItemFilterAndSortingData from '../../models/utils/ItemFilterAndSortingData'
import { IWearableModifiers } from '../../models/utils/IWearableModifiers'
import WebBrowserUtils from '../../utils/WebBrowserUtils'
import ArmorItemCardInternal from './ArmorItemCardInternalComponent.vue'
import ContainerItemCardInternalComponent from './ContainerItemCardInternalComponent.vue'

const props = withDefaults(
  defineProps<{
    armorModifiersOverride?: IArmorModifiers,
    comparisonItem?: IItem,
    filterAndSortingData?: ItemFilterAndSortingData,
    includeModsAndContent?: boolean,
    item: IItem,
    wearableModifiersOverride?: IWearableModifiers
  }>(),
  {
    armorModifiersOverride: undefined,
    comparisonItem: undefined,
    filterAndSortingData: undefined,
    includeModsAndContent: false,
    wearableModifiersOverride: undefined
  })

const vest = computed(() => props.item as IVest)

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
    <ContainerItemCardInternalComponent
      :class="{ 'vest-item-card-bold': includeModsAndContent }"
      :comparison-item="comparisonItem"
      :container="vest"
      :filter-and-sorting-data="filterAndSortingData"
    />
    <ArmorItemCardInternal
      :armor-modifiers-override="armorModifiersOverride"
      :armor="vest"
      :comparison-item="comparisonItem"
      :filter-and-sorting-data="filterAndSortingData"
      :include-mods-and-content="includeModsAndContent"
      :wearable-modifiers-override="wearableModifiersOverride"
    />
  </div>
</template>










<style scoped>
.vest-item-card-bold {
  font-style: italic;
  font-weight: bolder;
}
</style>