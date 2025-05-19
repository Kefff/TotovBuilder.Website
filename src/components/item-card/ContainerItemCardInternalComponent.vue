<script setup lang="ts">
import { computed } from 'vue'
import { IContainer } from '../../models/item/IContainer'
import { IItem } from '../../models/item/IItem'
import ItemFilterAndSortingData from '../../models/utils/ItemFilterAndSortingData'
import StatsUtils from '../../utils/StatsUtils'
import Tooltip from '../TooltipComponent.vue'
import ValueComparison from '../ValueComparisonComponent.vue'

const props = withDefaults(
  defineProps<{
    comparisonItem?: IItem,
    filterAndSortingData?: ItemFilterAndSortingData,
    container: IContainer
  }>(),
  {
    comparisonItem: undefined,
    filterAndSortingData: undefined
  })

const comparisonContainer = computed(() => props.comparisonItem?.id !== props.container.id ? props.comparisonItem as IContainer : undefined)
</script>










<template>
  <Tooltip
    v-if="container.capacity !== 0"
    :tooltip="$t('caption.capacity')"
  >
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
    <ValueComparison
      v-if="comparisonContainer != null"
      :compare-to-value="comparisonContainer?.capacity"
      :current-value="container.capacity"
      :is-percentage="false"
    />
  </Tooltip>
</template>