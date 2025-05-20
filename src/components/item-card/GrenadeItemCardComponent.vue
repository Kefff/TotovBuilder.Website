<script setup lang="ts">
import { computed } from 'vue'
import { IGrenade } from '../../models/item/IGrenade'
import { IItem } from '../../models/item/IItem'
import ItemFilterAndSortingData from '../../models/utils/ItemFilterAndSortingData'
import { ItemPropertiesService } from '../../services/ItemPropertiesService'
import Services from '../../services/repository/Services'
import StatsUtils from '../../utils/StatsUtils'
import WebBrowserUtils from '../../utils/WebBrowserUtils'
import Tooltip from '../TooltipComponent.vue'
import ValueComparison from '../ValueComparisonComponent.vue'

const props = withDefaults(
  defineProps<{
    comparisonItem?: IItem,
    filterAndSortingData?: ItemFilterAndSortingData,
    item: IItem
  }>(),
  {
    comparisonItem: undefined,
    filterAndSortingData: undefined
  })

const _itemPropertiesService = Services.get(ItemPropertiesService)

const comparisonGrenade = computed(() =>
  props.comparisonItem != null
    && _itemPropertiesService.isGrenade(props.comparisonItem)
    && props.comparisonItem?.id !== props.item.id
    ? props.comparisonItem as IGrenade
    : undefined)
const grenade = computed(() => props.item as IGrenade)

const { isSmartphonePortrait } = WebBrowserUtils.getScreenSize()
</script>










<template>
  <div
    class="card-line"
    :class="{
      'card-line3': isSmartphonePortrait,
      'card-line4': !isSmartphonePortrait
    }"
  >
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
      <ValueComparison
        v-if="comparisonGrenade != null"
        :compare-to-value="comparisonGrenade?.explosionDelay"
        :current-value="grenade.explosionDelay"
        :invert="true"
        suffix=" s"
      />
    </Tooltip>
    <Tooltip
      v-if="grenade.maximumExplosionRange !== 0
        || (comparisonGrenade?.maximumExplosionRange ?? 0 !== 0)"
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
      <ValueComparison
        v-if="comparisonGrenade != null"
        :compare-to-value="comparisonGrenade?.maximumExplosionRange"
        :current-value="grenade.maximumExplosionRange"
        suffix=" m"
      />
    </Tooltip>
    <Tooltip
      v-if="grenade.fragmentsAmount !== 0
        || (comparisonGrenade?.fragmentsAmount ?? 0 !== 0)"
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
      <ValueComparison
        v-if="comparisonGrenade != null"
        :compare-to-value="comparisonGrenade?.fragmentsAmount"
        :current-value="grenade.fragmentsAmount"
      />
    </Tooltip>
  </div>
</template>