<script setup lang="ts">
import { computed } from 'vue'
import { IItem } from '../../models/item/IItem'
import { IWearable } from '../../models/item/IWearable'
import ItemFilterAndSortingData from '../../models/utils/ItemFilterAndSortingData'
import { IWearableModifiers } from '../../models/utils/IWearableModifiers'
import { ItemPropertiesService } from '../../services/ItemPropertiesService'
import Services from '../../services/repository/Services'
import StatsUtils, { DisplayValueType } from '../../utils/StatsUtils'
import Tooltip from '../TooltipComponent.vue'
import ValueComparison from '../ValueComparisonComponent.vue'

const props = withDefaults(
  defineProps<{
    comparisonItem?: IItem,
    filterAndSortingData?: ItemFilterAndSortingData,
    includeModsAndContent?: boolean,
    wearable: IWearable,
    wearableModifiersOverride?: IWearableModifiers
  }>(),
  {
    comparisonItem: undefined,
    filterAndSortingData: undefined,
    includeModsAndContent: false,
    wearableModifiersOverride: undefined
  })

const _itemPropertiesService = Services.get(ItemPropertiesService)

const comparisonWearable = computed(() =>
  props.comparisonItem != null
    && _itemPropertiesService.isWearable(props.comparisonItem)
    && props.comparisonItem?.id !== props.wearable.id
    ? props.comparisonItem as IWearable
    : undefined)
const comparisonWearableErgonomicsModifierPercentage = computed(() => comparisonWearable.value?.presetWearableModifiers?.ergonomicsModifierPercentage ?? comparisonWearable.value?.ergonomicsModifierPercentage)
const comparisonWearableMovementSpeedModifierPercentage = computed(() => comparisonWearable.value?.presetWearableModifiers?.movementSpeedModifierPercentage ?? comparisonWearable.value?.movementSpeedModifierPercentage)
const comparisonWearableTurningSpeedModifierPercentage = computed(() => comparisonWearable.value?.presetWearableModifiers?.turningSpeedModifierPercentage ?? comparisonWearable.value?.turningSpeedModifierPercentage)
const ergonomicsModifierPercentage = computed(() => props.wearableModifiersOverride?.ergonomicsModifierPercentage ?? props.wearable.presetWearableModifiers?.ergonomicsModifierPercentage ?? props.wearable.ergonomicsModifierPercentage)
const movementSpeedModifierPercentage = computed(() => props.wearableModifiersOverride?.movementSpeedModifierPercentage ?? props.wearable.presetWearableModifiers?.movementSpeedModifierPercentage ?? props.wearable.movementSpeedModifierPercentage)
const turningSpeedModifierPercentage = computed(() => props.wearableModifiersOverride?.turningSpeedModifierPercentage ?? props.wearable.presetWearableModifiers?.turningSpeedModifierPercentage ?? props.wearable.turningSpeedModifierPercentage)
</script>










<template>
  <Tooltip
    v-if="ergonomicsModifierPercentage !== 0
      || (comparisonWearableErgonomicsModifierPercentage ?? 0) !== 0"
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
    <ValueComparison
      v-if="comparisonWearable != null"
      :compare-to-value="comparisonWearableErgonomicsModifierPercentage"
      :current-value="ergonomicsModifierPercentage"
      :is-percentage="true"
      :round-decimal-count="1"
    />
  </Tooltip>
  <Tooltip
    v-if="movementSpeedModifierPercentage !== 0
      || (comparisonWearableMovementSpeedModifierPercentage ?? 0) !== 0"
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
    <ValueComparison
      v-if="comparisonWearable != null"
      :compare-to-value="comparisonWearableMovementSpeedModifierPercentage"
      :current-value="movementSpeedModifierPercentage"
      :is-percentage="true"
      :round-decimal-count="1"
    />
  </Tooltip>
  <Tooltip
    v-if="turningSpeedModifierPercentage !== 0
      || (comparisonWearableTurningSpeedModifierPercentage ?? 0) !== 0"
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
    <ValueComparison
      v-if="comparisonWearable != null"
      :compare-to-value="comparisonWearableTurningSpeedModifierPercentage"
      :current-value="turningSpeedModifierPercentage"
      :is-percentage="true"
      :round-decimal-count="1"
    />
  </Tooltip>
</template>










<style scoped>
.wearable-summary-bold {
  font-style: italic;
  font-weight: bolder;
}
</style>