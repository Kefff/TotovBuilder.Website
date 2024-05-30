<template>
  <div
    v-if="ergonomicsModifier !== 0 || showEmptyEntries"
    class="option-entry"
  >
    <div
      v-tooltip.top="$t('caption.ergonomics')"
      class="option-value"
    >
      <div v-if="ergonomicsModifier !== 0">
        <span :class="StatsUtils.getValueColorClass(ergonomicsModifier)">
          {{ StatsUtils.getStandardDisplayValue(DisplayValueType.ergonomicsModifier, ergonomicsModifier) }}
        </span>
        <font-awesome-icon
          icon="hand-paper"
          class="icon-after-text"
        />
      </div>
    </div>
  </div>
  <div
    v-if="rangedWeaponMod.recoilModifierPercentage !== 0 || showEmptyEntries"
    class="option-entry"
  >
    <div
      v-tooltip.top="$t('caption.recoil')"
      class="option-value"
    >
      <div v-if="rangedWeaponMod.recoilModifierPercentage !== 0">
        <span :class="StatsUtils.getValueColorClass(rangedWeaponMod.recoilModifierPercentage, true)">
          {{ StatsUtils.getStandardDisplayValue(DisplayValueType.recoilModifierPercentage, rangedWeaponMod.recoilModifierPercentage) }}
        </span>
        <font-awesome-icon
          icon="arrows-alt"
          class="icon-after-text"
        />
      </div>
    </div>
  </div>
  <div
    v-if="rangedWeaponMod.accuracyModifierPercentage !== 0 || showEmptyEntries"
    class="option-entry"
  >
    <div
      v-tooltip.top="$t('caption.accuracy')"
      class="option-value"
    >
      <div v-if="rangedWeaponMod.accuracyModifierPercentage !== 0">
        <span :class="StatsUtils.getValueColorClass(rangedWeaponMod.accuracyModifierPercentage)">
          {{ StatsUtils.getStandardDisplayValue(DisplayValueType.accuracyModifierPercentage, rangedWeaponMod.accuracyModifierPercentage) }}
        </span>
        <font-awesome-icon
          icon="bullseye"
          class="icon-after-text"
        />
      </div>
    </div>
  </div>
</template>










<script setup lang="ts">
import { computed } from 'vue'
import { IItem } from '../../models/item/IItem'
import { IRangedWeaponMod } from '../../models/item/IRangedWeaponMod'
import StatsUtils, { DisplayValueType } from '../../utils/StatsUtils'

const props = withDefaults(
  defineProps<{
    item: IItem,
    showEmptyEntries?: boolean
  }>(),
  {
    showEmptyEntries: true
  })

const ergonomicsModifier = computed(() => rangedWeaponMod.value.presetErgonomicsModifier ?? rangedWeaponMod.value.ergonomicsModifier)
const rangedWeaponMod = computed(() => props.item as IRangedWeaponMod)
</script>










<style scoped>
@import '../../css/icon.css';
@import '../../css/option.css';
@import '../../css/stats.css';
</style>