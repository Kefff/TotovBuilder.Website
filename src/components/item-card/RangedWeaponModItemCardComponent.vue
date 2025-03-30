<script setup lang="ts">
import { computed } from 'vue'
import { IItem } from '../../models/item/IItem'
import { IRangedWeaponMod } from '../../models/item/IRangedWeaponMod'
import ItemFilterAndSortingData from '../../models/utils/ItemFilterAndSortingData'
import StatsUtils, { DisplayValueType } from '../../utils/StatsUtils'
import Tooltip from '../TooltipComponent.vue'

const props = withDefaults(
  defineProps<{
    displayEmptyLines?: boolean,
    filterAndSortingData?: ItemFilterAndSortingData,
    item: IItem
  }>(),
  {
    displayEmptyLines: true,
    filterAndSortingData: undefined
  })

const ergonomicsModifier = computed(() => rangedWeaponMod.value.presetErgonomicsModifier ?? rangedWeaponMod.value.ergonomicsModifier)
const rangedWeaponMod = computed(() => props.item as IRangedWeaponMod)
</script>










<template>
  <div
    v-if="displayEmptyLines
      || ergonomicsModifier !== 0
      || rangedWeaponMod.recoilModifierPercentage !== 0
      || rangedWeaponMod.accuracyModifierPercentage !== 0"
    class="card-line card-line4"
  >
    <Tooltip
      v-if="ergonomicsModifier !== 0"
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
    </Tooltip>
    <Tooltip
      v-if="rangedWeaponMod.recoilModifierPercentage !== 0"
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
        <span :class="StatsUtils.getValueColorClass(rangedWeaponMod.recoilModifierPercentage, true)">
          {{ StatsUtils.getStandardDisplayValue(DisplayValueType.recoilModifierPercentage, rangedWeaponMod.recoilModifierPercentage) }}
        </span>
      </div>
    </Tooltip>
    <Tooltip
      v-if="rangedWeaponMod.accuracyModifierPercentage !== 0"
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
    </Tooltip>
  </div>
</template>