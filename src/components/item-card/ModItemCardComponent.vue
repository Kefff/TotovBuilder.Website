<script setup lang="ts">
import { computed } from 'vue'
import { IItem } from '../../models/item/IItem'
import { IMod } from '../../models/item/IMod'
import StatsUtils, { DisplayValueType } from '../../utils/StatsUtils'
import Tooltip from '../TooltipComponent.vue'

const props = withDefaults(
  defineProps<{
    displayEmptyLines?: boolean,
    item: IItem
  }>(),
  {
    displayEmptyLines: true
  })

const ergonomicsModifier = computed(() => mod.value.presetErgonomicsModifier ?? mod.value.ergonomicsModifier)
const mod = computed(() => props.item as IMod)
</script>










<template>
  <div
    v-if="displayEmptyLines
      || ergonomicsModifier !== 0"
    class="card-line card-line4"
  >
    <Tooltip
      v-if="ergonomicsModifier !== 0"
      :tooltip="$t('caption.ergonomicsModifier')"
    >
      <div class="card-value">
        <font-awesome-icon
          icon="hand-paper"
          class="icon-before-text"
        />
        <span :class="StatsUtils.getValueColorClass(ergonomicsModifier)">
          {{ StatsUtils.getStandardDisplayValue(DisplayValueType.ergonomicsModifier, ergonomicsModifier) }}
        </span>
      </div>
    </Tooltip>
  </div>
</template>