<template>
  <div
    v-if="grenade.fragmentsAmount > 0 || showEmptyEntries"
    class="option-entry"
  >
    <div class="option-value">
      <div v-if="grenade.fragmentsAmount > 0">
        <Tooltip :tooltip="$t('caption.fragmentsAmount')">
          <span>{{ grenade.fragmentsAmount }}</span>
          <font-awesome-icon
            icon="viruses"
            class="icon-after-text"
          />
        </Tooltip>
      </div>
    </div>
  </div>
  <div
    v-if="grenade.maximumExplosionRange > 0 || showEmptyEntries"
    class="option-entry"
  >
    <div class="option-value">
      <div v-if="grenade.maximumExplosionRange > 0">
        <Tooltip :tooltip="$t('caption.explosionRadius')">
          <span v-if="grenade.minimumExplosionRange !== grenade.maximumExplosionRange">{{ $t('caption.explosionRadiusValue', { min: grenade.minimumExplosionRange, max: grenade.maximumExplosionRange }) }}</span>
          <span v-else>{{ $t('caption.explosionRadiusSingleValue', { radius: grenade.maximumExplosionRange }) }}</span>
          <font-awesome-icon
            icon="dot-circle"
            class="icon-after-text"
          />
        </Tooltip>
      </div>
    </div>
  </div>
  <div class="option-entry">
    <div class="option-value">
      <Tooltip :tooltip="$t('caption.explosionDelay')">
        <span>{{ $t('caption.explosionDelayValue', { delay: grenade.explosionDelay }) }}</span>
        <font-awesome-icon
          icon="stopwatch"
          class="icon-after-text"
        />
      </Tooltip>
    </div>
  </div>
</template>










<script setup lang="ts">
import { computed } from 'vue'
import { IGrenade } from '../../models/item/IGrenade'
import { IItem } from '../../models/item/IItem'

const props = withDefaults(
  defineProps<{
    item: IItem,
    showEmptyEntries?: boolean
  }>(),
  {
    showEmptyEntries: true
  })

const grenade = computed(() => props.item as IGrenade)
</script>










<style scoped>
@import '../../css/flesh-damage.css';
@import '../../css/icon.css';
@import '../../css/option.css';
</style>