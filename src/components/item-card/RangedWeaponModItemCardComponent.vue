<script setup lang="ts">
import { computed } from 'vue'
import { IItem } from '../../models/item/IItem'
import { IRangedWeaponMod } from '../../models/item/IRangedWeaponMod'
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

const comparisonRangedWeaponMod = computed(() =>
  props.comparisonItem != null
    && _itemPropertiesService.isRangedWeaponMod(props.comparisonItem)
    && props.comparisonItem?.id !== props.item.id
    ? props.comparisonItem as IRangedWeaponMod
    : undefined)
const comparisonRangedWeaponErgonomicsModifier = computed(() => comparisonRangedWeaponMod.value?.presetErgonomicsModifier ?? comparisonRangedWeaponMod.value?.ergonomicsModifier)
const comparisonRangedWeaponRecoilModifierPercentage = computed(() => comparisonRangedWeaponMod.value?.presetRecoilModifierPercentage ?? comparisonRangedWeaponMod.value?.recoilModifierPercentage)
const ergonomicsModifier = computed(() => rangedWeaponMod.value.presetErgonomicsModifier ?? rangedWeaponMod.value.ergonomicsModifier)
const rangedWeaponMod = computed(() => props.item as IRangedWeaponMod)
const recoilModifierPercentage = computed(() => rangedWeaponMod.value.presetRecoilModifierPercentage ?? rangedWeaponMod.value.recoilModifierPercentage)

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
        || (comparisonRangedWeaponErgonomicsModifier ?? 0 !== 0)"
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
        v-if="comparisonRangedWeaponMod != null"
        :compare-to-value="comparisonRangedWeaponErgonomicsModifier"
        :current-value="rangedWeaponMod.ergonomicsModifier"
      />
    </Tooltip>
    <Tooltip
      v-if="recoilModifierPercentage !== 0
        || (comparisonRangedWeaponRecoilModifierPercentage ?? 0 !== 0)"
      :tooltip="$t('caption.recoilModifierPercentage')"
    >
      <div
        class="card-value"
        :class="StatsUtils.getSortedPropertyColorClass('recoilModifierPercentage', filterAndSortingData)"
      >
        <font-awesome-icon
          icon="arrows-alt"
          class="icon-before-text"
        />
        <span :class="StatsUtils.getValueColorClass(recoilModifierPercentage, true)">
          {{ StatsUtils.getStandardDisplayValue(DisplayValueType.recoilModifierPercentage, recoilModifierPercentage) }}
        </span>
      </div>
      <ValueComparison
        v-if="comparisonRangedWeaponMod != null"
        :compare-to-value="comparisonRangedWeaponRecoilModifierPercentage"
        :current-value="rangedWeaponMod.recoilModifierPercentage"
        :invert="true"
        :is-percentage="true"
      />
    </Tooltip>
    <Tooltip
      v-if="rangedWeaponMod.accuracyModifierPercentage !== 0
        || (comparisonRangedWeaponMod?.accuracyModifierPercentage ?? 0 !== 0)"
      :tooltip="$t('caption.accuracyModifierPercentage')"
    >
      <div
        class="card-value"
        :class="StatsUtils.getSortedPropertyColorClass('accuracyModifierPercentage', filterAndSortingData)"
      >
        <font-awesome-icon
          icon="bullseye"
          class="icon-before-text"
        />
        <span :class="StatsUtils.getValueColorClass(rangedWeaponMod.accuracyModifierPercentage)">
          {{ StatsUtils.getStandardDisplayValue(DisplayValueType.accuracyModifierPercentage, rangedWeaponMod.accuracyModifierPercentage) }}
        </span>
      </div>
      <ValueComparison
        v-if="comparisonRangedWeaponMod != null"
        :compare-to-value="comparisonRangedWeaponMod?.accuracyModifierPercentage"
        :current-value="rangedWeaponMod.accuracyModifierPercentage"
        :is-percentage="true"
      />
    </Tooltip>
  </div>
</template>