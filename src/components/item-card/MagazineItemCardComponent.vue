<script setup lang="ts">
import { computed } from 'vue'
import { IItem } from '../../models/item/IItem'
import { IMagazine } from '../../models/item/IMagazine'
import ItemFilterAndSortingData from '../../models/utils/ItemFilterAndSortingData'
import StatsUtils, { DisplayValueType } from '../../utils/StatsUtils'
import Tooltip from '../TooltipComponent.vue'
import ContainerItemCard from './ContainerItemCardComponent.vue'

const props = withDefaults(
  defineProps<{
    comparisonItem?: IItem,
    displayEmptyLines?: boolean,
    filterAndSortingData?: ItemFilterAndSortingData,
    item: IItem
  }>(),
  {
    comparisonItem: undefined,
    displayEmptyLines: true,
    filterAndSortingData: undefined
  })

const comparisonItemInternal = computed(() => props.comparisonItem as IMagazine | undefined)
const ergonomicsModifier = computed(() => magazine.value.presetErgonomicsModifier ?? magazine.value.ergonomicsModifier)
const magazine = computed(() => props.item as IMagazine)
</script>










<template>
  <ContainerItemCard
    :filter-and-sorting-data="filterAndSortingData"
    :item="magazine"
  />
  <div
    v-if="displayEmptyLines
      || ergonomicsModifier !== 0
      || magazine.loadSpeedModifierPercentage !== 0
      || magazine.checkSpeedModifierPercentage !== 0"
    class="card-line card-line4"
  >
    <Tooltip
      v-if="ergonomicsModifier !== 0"
      :tooltip="$t('caption.ergonomicsModifier')"
    >
      <div
        class="card-value"
        :class="StatsUtils.getSortedPropertyColorClass('ergonomicsModifier', filterAndSortingData)"
      >
        <font-awesome-icon
          icon="hand-paper"
          class="icon-before-text"
        />
        <span :class="StatsUtils.getValueColorClass(ergonomicsModifier)">
          {{ StatsUtils.getStandardDisplayValue(DisplayValueType.ergonomicsModifier, ergonomicsModifier) }}
        </span>
      </div>
    </Tooltip>
    <Tooltip
      v-if="magazine.loadSpeedModifierPercentage !== 0"
      :tooltip="$t('caption.loadSpeedModifierPercentage')"
    >
      <div
        class="card-value"
        :class="StatsUtils.getSortedPropertyColorClass('loadSpeedModifierPercentage', filterAndSortingData)"
      >
        <font-awesome-icon
          icon="sync-alt"
          class="icon-before-text"
        />
        <span :class="StatsUtils.getValueColorClass(magazine.loadSpeedModifierPercentage, true)">
          {{ StatsUtils.getStandardDisplayValue(DisplayValueType.loadSpeedModifierPercentage, magazine.loadSpeedModifierPercentage) }}
        </span>
      </div>
    </Tooltip>
    <Tooltip
      v-if="magazine.checkSpeedModifierPercentage !== 0"
      :tooltip="$t('caption.checkSpeedModifierPercentage')"
    >
      <div
        class="card-value"
        :class="StatsUtils.getSortedPropertyColorClass('checkSpeedModifierPercentage', filterAndSortingData)"
      >
        <font-awesome-icon
          icon="eye"
          class="icon-before-text"
        />
        <span :class="StatsUtils.getValueColorClass(magazine.checkSpeedModifierPercentage, true)">
          {{ StatsUtils.getStandardDisplayValue(DisplayValueType.checkSpeedModifierPercentage, magazine.checkSpeedModifierPercentage) }}
        </span>
      </div>
    </Tooltip>
  </div>
</template>