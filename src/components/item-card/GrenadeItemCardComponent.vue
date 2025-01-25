<script setup lang="ts">
import { computed } from 'vue'
import { IGrenade } from '../../models/item/IGrenade'
import { IItem } from '../../models/item/IItem'
import Tooltip from '../TooltipComponent.vue'

const props = defineProps<{ item: IItem }>()

const grenade = computed(() => props.item as IGrenade)
</script>










<template>
  <div class="card-line card-line4">
    <Tooltip
      :tooltip="$t('caption.explosionDelay')"
      class="card-value"
    >
      <font-awesome-icon
        icon="stopwatch"
        class="icon-before-text"
      />
      <span>{{ $t('caption.explosionDelayValue', { delay: grenade.explosionDelay }) }}</span>
    </Tooltip>
    <Tooltip
      v-if="grenade.maximumExplosionRange > 0"
      :tooltip="$t('caption.explosionRange')"
      class="card-value"
    >
      <font-awesome-icon
        icon="dot-circle"
        class="icon-before-text"
      />
      <span v-if="grenade.minimumExplosionRange !== grenade.maximumExplosionRange">{{ $t('caption.explosionRangeValue', { min: grenade.minimumExplosionRange, max: grenade.maximumExplosionRange }) }}</span>
      <span v-else>{{ $t('caption.explosionRangeSingleValue', { range: grenade.maximumExplosionRange }) }}</span>
    </Tooltip>
    <Tooltip
      v-if="grenade.fragmentsAmount > 0"
      :tooltip="$t('caption.fragmentsAmount')"
      class="card-value"
    >
      <font-awesome-icon
        icon="viruses"
        class="icon-before-text"
      />
      <span>{{ grenade.fragmentsAmount }}</span>
    </Tooltip>
  </div>
</template>