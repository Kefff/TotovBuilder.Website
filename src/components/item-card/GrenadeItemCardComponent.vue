<script setup lang="ts">
import { computed } from 'vue'
import { IGrenade } from '../../models/item/IGrenade'
import { IItem } from '../../models/item/IItem'
import ItemFilterAndSortingData from '../../models/utils/ItemFilterAndSortingData'
import StatsUtils from '../../utils/StatsUtils'
import Tooltip from '../TooltipComponent.vue'

const props = withDefaults(
  defineProps<{
    filterAndSortingData?: ItemFilterAndSortingData,
    item: IItem
  }>(),
  {
    filterAndSortingData: undefined
  })

const grenade = computed(() => props.item as IGrenade)
</script>










<template>
  <div class="card-line card-line4">
    <Tooltip :tooltip="$t('caption.explosionDelay')">
      <div
        class="card-value"
        :class="StatsUtils.getSortedPropertyColorClass('explosionDelay', filterAndSortingData)"
      >
        <font-awesome-icon
          icon="stopwatch"
          class="icon-before-text"
        />
        <span>{{ $t('caption.explosionDelayValue', { delay: grenade.explosionDelay }) }}</span>
      </div>
    </Tooltip>
    <Tooltip
      v-if="grenade.maximumExplosionRange > 0"
      :tooltip="$t('caption.explosionRange')"
    >
      <div
        class="card-value"
        :class="StatsUtils.getSortedPropertyColorClass('maximumExplosionRange', filterAndSortingData)"
      >
        <font-awesome-icon
          icon="dot-circle"
          class="icon-before-text"
        />
        <span v-if="grenade.minimumExplosionRange !== grenade.maximumExplosionRange">{{ $t('caption.explosionRangeValue', { min: grenade.minimumExplosionRange, max: grenade.maximumExplosionRange }) }}</span>
        <span v-else>{{ $t('caption.explosionRangeSingleValue', { range: grenade.maximumExplosionRange }) }}</span>
      </div>
    </Tooltip>
    <Tooltip
      v-if="grenade.fragmentsAmount > 0"
      :tooltip="$t('caption.fragmentsAmount')"
    >
      <div
        class="card-value"
        :class="StatsUtils.getSortedPropertyColorClass('fragmentsAmount', filterAndSortingData)"
      >
        <font-awesome-icon
          icon="viruses"
          class="icon-before-text"
        />
        <span>{{ grenade.fragmentsAmount }}</span>
      </div>
    </Tooltip>
  </div>
</template>