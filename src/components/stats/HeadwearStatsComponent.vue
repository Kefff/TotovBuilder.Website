<script setup lang="ts">
import { computed } from 'vue'
import Images from '../../images'
import { IHeadwear } from '../../models/item/IHeadwear'
import { IItem } from '../../models/item/IItem'
import CustomIcon from '../CustomIconComponent.vue'
import ArmorStats from './ArmorStatsComponent.vue'

const props = defineProps<{
  item: IItem
}>()

const headwear = computed(() => props.item as IHeadwear)
</script>










<template>
  <ArmorStats :item="headwear">
    <div
      v-if="headwear.ricochetChance != null"
      class="stats-entry"
    >
      <div class="stats-caption">
        <CustomIcon
          :icon="Images.ricochet"
          position="before"
        >
          <span>{{ $t('caption.ricochetChance') }} :</span>
        </CustomIcon>
      </div>
      <div
        class="stats-value"
        :class="`headwear-stats-ricochet-chance-${headwear.ricochetChance.toLowerCase()}`"
      >
        {{ $t(`caption.${headwear.ricochetChance.toLocaleLowerCase()}`) }}
      </div>
    </div>
    <div
      v-if="headwear.deafening != null"
      class="stats-entry"
    >
      <div class="stats-caption">
        <font-awesome-icon
          icon="deaf"
          class="icon-before-text"
        />
        <span>{{ $t('caption.deafening') }} :</span>
      </div>
      <div
        class="stats-value"
        :class="`headwear-stats-deafening-${headwear.deafening.toLowerCase()}`"
      >
        {{ $t(`caption.${headwear.deafening.toLocaleLowerCase()}`) }}
      </div>
    </div>
    <div
      v-if="headwear.blocksHeadphones"
      class="stats-entry"
    >
      <div class="stats-caption">
        <font-awesome-icon
          icon="volume-mute"
          class="icon-before-text"
        />
        <span class="stats-value-negative">{{ $t('caption.blocksHeadphones') }}</span>
      </div>
    </div>
  </ArmorStats>
</template>










<style scoped>
.headwear-stats-deafening-high {
  color: var(--danger-color);
}

.headwear-stats-deafening-medium {
  color: var(--warning-color);
}

.headwear-stats-deafening-low {
  color: rgb(255, 225, 100);
}

.headwear-stats-ricochet-chance-high {
  color: var(--success-color);
}

.headwear-stats-ricochet-chance-medium {
  color: rgb(255, 225, 100);
}

.headwear-stats-ricochet-chance-low {
  color: var(--danger-color);
}
</style>