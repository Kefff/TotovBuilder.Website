<script setup lang="ts">
import { computed } from 'vue'
import { IItem } from '../../models/item/IItem'
import { IMagazine } from '../../models/item/IMagazine'
import StatsUtils, { DisplayValueType } from '../../utils/StatsUtils'
import Tooltip from '../TooltipComponent.vue'
import ContainerItemCard from './ContainerItemCardComponent.vue'

const props = withDefaults(
  defineProps<{
    displayEmptyLines?: boolean,
    item: IItem
  }>(),
  {
    displayEmptyLines: true
  })

const ergonomicsModifier = computed(() => magazine.value.presetErgonomicsModifier ?? magazine.value.ergonomicsModifier)
const magazine = computed(() => props.item as IMagazine)
</script>










<template>
  <ContainerItemCard :item="magazine" />
  <div
    v-if="displayEmptyLines
      || ergonomicsModifier !== 0
      || magazine.loadSpeedModifierPercentage !== 0
      || magazine.checkSpeedModifierPercentage !== 0"
    class="card-line card-line3"
  >
    <Tooltip
      v-if="ergonomicsModifier !== 0"
      :tooltip="$t('caption.ergonomicsModifier')"
      class="card-value"
    >
      <font-awesome-icon
        icon="hand-paper"
        class="icon-before-text"
      />
      <span :class="StatsUtils.getValueColorClass(ergonomicsModifier)">
        {{ StatsUtils.getStandardDisplayValue(DisplayValueType.ergonomicsModifier, ergonomicsModifier) }}
      </span>
    </Tooltip>
    <Tooltip
      v-if="magazine.loadSpeedModifierPercentage !== 0"
      :tooltip="$t('caption.loadSpeedModifierPercentage')"
      class="card-value"
    >
      <font-awesome-icon
        icon="sync-alt"
        class="icon-before-text"
      />
      <span :class="StatsUtils.getValueColorClass(magazine.loadSpeedModifierPercentage, true)">
        {{ StatsUtils.getStandardDisplayValue(DisplayValueType.loadSpeedModifierPercentage, magazine.loadSpeedModifierPercentage) }}
      </span>
    </Tooltip>
    <Tooltip
      v-if="magazine.checkSpeedModifierPercentage !== 0"
      :tooltip="$t('caption.checkSpeedModifierPercentage')"
      class="card-value"
    >
      <font-awesome-icon
        icon="eye"
        class="icon-before-text"
      />
      <span :class="StatsUtils.getValueColorClass(magazine.checkSpeedModifierPercentage, true)">
        {{ StatsUtils.getStandardDisplayValue(DisplayValueType.checkSpeedModifierPercentage, magazine.checkSpeedModifierPercentage) }}
      </span>
    </Tooltip>
  </div>
</template>