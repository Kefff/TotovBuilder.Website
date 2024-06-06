<template>
  <div
    v-if="eyewear.blindnessProtectionPercentage !== 0"
    class="stats-line"
  >
    <div class="stats-entry">
      <div class="stats-caption">
        <font-awesome-icon
          icon="low-vision"
          class="icon-before-text"
        />
        <span>{{ $t('caption.blindnessProtection') }} :</span>
      </div>
      <div :class="'stats-value ' + StatsUtils.getValueColorClass(eyewear.blindnessProtectionPercentage)">
        {{ StatsUtils.getStandardDisplayValue(DisplayValueType.blindnessProtectionPercentage, eyewear.blindnessProtectionPercentage) }}
      </div>
    </div>
  </div>
</template>










<script setup lang="ts">
import { computed } from 'vue'
import { IEyewear } from '../../models/item/IEyewear'
import { IItem } from '../../models/item/IItem'
import StatsUtils, { DisplayValueType } from '../../utils/StatsUtils'

const props = defineProps<{
  item: IItem
}>()

const eyewear = computed(() => props.item as IEyewear)
</script>










<style scoped>
@import '../../css/icon.css';
@import '../../css/stats.css';
</style>