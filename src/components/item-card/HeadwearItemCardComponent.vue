<script setup lang="ts">
import { computed } from 'vue'
import Images from '../../images'
import { IHeadwear } from '../../models/item/IHeadwear'
import { IItem } from '../../models/item/IItem'
import { IArmorModifiers } from '../../models/utils/IArmorModifiers'
import ItemFilterAndSortingData from '../../models/utils/ItemFilterAndSortingData'
import { IWearableModifiers } from '../../models/utils/IWearableModifiers'
import StatsUtils from '../../utils/StatsUtils'
import CustomIcon from '../CustomIconComponent.vue'
import Tooltip from '../TooltipComponent.vue'
import ArmorItemCard from './ArmorItemCardComponent.vue'

const props = withDefaults(
  defineProps<{
    armorModifiersOverride?: IArmorModifiers,
    comparisonItem?: IItem,
    displayEmptyLines?: boolean,
    filterAndSortingData?: ItemFilterAndSortingData,
    includeModsAndContent?: boolean,
    isBaseItem?: boolean,
    item: IItem,
    wearableModifiersOverride?: IWearableModifiers
  }>(),
  {
    armorModifiersOverride: undefined,
    comparisonItem: undefined,
    displayEmptyLines: true,
    filterAndSortingData: undefined,
    isBaseItem: false,
    includeModsAndContent: false,
    wearableModifiersOverride: undefined
  })

const armorModifiers = computed(() => props.armorModifiersOverride ?? headwear.value.presetArmorModifiers)
const comparisonItemInternal = computed(() => props.comparisonItem as IHeadwear | undefined)
const hasRicochetChance = computed(() => headwear.value.ricochetChance !== '')
const headwear = computed(() => props.item as IHeadwear)
const wearableModifiers = computed(() => props.wearableModifiersOverride ?? headwear.value.presetWearableModifiers)
</script>










<template>
  <ArmorItemCard
    :armor-modifiers-override="armorModifiers"
    :display-empty-lines="displayEmptyLines"
    :filter-and-sorting-data="filterAndSortingData"
    :include-mods-and-content="includeModsAndContent"
    :is-base-item="isBaseItem"
    :item="headwear"
    :wearable-modifiers-override="wearableModifiers"
  >
    <template
      v-if="!isBaseItem && hasRicochetChance"
      #slot
    >
      <Tooltip
        :tooltip="$t('caption.ricochetChance')"
        :class="[
          props.includeModsAndContent ? 'headwear-item-card-bold' : undefined,
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
    </template>
  </ArmorItemCard>
</template>










<style scoped>
.headwear-item-card-bold {
  font-style: italic;
  font-weight: bolder;
}
</style>