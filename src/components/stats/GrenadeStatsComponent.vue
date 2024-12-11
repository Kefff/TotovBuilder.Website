<script setup lang="ts">
import { computed } from 'vue'
import { IGrenade } from '../../models/item/IGrenade'
import { IItem } from '../../models/item/IItem'

const props = defineProps<{
  item: IItem
}>()

const grenade = computed(() => props.item as IGrenade)
</script>










<template>
  <div class="stats-category">
    {{ $t('caption.grenade') }}
  </div>
  <div class="stats-line">
    <div
      v-if="grenade.fragmentsAmount > 0"
      class="stats-entry"
    >
      <div class="stats-caption">
        <font-awesome-icon
          icon="viruses"
          class="icon-before-text"
        />
        <span>{{ $t('caption.fragmentsAmount') }} :</span>
      </div>
      <div class="stats-value">
        {{ grenade.fragmentsAmount }}
      </div>
    </div>
    <div class="stats-entry">
      <div class="stats-caption">
        <font-awesome-icon
          icon="stopwatch"
          class="icon-before-text"
        />
        <span>{{ $t('caption.explosionDelay') }} :</span>
      </div>
      <div class="stats-value">
        {{ $t('caption.explosionDelayValue', { delay: grenade.explosionDelay }) }}
      </div>
    </div>
    <div
      v-if="grenade.maximumExplosionRange > 0"
      class="stats-entry"
    >
      <div class="stats-caption">
        <font-awesome-icon
          icon="dot-circle"
          class="icon-before-text"
        />
        <span>{{ $t('caption.explosionRange') }} :</span>
      </div>
      <div class="stats-value">
        <span v-if="grenade.minimumExplosionRange !== grenade.maximumExplosionRange">{{ $t('caption.explosionRangeValue', { min: grenade.minimumExplosionRange, max: grenade.maximumExplosionRange }) }}</span>
        <span v-else>{{ $t('caption.explosionRangeSingleValue', { range: grenade.maximumExplosionRange }) }}</span>
      </div>
    </div>
  </div>
</template>