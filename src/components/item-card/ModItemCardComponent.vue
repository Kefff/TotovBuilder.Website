<script setup lang="ts">
import { computed } from 'vue'
import { IItem } from '../../models/item/IItem'
import { IMod } from '../../models/item/IMod'
import ItemFilterAndSortingData from '../../models/utils/ItemFilterAndSortingData'
import { ItemPropertiesService } from '../../services/ItemPropertiesService'
import Services from '../../services/repository/Services'
import StatsUtils, { DisplayValueType } from '../../utils/StatsUtils'
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

const comparisonMod = computed(() =>
  props.comparisonItem != null
    && _itemPropertiesService.isModdable(props.comparisonItem)
    && props.comparisonItem?.id !== props.item.id
    ? props.comparisonItem as IMod
    : undefined)
const comparisonModErgonomics = computed(() => comparisonMod.value?.presetErgonomicsModifier ?? comparisonMod.value?.ergonomicsModifier)
const ergonomicsModifier = computed(() => mod.value.presetErgonomicsModifier ?? mod.value.ergonomicsModifier)
const mod = computed(() => props.item as IMod)

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
    <Tooltip
      v-if="ergonomicsModifier !== 0
        || (comparisonModErgonomics ?? 0 !== 0)"
      :tooltip="$t('caption.ergonomicsModifier')"
    >
      <div
        class="card-value"
        :class="StatsUtils.getSortedPropertyColorClass('ergonomicsModifier', filterAndSortingData)"
      >
        <font-awesome-icon
          icon="hand-paper"
          class="icon-before-text"
        />
        <span :class="StatsUtils.getValueColorClass(ergonomicsModifier)">
          {{ StatsUtils.getStandardDisplayValue(DisplayValueType.ergonomicsModifier, ergonomicsModifier) }}
        </span>
      </div>
      <ValueComparison
        v-if="comparisonMod != null"
        :compare-to-value="comparisonModErgonomics"
        :current-value="mod.ergonomicsModifier"
      />
    </Tooltip>
  </div>
</template>