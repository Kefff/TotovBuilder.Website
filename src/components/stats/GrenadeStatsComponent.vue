<template>
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
    <div
      v-if="grenade.maximumExplosionRange > 0"
      class="stats-entry"
    >
      <div class="stats-caption">
        <font-awesome-icon
          icon="dot-circle"
          class="icon-before-text"
        />
        <span>{{ $t('caption.explosionRadius') }} :</span>
      </div>
      <div class="stats-value">
        <span v-if="grenade.minimumExplosionRange !== grenade.maximumExplosionRange">{{ $t('caption.explosionRadiusValue', { min: grenade.minimumExplosionRange, max: grenade.maximumExplosionRange }) }}</span>
        <span v-else>{{ $t('caption.explosionRadiusSingleValue', { radius: grenade.maximumExplosionRange }) }}</span>
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
  </div>
</template>










<script setup lang="ts">
import { computed } from 'vue'
import { IGrenade } from '../../models/item/IGrenade'
import { IItem } from '../../models/item/IItem'

const props = defineProps<{
  item: IItem
}>()

const grenade = computed(() => props.item as IGrenade)
</script>










<style scoped>
@import '../../css/icon.css';
@import '../../css/stats.css';
</style>