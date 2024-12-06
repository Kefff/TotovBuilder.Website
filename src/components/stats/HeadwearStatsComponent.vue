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
    <div class="stats-entry">
      <div class="stats-caption">
        <CustomIcon
          :icon="Images.ricochet"
          position="before"
        >
          <span>{{ $t('caption.ricochetChance') }} :</span>
        </CustomIcon>
      </div>
      <div class="stats-value">
        {{ $t('caption.ricochetChance' + headwear.ricochetChance) }}
      </div>
    </div>
  </ArmorStats>
</template>