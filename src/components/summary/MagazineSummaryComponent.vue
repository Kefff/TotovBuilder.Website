<template>
  <ContainerSummary :item="magazine" />
  <div
    v-if="magazine.loadSpeedModifierPercentage !== 0 || showEmptyEntries"
    class="option-entry"
  >
    <div class="option-value">
      <div v-if="magazine.loadSpeedModifierPercentage !== 0">
        <Tooltip :tooltip="$t('caption.loadSpeed')">
          <font-awesome-icon
            icon="sync-alt"
            class="icon-before-text"
          />
          <span :class="StatsUtils.getValueColorClass(magazine.loadSpeedModifierPercentage, true)">
            {{ StatsUtils.getStandardDisplayValue(DisplayValueType.loadSpeedModifierPercentage, magazine.loadSpeedModifierPercentage) }}
          </span>
        </Tooltip>
      </div>
    </div>
  </div>
  <div
    v-if="magazine.checkSpeedModifierPercentage !== 0 || showEmptyEntries"
    class="option-entry"
  >
    <div class="option-value">
      <div v-if="magazine.checkSpeedModifierPercentage !== 0">
        <Tooltip :tooltip="$t('caption.checkSpeed')">
          <font-awesome-icon
            icon="eye"
            class="icon-before-text"
          />
          <span :class="StatsUtils.getValueColorClass(magazine.checkSpeedModifierPercentage, true)">
            {{ StatsUtils.getStandardDisplayValue(DisplayValueType.checkSpeedModifierPercentage, magazine.checkSpeedModifierPercentage) }}
          </span>
        </Tooltip>
      </div>
    </div>
  </div>
  <div
    v-if="ergonomicsModifier !== 0 || showEmptyEntries"
    class="option-entry"
  >
    <div class="option-value">
      <div v-if="ergonomicsModifier !== 0">
        <Tooltip :tooltip="$t('caption.ergonomics')">
          <font-awesome-icon
            icon="hand-paper"
            class="icon-before-text"
          />
          <span :class="StatsUtils.getValueColorClass(ergonomicsModifier)">
            {{ StatsUtils.getStandardDisplayValue(DisplayValueType.ergonomicsModifier, ergonomicsModifier) }}
          </span>
        </Tooltip>
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