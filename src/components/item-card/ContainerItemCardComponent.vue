<script setup lang="ts">
import { computed } from 'vue'
import { IContainer } from '../../models/item/IContainer'
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

const container = computed(() => props.item as IContainer)
</script>










<template>
  <div class="card-line card-line4">
    <Tooltip :tooltip="$t('caption.capacity')">
      <div
        class="card-value"
        :class="StatsUtils.getSortedPropertyColorClass('capacity', filterAndSortingData)"
      >
        <font-awesome-icon
          icon="box-open"
          class="icon-before-text"
        />
        <span>{{ container.capacity }}</span>
      </div>
    </Tooltip>
  </div>
</template>