<template>
  <div
    v-if="ergonomicsModifier !== 0 || showEmptyEntries"
    class="option-entry"
  >
    <div class="option-value">
      <div v-if="ergonomicsModifier !== 0">
        <Tooltip :tooltip="$t('caption.ergonomics')">
          <span :class="StatsUtils.getValueColorClass(ergonomicsModifier)">
            {{ StatsUtils.getStandardDisplayValue(DisplayValueType.ergonomicsModifier, ergonomicsModifier) }}
          </span>
          <font-awesome-icon
            icon="hand-paper"
            class="icon-after-text"
          />
        </Tooltip>
      </div>
    </div>
  </div>
</template>










<script setup lang="ts">
import { computed } from 'vue'
import { IItem } from '../../models/item/IItem'
import { IMod } from '../../models/item/IMod'
import StatsUtils, { DisplayValueType } from '../../utils/StatsUtils'

const props = withDefaults(
  defineProps<{
    item: IItem,
    showEmptyEntries?: boolean
  }>(),
  {
    showEmptyEntries: true
  })

const ergonomicsModifier = computed(() => mod.value.presetErgonomicsModifier ?? mod.value.ergonomicsModifier)
const mod = computed(() => props.item as IMod)
</script>










<style scoped>
@import '../../css/icon.css';
@import '../../css/option.css';
@import '../../css/stats.css';
</style>