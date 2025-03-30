<script setup lang="ts">
import { computed } from 'vue'
import { IItem } from '../../models/item/IItem'
import { IWearable } from '../../models/item/IWearable'
import ItemFilterAndSortingData from '../../models/utils/ItemFilterAndSortingData'
import { IWearableModifiers } from '../../models/utils/IWearableModifiers'
import StatsUtils, { DisplayValueType } from '../../utils/StatsUtils'
import Tooltip from '../TooltipComponent.vue'

const props = withDefaults(
  defineProps<{
    displayEmptyLines?: boolean,
    filterAndSortingData?: ItemFilterAndSortingData,
    includeModsAndContent?: boolean,
    item: IItem,
    wearableModifiersOverride?: IWearableModifiers
  }>(),
  {
    displayEmptyLines: true,
    filterAndSortingData: undefined,
    includeModsAndContent: false,
    wearableModifiersOverride: undefined
  })

const ergonomicsModifierPercentage = computed(() => props.wearableModifiersOverride?.ergonomicsModifierPercentage ?? wearable.value.presetWearableModifiers?.ergonomicsModifierPercentage ?? wearable.value.ergonomicsModifierPercentage)
const movementSpeedModifierPercentage = computed(() => props.wearableModifiersOverride?.movementSpeedModifierPercentage ?? wearable.value.presetWearableModifiers?.movementSpeedModifierPercentage ?? wearable.value.movementSpeedModifierPercentage)
const turningSpeedModifierPercentage = computed(() => props.wearableModifiersOverride?.turningSpeedModifierPercentage ?? wearable.value.presetWearableModifiers?.turningSpeedModifierPercentage ?? wearable.value.turningSpeedModifierPercentage)
const wearable = computed(() => props.item as IWearable)
</script>










<template>
  <div
    v-if="displayEmptyLines
      || ergonomicsModifierPercentage !== 0
      || movementSpeedModifierPercentage !== 0
      || turningSpeedModifierPercentage !== 0"
    class="card-line card-line4"
  >
    <Tooltip
      v-if="ergonomicsModifierPercentage !== 0"
      :class="{ 'wearable-summary-bold': props.includeModsAndContent }"
      :tooltip="$t('caption.ergonomicsModifierPercentage') + (includeModsAndContent ? $t('caption.withMods') : '')"
    >
      <div
        class="card-value"
        :class="StatsUtils.getSortedPropertyColorClass('ergonomicsModifierPercentage', filterAndSortingData)"
      >
        <font-awesome-icon
          icon="hand-paper"
          class="icon-before-text"
        />
        <span :class="StatsUtils.getValueColorClass(ergonomicsModifierPercentage)">
          {{ StatsUtils.getStandardDisplayValue(DisplayValueType.ergonomicsModifierPercentage, ergonomicsModifierPercentage) }}
        </span>
      </div>
    </Tooltip>
    <Tooltip
      v-if="movementSpeedModifierPercentage !== 0"
      :class="{ 'wearable-summary-bold': props.includeModsAndContent }"
      :tooltip="$t('caption.movementSpeedModifierPercentage') + (includeModsAndContent ? $t('caption.withMods') : '')"
    >
      <div
        class="card-value"
        :class="StatsUtils.getSortedPropertyColorClass('movementSpeedModifierPercentage', filterAndSortingData)"
      >
        <font-awesome-icon
          icon="walking"
          class="icon-before-text"
        />
        <span :class="StatsUtils.getValueColorClass(movementSpeedModifierPercentage)">
          {{ StatsUtils.getStandardDisplayValue(DisplayValueType.movementSpeedModifierPercentage, movementSpeedModifierPercentage) }}
        </span>
      </div>
    </Tooltip>
    <Tooltip
      v-if="turningSpeedModifierPercentage !== 0"
      :class="{ 'wearable-summary-bold': props.includeModsAndContent }"
      :tooltip="$t('caption.turningSpeedModifierPercentage') + (includeModsAndContent ? $t('caption.withMods') : '')"
    >
      <div
        class="card-value"
        :class="StatsUtils.getSortedPropertyColorClass('turningSpeedModifierPercentage', filterAndSortingData)"
      >
        <font-awesome-icon
          icon="undo"
          class="icon-before-text"
        />
        <span :class="StatsUtils.getValueColorClass(turningSpeedModifierPercentage)">
          {{ StatsUtils.getStandardDisplayValue(DisplayValueType.turningSpeedModifierPercentage, turningSpeedModifierPercentage) }}
        </span>
      </div>
    </Tooltip>
  </div>
</template>










<style scoped>
.wearable-summary-bold {
  font-style: italic;
  font-weight: bolder;
}
</style>