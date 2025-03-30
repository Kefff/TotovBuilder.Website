<script setup lang="ts">
import { computed } from 'vue'
import { IEyewear } from '../../models/item/IEyewear'
import { IItem } from '../../models/item/IItem'
import ItemFilterAndSortingData from '../../models/utils/ItemFilterAndSortingData'
import StatsUtils, { DisplayValueType } from '../../utils/StatsUtils'
import Tooltip from '../TooltipComponent.vue'

const props = withDefaults(
  defineProps<{
    displayEmptyLines?: boolean,
    filterAndSortingData?: ItemFilterAndSortingData,
    item: IItem
  }>(),
  {
    displayEmptyLines: true,
    filterAndSortingData: undefined
  })

const eyewear = computed(() => props.item as IEyewear)
</script>









<template>
  <div
    v-if="displayEmptyLines
      || eyewear.blindnessProtectionPercentage !== 0"
    class="card-line card-line4"
  >
    <Tooltip
      v-if="eyewear.blindnessProtectionPercentage !== 0"
      :tooltip="$t('caption.blindnessProtectionPercentage')"
    >
      <div
        class="card-value"
        :class="StatsUtils.getSortedPropertyColorClass('blindnessProtectionPercentage', filterAndSortingData)"
      >
        <font-awesome-icon
          icon="low-vision"
          class="icon-before-text"
        />
        <span :class="StatsUtils.getValueColorClass(eyewear.blindnessProtectionPercentage)">
          {{ StatsUtils.getStandardDisplayValue(DisplayValueType.blindnessProtectionPercentage, eyewear.blindnessProtectionPercentage) }}
        </span>
      </div>
    </Tooltip>
  </div>
</template>