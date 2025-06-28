<script setup lang="ts">
import { computed } from 'vue'
import { IEyewear } from '../../models/item/IEyewear'
import { IItem } from '../../models/item/IItem'
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

const comparisonEyewear = computed(() =>
  props.comparisonItem != null
    && _itemPropertiesService.isEyewear(props.comparisonItem)
    && props.comparisonItem?.id !== props.item.id
    ? props.comparisonItem as IEyewear
    : undefined)
const eyewear = computed(() => props.item as IEyewear)

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
      v-if="eyewear.blindnessProtectionPercentage !== 0
        || (comparisonEyewear?.blindnessProtectionPercentage ?? 0 !== 0)"
      :tooltip="$t('caption.blindnessProtectionPercentage')"
    >
      <div
        class="card-value"
        :class="StatsUtils.getSortedPropertyColorClass('blindnessProtectionPercentage', filterAndSortingData)"
      >
        <font-awesome-icon
          icon="low-vision"
          class="icon-before-text"
        />
        <span :class="StatsUtils.getValueColorClass(eyewear.blindnessProtectionPercentage)">
          {{ StatsUtils.getStandardDisplayValue(DisplayValueType.blindnessProtectionPercentage, eyewear.blindnessProtectionPercentage) }}
        </span>
      </div>
      <ValueComparison
        v-if="comparisonEyewear != null"
        :compare-to-value="comparisonEyewear?.blindnessProtectionPercentage"
        :current-value="eyewear.blindnessProtectionPercentage"
        :is-percentage="true"
      />
    </Tooltip>
    <Tooltip
      v-if="eyewear.ergonomicsModifierPercentage !== 0
        || (comparisonEyewear?.ergonomicsModifierPercentage ?? 0 !== 0)"
      :tooltip="$t('caption.ergonomicsModifierPercentage')"
    >
      <div
        class="card-value"
        :class="StatsUtils.getSortedPropertyColorClass('ergonomicsModifierPercentage', filterAndSortingData)"
      >
        <font-awesome-icon
          icon="hand-paper"
          class="icon-before-text"
        />
        <span :class="StatsUtils.getValueColorClass(eyewear.ergonomicsModifierPercentage)">
          {{ StatsUtils.getStandardDisplayValue(DisplayValueType.ergonomicsModifierPercentage, eyewear.ergonomicsModifierPercentage) }}
        </span>
      </div>
      <ValueComparison
        v-if="comparisonEyewear != null"
        :compare-to-value="comparisonEyewear?.ergonomicsModifierPercentage"
        :current-value="eyewear.ergonomicsModifierPercentage"
        :is-percentage="true"
      />
    </Tooltip>
  </div>
</template>