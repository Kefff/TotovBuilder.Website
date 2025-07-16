<script setup lang="ts">
import { computed } from 'vue'
import { IItem } from '../../models/item/IItem'
import { IMagazine } from '../../models/item/IMagazine'
import ItemFilterAndSortingData from '../../models/utils/ItemFilterAndSortingData'
import { ItemPropertiesService } from '../../services/ItemPropertiesService'
import Services from '../../services/repository/Services'
import StatsUtils, { DisplayValueType } from '../../utils/StatsUtils'
import WebBrowserUtils from '../../utils/WebBrowserUtils'
import Tooltip from '../TooltipComponent.vue'
import ValueComparison from '../ValueComparisonComponent.vue'
import ContainerItemCardInternal from './ContainerItemCardInternalComponent.vue'

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

const comparisonMagazine = computed(() =>
  props.comparisonItem != null
    && _itemPropertiesService.isMagazine(props.comparisonItem)
    && props.comparisonItem?.id !== props.item.id
    ? props.comparisonItem as IMagazine
    : undefined)
const comparisonMagazineErgonomics = computed(() => comparisonMagazine.value?.presetErgonomicsModifier ?? comparisonMagazine.value?.ergonomicsModifier)
const ergonomicsModifier = computed(() => magazine.value.presetErgonomicsModifier ?? magazine.value.ergonomicsModifier)
const magazine = computed(() => props.item as IMagazine)

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
    <ContainerItemCardInternal
      :comparison-item="comparisonItem"
      :filter-and-sorting-data="filterAndSortingData"
      :container="magazine"
    />
    <Tooltip
      v-if="ergonomicsModifier !== 0
        || (comparisonMagazineErgonomics ?? 0) !== 0"
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
        v-if="comparisonMagazine != null"
        :compare-to-value="comparisonMagazineErgonomics"
        :current-value="ergonomicsModifier"
      />
    </Tooltip>
    <Tooltip
      v-if="magazine.malfunctionPercentage !== 0
        || (comparisonMagazine?.malfunctionPercentage ?? 0 !== 0)"
      :tooltip="$t('caption.malfunctionPercentage')"
    >
      <div
        class="card-value"
        :class="StatsUtils.getSortedPropertyColorClass('malfunctionPercentage', filterAndSortingData)"
      >
        <font-awesome-icon
          icon="exclamation"
          class="icon-before-text"
        />
        <span :class="StatsUtils.getValueColorClass(magazine.malfunctionPercentage, true)">
          {{ StatsUtils.getStandardDisplayValue(DisplayValueType.malfunctionPercentage, magazine.malfunctionPercentage) }}
        </span>
      </div>
      <ValueComparison
        v-if="comparisonMagazine != null"
        :compare-to-value="comparisonMagazine?.malfunctionPercentage"
        :current-value="magazine.malfunctionPercentage"
        :is-percentage="true"
        :invert="true"
      />
    </Tooltip>
    <Tooltip
      v-if="magazine.loadSpeedModifierPercentage !== 0
        || (comparisonMagazine?.loadSpeedModifierPercentage ?? 0 !== 0)"
      :tooltip="$t('caption.loadSpeedModifierPercentage')"
    >
      <div
        class="card-value"
        :class="StatsUtils.getSortedPropertyColorClass('loadSpeedModifierPercentage', filterAndSortingData)"
      >
        <font-awesome-icon
          icon="sync-alt"
          class="icon-before-text"
        />
        <span :class="StatsUtils.getValueColorClass(magazine.loadSpeedModifierPercentage, true)">
          {{ StatsUtils.getStandardDisplayValue(DisplayValueType.loadSpeedModifierPercentage, magazine.loadSpeedModifierPercentage) }}
        </span>
      </div>
      <ValueComparison
        v-if="comparisonMagazine != null"
        :compare-to-value="comparisonMagazine?.loadSpeedModifierPercentage"
        :current-value="magazine.loadSpeedModifierPercentage"
        :is-percentage="true"
        :invert="true"
      />
    </Tooltip>
    <Tooltip
      v-if="magazine.checkSpeedModifierPercentage !== 0
        || (comparisonMagazine?.checkSpeedModifierPercentage ?? 0 !== 0)"
      :tooltip="$t('caption.checkSpeedModifierPercentage')"
    >
      <div
        class="card-value"
        :class="StatsUtils.getSortedPropertyColorClass('checkSpeedModifierPercentage', filterAndSortingData)"
      >
        <font-awesome-icon
          icon="eye"
          class="icon-before-text"
        />
        <span :class="StatsUtils.getValueColorClass(magazine.checkSpeedModifierPercentage, true)">
          {{ StatsUtils.getStandardDisplayValue(DisplayValueType.checkSpeedModifierPercentage, magazine.checkSpeedModifierPercentage) }}
        </span>
      </div>
      <ValueComparison
        v-if="comparisonMagazine != null"
        :compare-to-value="comparisonMagazine?.checkSpeedModifierPercentage"
        :current-value="magazine.checkSpeedModifierPercentage"
        :is-percentage="true"
        :invert="true"
      />
    </Tooltip>
  </div>
</template>