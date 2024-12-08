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
      v-if="grenade.fragmentsAmount > 0"
      :tooltip="$t('caption.fragmentsAmount')"
    >
      <font-awesome-icon
        icon="viruses"
        class="icon-before-text"
      />
      <span>{{ grenade.fragmentsAmount }}</span>
    </Tooltip>
    <Tooltip :tooltip="$t('caption.explosionDelay')">
      <font-awesome-icon
        icon="stopwatch"
        class="icon-before-text"
      />
      <span>{{ $t('caption.explosionDelayValue', { delay: grenade.explosionDelay }) }}</span>
    </Tooltip>
    <div class="grenade-item-card-long">
      <Tooltip
        v-if="grenade.maximumExplosionRange > 0"
        :tooltip="$t('caption.explosionRadius')"
      >
        <font-awesome-icon
          icon="dot-circle"
          class="icon-before-text"
        />
        <span v-if="grenade.minimumExplosionRange !== grenade.maximumExplosionRange">{{ $t('caption.explosionRadiusValue', { min: grenade.minimumExplosionRange, max: grenade.maximumExplosionRange }) }}</span>
        <span v-else>{{ $t('caption.explosionRadiusSingleValue', { radius: grenade.maximumExplosionRange }) }}</span>
      </Tooltip>
    </div>
  </div>
</template>










<style scoped>
.grenade-item-card-long {
  display: flex;
  grid-column: span 2;
}
</style>