<template>
  <div
    v-if="ergonomicsModifier !== 0"
    class="stats-line"
  >
    <div class="stats-entry">
      <div class="stats-caption">
        <font-awesome-icon
          icon="hand-paper"
          class="icon-before-text"
        />
        <span>{{ $t('caption.ergonomics') }} :</span>
      </div>
      <div :class="'stats-value ' + StatsUtils.getValueColorClass(ergonomicsModifier)">
        {{ StatsUtils.getStandardDisplayValue(DisplayValueType.ergonomicsModifier, ergonomicsModifier) }}
      </div>
    </div>
  </div>
</template>










<script setup lang="ts">
import { computed } from 'vue'
import { IMod } from '../../models/item/IMod'
import { IItem } from '../../models/item/IItem'
import StatsUtils, { DisplayValueType } from '../../utils/StatsUtils'

const props = defineProps<{
  item: IItem
}>()

const ergonomicsModifier = computed(() => mod.value.presetErgonomicsModifier ?? mod.value.ergonomicsModifier)
const mod = computed(() => props.item as IMod)

</script>










<style scoped>
@import '../../css/icon.css';
@import '../../css/stats.css';
</style>