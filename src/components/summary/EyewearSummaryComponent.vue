<template>
  <div
    v-if="eyewear.blindnessProtectionPercentage !== 0 || showEmptyEntries"
    class="option-entry"
  >
    <div
      v-tooltip.top="$t('caption.blindnessProtection')"
      class="option-value"
    >
      <div v-if="eyewear.blindnessProtectionPercentage !== 0">
        <span :class="StatsUtils.getValueColorClass(eyewear.blindnessProtectionPercentage)">
          {{ StatsUtils.getStandardDisplayValue(DisplayValueType.blindnessProtectionPercentage, eyewear.blindnessProtectionPercentage) }}
        </span>
        <font-awesome-icon
          icon="low-vision"
          class="icon-after-text"
        />
      </div>
    </div>
  </div>
</template>










<script setup lang="ts">
import { computed } from 'vue'
import { IEyewear } from '../../models/item/IEyewear'
import { IItem } from '../../models/item/IItem'
import StatsUtils, { DisplayValueType } from '../../utils/StatsUtils'

const props = withDefaults(
  defineProps<{
    item: IItem,
    showEmptyEntries?: boolean
  }>(),
  {
    showEmptyEntries: true
  })

const eyewear = computed(() => props.item as IEyewear)
</script>










<style scoped>
@import '../../css/icon.css';
@import '../../css/option.css';
@import '../../css/stats.css';
</style>