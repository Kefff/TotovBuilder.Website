<script setup lang="ts">
import { computed } from 'vue'
import { IItem } from '../../models/item/IItem'
import { IRangedWeaponMod } from '../../models/item/IRangedWeaponMod'
import StatsUtils, { DisplayValueType } from '../../utils/StatsUtils'
import Tooltip from '../TooltipComponent.vue'

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










<template>
  <div
    v-if="ergonomicsModifier !== 0 || showEmptyEntries"
    class="option-entry"
  >
    <div class="option-value">
      <div v-if="ergonomicsModifier !== 0">
        <Tooltip :tooltip="$t('caption.ergonomics')">
          <font-awesome-icon
            icon="hand-paper"
            class="icon-before-text"
          />
          <span :class="StatsUtils.getValueColorClass(ergonomicsModifier)">
            {{ StatsUtils.getStandardDisplayValue(DisplayValueType.ergonomicsModifier, ergonomicsModifier) }}
          </span>
        </Tooltip>
      </div>
    </div>
  </div>
  <div
    v-if="rangedWeaponMod.recoilModifierPercentage !== 0 || showEmptyEntries"
    class="option-entry"
  >
    <div class="option-value">
      <div v-if="rangedWeaponMod.recoilModifierPercentage !== 0">
        <Tooltip :tooltip="$t('caption.recoil')">
          <font-awesome-icon
            icon="arrows-alt"
            class="icon-before-text"
          />
          <span :class="StatsUtils.getValueColorClass(rangedWeaponMod.recoilModifierPercentage, true)">
            {{ StatsUtils.getStandardDisplayValue(DisplayValueType.recoilModifierPercentage, rangedWeaponMod.recoilModifierPercentage) }}
          </span>
        </Tooltip>
      </div>
    </div>
  </div>
  <div
    v-if="rangedWeaponMod.accuracyModifierPercentage !== 0 || showEmptyEntries"
    class="option-entry"
  >
    <div class="option-value">
      <div v-if="rangedWeaponMod.accuracyModifierPercentage !== 0">
        <Tooltip :tooltip="$t('caption.accuracy')">
          <font-awesome-icon
            icon="bullseye"
            class="icon-before-text"
          />
          <span :class="StatsUtils.getValueColorClass(rangedWeaponMod.accuracyModifierPercentage)">
            {{ StatsUtils.getStandardDisplayValue(DisplayValueType.accuracyModifierPercentage, rangedWeaponMod.accuracyModifierPercentage) }}
          </span>
        </Tooltip>
      </div>
    </div>
  </div>
</template>