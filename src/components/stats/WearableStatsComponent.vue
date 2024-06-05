<template>
  <div
    v-if="ergonomicsModifierPercentage !== 0 || movementSpeedModifierPercentage !== 0 || turningSpeedModifierPercentage !== 0"
    class="stats-line"
  >
    <div
      v-if="ergonomicsModifierPercentage !== 0"
      class="stats-entry"
    >
      <div class="stats-caption">
        <font-awesome-icon
          icon="hand-paper"
          class="icon-before-text"
        />
        <span>{{ $t('caption.ergonomics') }} :</span>
      </div>
      <div :class="'stats-value ' + StatsUtils.getValueColorClass(ergonomicsModifierPercentage)">
        {{ StatsUtils.getStandardDisplayValue(DisplayValueType.ergonomicsModifierPercentage, ergonomicsModifierPercentage) }}
      </div>
    </div>
    <div
      v-if="movementSpeedModifierPercentage !== 0"
      class="stats-entry"
    >
      <div class="stats-caption">
        <font-awesome-icon
          icon="walking"
          class="icon-before-text"
        />
        <span>{{ $t('caption.movementSpeed') }} :</span>
      </div>
      <div :class="'stats-value ' + StatsUtils.getValueColorClass(movementSpeedModifierPercentage)">
        {{ StatsUtils.getStandardDisplayValue(DisplayValueType.movementSpeedModifierPercentage, movementSpeedModifierPercentage) }}
      </div>
    </div>
    <div
      v-if="turningSpeedModifierPercentage !== 0"
      class="stats-entry"
    >
      <div class="stats-caption">
        <font-awesome-icon
          icon="undo"
          class="icon-before-text"
        />
        <span>{{ $t('caption.turningSpeed') }} :</span>
      </div>
      <div :class="'stats-value ' + StatsUtils.getValueColorClass(turningSpeedModifierPercentage)">
        {{ StatsUtils.getStandardDisplayValue(DisplayValueType.turningSpeedModifierPercentage, turningSpeedModifierPercentage) }}
      </div>
    </div>
  </div>
</template>










<script setup lang="ts">
import { computed } from 'vue'
import { IItem } from '../../models/item/IItem'
import { IWearable } from '../../models/item/IWearable'
import { IWearableModifiers } from '../../models/utils/IWearableModifiers'
import StatsUtils, { DisplayValueType } from '../../utils/StatsUtils'

const props = withDefaults(
  defineProps<{
    item: IItem,
    wearableModifiersOverride?: IWearableModifiers
  }>(),
  {
    wearableModifiersOverride: undefined
  })

const ergonomicsModifierPercentage = computed(() => props.wearableModifiersOverride?.ergonomicsModifierPercentage ?? wearable.value.ergonomicsModifierPercentage)
const movementSpeedModifierPercentage = computed(() => props.wearableModifiersOverride?.movementSpeedModifierPercentage ?? wearable.value.movementSpeedModifierPercentage)
const turningSpeedModifierPercentage = computed(() => props.wearableModifiersOverride?.turningSpeedModifierPercentage ?? wearable.value.turningSpeedModifierPercentage)
const wearable = computed(() => props.item as IWearable)
</script>










<style scoped>
@import '../../css/icon.css';
@import '../../css/stats.css';
</style>