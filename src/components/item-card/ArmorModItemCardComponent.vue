<script setup lang="ts">
import { computed } from 'vue'
import { IArmorMod } from '../../models/item/IArmorMod'
import { IItem } from '../../models/item/IItem'
import { IArmorModifiers } from '../../models/utils/IArmorModifiers'
import ItemFilterAndSortingData from '../../models/utils/ItemFilterAndSortingData'
import { IWearableModifiers } from '../../models/utils/IWearableModifiers'
import WebBrowserUtils from '../../utils/WebBrowserUtils'
import ArmorItemCardInternal from './ArmorItemCardInternalComponent.vue'

const props = withDefaults(
  defineProps<{
    armorModifiersOverride?: IArmorModifiers,
    comparisonItem?: IItem,
    filterAndSortingData?: ItemFilterAndSortingData,
    item: IItem,
    wearableModifiersOverride?: IWearableModifiers
  }>(),
  {
    armorModifiersOverride: undefined,
    comparisonItem: undefined,
    filterAndSortingData: undefined,
    wearableModifiersOverride: undefined
  })

const armorMod = computed(() => props.item as IArmorMod)

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
    <ArmorItemCardInternal
      :armor-modifiers-override="armorModifiersOverride"
      :armor="armorMod"
      :comparison-item="comparisonItem"
      :filter-and-sorting-data="filterAndSortingData"
      :wearable-modifiers-override="wearableModifiersOverride"
    />
  </div>
</template>