<script setup lang="ts">
import { computed } from 'vue'
import { IItem } from '../../models/item/IItem'
import { IWearable } from '../../models/item/IWearable'
import { IWearableModifiers } from '../../models/utils/IWearableModifiers'
import StatsUtils, { DisplayValueType } from '../../utils/StatsUtils'
import Tooltip from '../TooltipComponent.vue'

const props = withDefaults(
  defineProps<{
    includeModsAndContent?: boolean,
    item: IItem,
    wearableModifiersOverride?: IWearableModifiers
  }>(),
  {
    includeModsAndContent: false,
    wearableModifiersOverride: undefined
  })

const boldCssClass = computed(() => props.includeModsAndContent ? 'wearable-summary-bold' : '')
const ergonomicsModifierPercentage = computed(() => props.wearableModifiersOverride?.ergonomicsModifierPercentage ?? wearable.value.presetWearableModifiers?.ergonomicsModifierPercentage ?? wearable.value.ergonomicsModifierPercentage)
const movementSpeedModifierPercentage = computed(() => props.wearableModifiersOverride?.movementSpeedModifierPercentage ?? wearable.value.presetWearableModifiers?.movementSpeedModifierPercentage ?? wearable.value.movementSpeedModifierPercentage)
const turningSpeedModifierPercentage = computed(() => props.wearableModifiersOverride?.turningSpeedModifierPercentage ?? wearable.value.presetWearableModifiers?.turningSpeedModifierPercentage ?? wearable.value.turningSpeedModifierPercentage)
const wearable = computed(() => props.item as IWearable)
</script>










<template>
  <div class="card-line">
    <Tooltip
      v-if="ergonomicsModifierPercentage !== 0"
      :class="boldCssClass"
      :tooltip="$t('caption.ergonomics') + (includeModsAndContent ? $t('caption.withMods') : '')"
    >
      <font-awesome-icon
        icon="hand-paper"
        class="icon-before-text"
      />
      <span :class="StatsUtils.getValueColorClass(ergonomicsModifierPercentage)">
        {{ StatsUtils.getStandardDisplayValue(DisplayValueType.ergonomicsModifierPercentage, ergonomicsModifierPercentage) }}
      </span>
    </Tooltip>
    <Tooltip
      v-if="movementSpeedModifierPercentage !== 0"
      :class="boldCssClass"
      :tooltip="$t('caption.movementSpeed') + (includeModsAndContent ? $t('caption.withMods') : '')"
    >
      <font-awesome-icon
        icon="walking"
        class="icon-before-text"
      />
      <span :class="StatsUtils.getValueColorClass(movementSpeedModifierPercentage)">
        {{ StatsUtils.getStandardDisplayValue(DisplayValueType.movementSpeedModifierPercentage, movementSpeedModifierPercentage) }}
      </span>
    </Tooltip>
    <Tooltip
      v-if="turningSpeedModifierPercentage !== 0"
      :class="boldCssClass"
      :tooltip="$t('caption.turningSpeed') + (includeModsAndContent ? $t('caption.withMods') : '')"
    >
      <font-awesome-icon
        icon="undo"
        class="icon-before-text"
      />
      <span :class="StatsUtils.getValueColorClass(turningSpeedModifierPercentage)">
        {{ StatsUtils.getStandardDisplayValue(DisplayValueType.turningSpeedModifierPercentage, turningSpeedModifierPercentage) }}
      </span>
    </Tooltip>
  </div>
</template>










<style scoped>
.wearable-summary-bold {
  font-style: italic;
  font-weight: bold;
}
</style>