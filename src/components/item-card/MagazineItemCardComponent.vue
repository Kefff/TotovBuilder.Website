<script setup lang="ts">
import { computed } from 'vue'
import { IItem } from '../../models/item/IItem'
import { IMagazine } from '../../models/item/IMagazine'
import StatsUtils, { DisplayValueType } from '../../utils/StatsUtils'
import Tooltip from '../TooltipComponent.vue'
import ContainerItemCard from './ContainerItemCardComponent.vue'

const props = defineProps<{ item: IItem }>()

const ergonomicsModifier = computed(() => magazine.value.presetErgonomicsModifier ?? magazine.value.ergonomicsModifier)
const magazine = computed(() => props.item as IMagazine)
</script>










<template>
  <ContainerItemCard :item="magazine" />
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
      v-if="magazine.loadSpeedModifierPercentage !== 0"
      :tooltip="$t('caption.loadSpeed')"
    >
      <font-awesome-icon
        icon="sync-alt"
        class="icon-before-text"
      />
      <span :class="StatsUtils.getValueColorClass(magazine.loadSpeedModifierPercentage, true)">
        {{ StatsUtils.getStandardDisplayValue(DisplayValueType.loadSpeedModifierPercentage, magazine.loadSpeedModifierPercentage) }}
      </span>
    </Tooltip>
    <Tooltip
      v-if="magazine.checkSpeedModifierPercentage !== 0"
      :tooltip="$t('caption.checkSpeed')"
    >
      <font-awesome-icon
        icon="eye"
        class="icon-before-text"
      />
      <span :class="StatsUtils.getValueColorClass(magazine.checkSpeedModifierPercentage, true)">
        {{ StatsUtils.getStandardDisplayValue(DisplayValueType.checkSpeedModifierPercentage, magazine.checkSpeedModifierPercentage) }}
      </span>
    </Tooltip>
  </div>
</template>