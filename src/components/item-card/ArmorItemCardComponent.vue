<script setup lang="ts">
import { computed } from 'vue'
import { IArmor } from '../../models/item/IArmor'
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
    includeModsAndContent?: boolean,
    isBaseItem?: boolean,
    item: IItem,
    wearableModifiersOverride?: IWearableModifiers
  }>(),
  {
    armorModifiersOverride: undefined,
    comparisonItem: undefined,
    filterAndSortingData: undefined,
    includeModsAndContent: false,
    isBaseItem: false,
    wearableModifiersOverride: undefined
  })

const armor = computed(() => props.item as IArmor)

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
      :armor="armor"
      :comparison-item="comparisonItem"
      :filter-and-sorting-data="filterAndSortingData"
      :wearable-modifiers-override="wearableModifiersOverride"
    />
  </div>
</template>










<style scoped>
.armor-item-card-bold {
  font-style: italic;
  font-weight: bolder;
}

.armor-item-card-durability {
  color: var(--error-color);
}
</style>