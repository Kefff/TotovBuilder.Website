<script setup lang="ts">
import { computed } from 'vue'
import { IItem } from '../../models/item/IItem'
import { IWearable } from '../../models/item/IWearable'
import { IWearableModifiers } from '../../models/utils/IWearableModifiers'
import StatsUtils, { DisplayValueType } from '../../utils/StatsUtils'

const props = withDefaults(
  defineProps<{
    item: IItem,
    showModifiersCategory?: boolean,
    wearableModifiersOverride?: IWearableModifiers
  }>(),
  {
    showModifiersCategory: false,
    wearableModifiersOverride: undefined
  })

const displayModifiersCategory = computed(() => props.showModifiersCategory || hasModifiers.value)
const ergonomicsModifierPercentage = computed(() => props.wearableModifiersOverride?.ergonomicsModifierPercentage ?? wearable.value.ergonomicsModifierPercentage)
const hasModifiers = computed(() =>
  ergonomicsModifierPercentage.value !== 0
  || movementSpeedModifierPercentage.value !== 0
  || turningSpeedModifierPercentage.value !== 0)
const movementSpeedModifierPercentage = computed(() => props.wearableModifiersOverride?.movementSpeedModifierPercentage ?? wearable.value.movementSpeedModifierPercentage)
const turningSpeedModifierPercentage = computed(() => props.wearableModifiersOverride?.turningSpeedModifierPercentage ?? wearable.value.turningSpeedModifierPercentage)
const wearable = computed(() => props.item as IWearable)
</script>










<template>
  <div
    v-if="displayModifiersCategory"
    class="stats-category"
  >
    {{ $t('caption.modifiers') }}
  </div>
  <div
    v-if="hasModifiers"
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