<template>
  <ContainerSummary :item="magazine" />
  <div
    v-if="magazine.loadSpeedModifierPercentage !== 0 || showEmptyEntries"
    class="option-entry"
  >
    <div class="option-value">
      <div
        v-if="magazine.loadSpeedModifierPercentage !== 0"
        v-tooltip.top="$t('caption.loadSpeed')"
      >
        <span :class="StatsUtils.getValueColorClass(magazine.loadSpeedModifierPercentage, true)">
          {{ StatsUtils.getStandardDisplayValue(DisplayValueType.loadSpeedModifierPercentage, magazine.loadSpeedModifierPercentage) }}
        </span>
        <font-awesome-icon
          icon="sync-alt"
          class="icon-after-text"
        />
      </div>
    </div>
  </div>
  <div
    v-if="magazine.checkSpeedModifierPercentage !== 0 || showEmptyEntries"
    class="option-entry"
  >
    <div class="option-value">
      <div
        v-if="magazine.checkSpeedModifierPercentage !== 0"
        v-tooltip.top="$t('caption.checkSpeed')"
      >
        <span :class="StatsUtils.getValueColorClass(magazine.checkSpeedModifierPercentage, true)">
          {{ StatsUtils.getStandardDisplayValue(DisplayValueType.checkSpeedModifierPercentage, magazine.checkSpeedModifierPercentage) }}
        </span>
        <font-awesome-icon
          icon="eye"
          class="icon-after-text"
        />
      </div>
    </div>
  </div>
  <div
    v-if="ergonomicsModifier !== 0 || showEmptyEntries"
    class="option-entry"
  >
    <div class="option-value">
      <div
        v-if="ergonomicsModifier !== 0"
        v-tooltip.top="$t('caption.ergonomics')"
      >
        <span :class="StatsUtils.getValueColorClass(ergonomicsModifier)">
          {{ StatsUtils.getStandardDisplayValue(DisplayValueType.ergonomicsModifier, ergonomicsModifier) }}
        </span>
        <font-awesome-icon
          icon="hand-paper"
          class="icon-after-text"
        />
      </div>
    </div>
  </div>
</template>










<script setup lang="ts">
import { computed } from 'vue'
import { IItem } from '../../models/item/IItem'
import { IMagazine } from '../../models/item/IMagazine'
import StatsUtils, { DisplayValueType } from '../../utils/StatsUtils'
import ContainerSummary from './ContainerSummaryComponent.vue'

const props = withDefaults(
  defineProps<{
    item: IItem,
    showEmptyEntries?: boolean
  }>(),
  {
    showEmptyEntries: true
  })

const ergonomicsModifier = computed(() => magazine.value.presetErgonomicsModifier ?? magazine.value.ergonomicsModifier)
const magazine = computed(() => props.item as IMagazine)
</script>










<style scoped>
@import '../../css/icon.css';
@import '../../css/option.css';
@import '../../css/stats.css';
</style>