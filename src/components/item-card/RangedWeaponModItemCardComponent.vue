<script setup lang="ts">
import { computed } from 'vue'
import { IItem } from '../../models/item/IItem'
import { IRangedWeaponMod } from '../../models/item/IRangedWeaponMod'
import StatsUtils, { DisplayValueType } from '../../utils/StatsUtils'
import Tooltip from '../TooltipComponent.vue'

const props = defineProps<{ item: IItem }>()

const ergonomicsModifier = computed(() => rangedWeaponMod.value.presetErgonomicsModifier ?? rangedWeaponMod.value.ergonomicsModifier)
const rangedWeaponMod = computed(() => props.item as IRangedWeaponMod)
</script>










<template>
  <div class="card-line">
    <Tooltip
      v-if="ergonomicsModifier !== 0"
      :tooltip="$t('caption.ergonomics')"
    >
      <font-awesome-icon
        icon="hand-paper"
        class="icon-before-text"
      />
      <span :class="StatsUtils.getValueColorClass(ergonomicsModifier)">
        {{ StatsUtils.getStandardDisplayValue(DisplayValueType.ergonomicsModifier, ergonomicsModifier) }}
      </span>
    </Tooltip>
    <Tooltip
      v-if="rangedWeaponMod.recoilModifierPercentage !== 0"
      :tooltip="$t('caption.recoil')"
    >
      <font-awesome-icon
        icon="arrows-alt"
        class="icon-before-text"
      />
      <span :class="StatsUtils.getValueColorClass(rangedWeaponMod.recoilModifierPercentage, true)">
        {{ StatsUtils.getStandardDisplayValue(DisplayValueType.recoilModifierPercentage, rangedWeaponMod.recoilModifierPercentage) }}
      </span>
    </Tooltip>
    <Tooltip
      v-if="rangedWeaponMod.accuracyModifierPercentage !== 0"
      :tooltip="$t('caption.accuracy')"
    >
      <font-awesome-icon
        icon="bullseye"
        class="icon-before-text"
      />
      <span :class="StatsUtils.getValueColorClass(rangedWeaponMod.accuracyModifierPercentage)">
        {{ StatsUtils.getStandardDisplayValue(DisplayValueType.accuracyModifierPercentage, rangedWeaponMod.accuracyModifierPercentage) }}
      </span>
    </Tooltip>
  </div>
</template>