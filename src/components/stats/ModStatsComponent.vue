<script setup lang="ts">
import { computed } from 'vue'
import { IItem } from '../../models/item/IItem'
import { IMod } from '../../models/item/IMod'
import StatsUtils, { DisplayValueType } from '../../utils/StatsUtils'

const props = defineProps<{
  item: IItem
}>()

const ergonomicsModifier = computed(() => mod.value.presetErgonomicsModifier ?? mod.value.ergonomicsModifier)
const mod = computed(() => props.item as IMod)
</script>










<template>
  <div
    v-if="ergonomicsModifier !== 0"
    class="stats-category"
  >
    {{ $t('caption.modifiers') }}
  </div>
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