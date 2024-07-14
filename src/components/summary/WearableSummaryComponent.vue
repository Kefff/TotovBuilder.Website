<template>
  <div
    v-if="ergonomicsModifierPercentage !== 0 || showEmptyEntries"
    class="option-entry"
    :class="boldCssClass"
  >
    <div class="option-value">
      <div v-if="ergonomicsModifierPercentage !== 0">
        <Tooltip :tooltip="$t('caption.ergonomics') + (includeModsAndContent ? $t('caption.withMods') : '')">
          <font-awesome-icon
            icon="hand-paper"
            class="icon-before-text"
          />
          <span :class="StatsUtils.getValueColorClass(ergonomicsModifierPercentage)">
            {{ StatsUtils.getStandardDisplayValue(DisplayValueType.ergonomicsModifierPercentage, ergonomicsModifierPercentage) }}
          </span>
        </Tooltip>
      </div>
    </div>
  </div>
  <div
    v-if="movementSpeedModifierPercentage !== 0 || showEmptyEntries"
    class="option-entry"
    :class="boldCssClass"
  >
    <div class="option-value">
      <div v-if="movementSpeedModifierPercentage !== 0">
        <Tooltip :tooltip="$t('caption.movementSpeed') + (includeModsAndContent ? $t('caption.withMods') : '')">
          <font-awesome-icon
            icon="walking"
            class="icon-before-text"
          />
          <span :class="StatsUtils.getValueColorClass(movementSpeedModifierPercentage)">
            {{ StatsUtils.getStandardDisplayValue(DisplayValueType.movementSpeedModifierPercentage, movementSpeedModifierPercentage) }}
          </span>
        </Tooltip>
      </div>
    </div>
  </div>
  <div
    v-if="turningSpeedModifierPercentage !== 0 || showEmptyEntries"
    class="option-entry"
    :class="boldCssClass"
  >
    <div class="option-value">
      <div v-if="turningSpeedModifierPercentage !== 0">
        <Tooltip :tooltip="$t('caption.turningSpeed') + (includeModsAndContent ? $t('caption.withMods') : '')">
          <font-awesome-icon
            icon="undo"
            class="icon-before-text"
          />
          <span :class="StatsUtils.getValueColorClass(turningSpeedModifierPercentage)">
            {{ StatsUtils.getStandardDisplayValue(DisplayValueType.turningSpeedModifierPercentage, turningSpeedModifierPercentage) }}
          </span>
        </Tooltip>
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
    includeModsAndContent?: boolean,
    item: IItem,
    showEmptyEntries?: boolean,
    wearableModifiersOverride?: IWearableModifiers
  }>(),
  {
    includeModsAndContent: false,
    showEmptyEntries: true,
    wearableModifiersOverride: undefined
  })

const boldCssClass = computed(() => props.includeModsAndContent ? 'wearable-summary-bold' : '')
const ergonomicsModifierPercentage = computed(() => props.wearableModifiersOverride?.ergonomicsModifierPercentage ?? wearable.value.presetWearableModifiers?.ergonomicsModifierPercentage ?? wearable.value.ergonomicsModifierPercentage)
const movementSpeedModifierPercentage = computed(() => props.wearableModifiersOverride?.movementSpeedModifierPercentage ?? wearable.value.presetWearableModifiers?.movementSpeedModifierPercentage ?? wearable.value.movementSpeedModifierPercentage)
const turningSpeedModifierPercentage = computed(() => props.wearableModifiersOverride?.turningSpeedModifierPercentage ?? wearable.value.presetWearableModifiers?.turningSpeedModifierPercentage ?? wearable.value.turningSpeedModifierPercentage)
const wearable = computed(() => props.item as IWearable)
</script>










<style scoped>
@import '../../css/icon.css';
@import '../../css/option.css';
@import '../../css/stats.css';

.wearable-summary-bold {
  font-weight: bold;
}
</style>