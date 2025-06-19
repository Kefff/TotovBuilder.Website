<script setup lang="ts">
import { computed } from 'vue'
import Images from '../../images'
import { IHeadwear } from '../../models/item/IHeadwear'
import { IItem } from '../../models/item/IItem'
import { IArmorModifiers } from '../../models/utils/IArmorModifiers'
import ItemFilterAndSortingData from '../../models/utils/ItemFilterAndSortingData'
import { IWearableModifiers } from '../../models/utils/IWearableModifiers'
import StatsUtils from '../../utils/StatsUtils'
import WebBrowserUtils from '../../utils/WebBrowserUtils'
import CustomIcon from '../CustomIconComponent.vue'
import Tooltip from '../TooltipComponent.vue'
import ArmorItemCardInternal from './ArmorItemCardInternalComponent.vue'

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

const hasRicochetChance = computed(() => headwear.value.ricochetChance !== '')
const headwear = computed(() => props.item as IHeadwear)

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
      :armor="headwear"
      :comparison-item="comparisonItem"
      :filter-and-sorting-data="filterAndSortingData"
      :include-mods-and-content="includeModsAndContent"
      :wearable-modifiers-override="wearableModifiersOverride"
    />
    <Tooltip
      v-if="hasRicochetChance"
      :tooltip="$t('caption.ricochetChance')"
      :class="[
        includeModsAndContent ? 'headwear-item-card-bold' : undefined,
        StatsUtils.getSortedPropertyColorClass('ricochetChance', filterAndSortingData)
      ]"
    >
      <CustomIcon
        :icon="Images.ricochet"
        position="before"
      >
        <span>{{ $t('caption.ricochetChance' + headwear.ricochetChance) }}</span>
      </CustomIcon>
    </Tooltip>
  </div>
</template>










<style scoped>
.headwear-item-card-bold {
  font-style: italic;
  font-weight: bolder;
}
</style>