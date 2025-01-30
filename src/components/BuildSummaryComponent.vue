<script setup lang="ts">
import { computed } from 'vue'
import { IBuildSummary } from '../models/utils/IBuildSummary'
import StatsUtils, { DisplayValueType } from '../utils/StatsUtils'
import InventoryPrice from './InventoryPriceComponent.vue'
import Tooltip from './TooltipComponent.vue'

const props = withDefaults(
  defineProps<{
    isCompactMode: boolean,
    isLoading: boolean,
    isStickied?: boolean,
    summary: IBuildSummary,
  }>(),
  {
    isStickied: false
  })

const gridTemplateColumn = computed(() => `repeat(${[hasSummaryStats.value, hasSummaryArmor.value || hasSummaryWearableModifiers.value, hasSummaryPrice.value, hasSummaryWeight.value].filter(Boolean).length}, auto`)
const hasSummaryArmor = computed(() => props.summary.armorModifiers.armorClass !== 0)
const hasSummaryErgonomics = computed(() => props.summary.ergonomics !== 0)
const hasSummaryErgonomicsModifierPercentage = computed(() => props.summary.wearableModifiers.ergonomicsModifierPercentage !== 0)
const hasSummaryHorizontalRecoil = computed(() => props.summary.recoil.horizontalRecoil !== 0)
const hasSummaryMovementSpeedModifierPercentage = computed(() => props.summary.wearableModifiers.movementSpeedModifierPercentage !== 0)
const hasSummaryPrice = computed(() => props.summary.price.priceInMainCurrency !== 0)
const hasSummaryStats = computed(() => hasSummaryErgonomics.value || hasSummaryHorizontalRecoil.value || hasSummaryVerticalRecoil.value)
const hasSummaryTurningSpeedModifierPercentage = computed(() => props.summary.wearableModifiers.turningSpeedModifierPercentage !== 0)
const hasSummaryVerticalRecoil = computed(() => props.summary.recoil.verticalRecoil !== 0)
const hasSummaryWearableModifiers = computed(() => hasSummaryErgonomicsModifierPercentage.value
  || hasSummaryMovementSpeedModifierPercentage.value
  || hasSummaryTurningSpeedModifierPercentage.value
)
const hasSummaryWeight = computed(() => props.summary.weight !== 0)
</script>










<template>
  <div
    v-if="hasSummaryStats
      || hasSummaryArmor
      || hasSummaryWearableModifiers
      || hasSummaryWeight
      || hasSummaryPrice"
    v-show="!isLoading"
    :class="{
      'build-summary': !isCompactMode,
      'build-summary-compact': isCompactMode,
      'build-summary-stickied': isStickied
    }"
  >
    <div
      v-if="hasSummaryStats"
      class="build-summary-group"
    >
      <Tooltip
        v-if="hasSummaryVerticalRecoil"
        :tooltip="$t('caption.verticalRecoil')"
        class="build-summary-value"
      >
        <font-awesome-icon
          icon="arrows-alt-v"
          class="icon-before-text"
        />
        <span>{{ StatsUtils.getStandardDisplayValue(DisplayValueType.recoil, summary.recoil.verticalRecoil) }}</span>
      </Tooltip>
      <Tooltip
        v-if="hasSummaryVerticalRecoil"
        :tooltip="$t('caption.horizontalRecoil')"
        class="build-summary-value"
      >
        <font-awesome-icon
          icon="arrows-alt-h"
          class="icon-before-text"
        />
        <span>{{ StatsUtils.getStandardDisplayValue(DisplayValueType.recoil, summary.recoil.horizontalRecoil) }}</span>
      </Tooltip>
      <Tooltip
        v-if="hasSummaryErgonomics"
        :tooltip="$t('caption.ergonomics')"
        class="build-summary-value"
      >
        <font-awesome-icon
          icon="hand-paper"
          class="icon-before-text"
        />
        <span>{{ StatsUtils.getStandardDisplayValue(DisplayValueType.ergonomics, summary.ergonomics) }}</span>
        <span v-if="hasSummaryErgonomicsModifierPercentage">
          &nbsp;(<span :class="StatsUtils.getValueColorClass(summary.wearableModifiers.ergonomicsModifierPercentage)">
            {{ StatsUtils.getStandardDisplayValue(DisplayValueType.ergonomicsModifierPercentage, summary.wearableModifiers.ergonomicsModifierPercentage) }}
          </span>)
        </span>
      </Tooltip>
    </div>
    <div
      v-if="hasSummaryArmor || hasSummaryWearableModifiers"
      class="build-summary-group"
    >
      <Tooltip
        v-if="hasSummaryArmor"
        :tooltip="$t('caption.armorClass')"
        class="build-summary-value"
      >
        <font-awesome-icon
          icon="award"
          class="icon-before-text"
        />
        <span>{{ StatsUtils.getStandardDisplayValue(DisplayValueType.armorClass, summary.armorModifiers.armorClass) }}</span>
      </Tooltip>
      <Tooltip
        v-if="!hasSummaryErgonomics && hasSummaryErgonomicsModifierPercentage"
        :tooltip="$t('caption.ergonomicsModifierPercentage')"
        class="build-summary-value"
      >
        <font-awesome-icon
          icon="hand-paper"
          class="icon-before-text"
        />
        <span :class="StatsUtils.getValueColorClass(summary.wearableModifiers.ergonomicsModifierPercentage)">
          {{ StatsUtils.getStandardDisplayValue(DisplayValueType.ergonomicsModifierPercentage, summary.wearableModifiers.ergonomicsModifierPercentage) }}
        </span>
      </Tooltip>
      <Tooltip
        v-if="hasSummaryMovementSpeedModifierPercentage"
        :tooltip="$t('caption.movementSpeedModifierPercentage')"
        class="build-summary-value"
      >
        <font-awesome-icon
          icon="walking"
          class="icon-before-text"
        />
        <span :class="StatsUtils.getValueColorClass(summary.wearableModifiers.movementSpeedModifierPercentage)">
          {{ StatsUtils.getStandardDisplayValue(DisplayValueType.movementSpeedModifierPercentage, summary.wearableModifiers.movementSpeedModifierPercentage) }}
        </span>
      </Tooltip>
      <Tooltip
        v-if="hasSummaryTurningSpeedModifierPercentage"
        :tooltip="$t('caption.turningSpeedModifierPercentage')"
        class="build-summary-value"
      >
        <font-awesome-icon
          icon="undo"
          class="icon-before-text"
        />
        <span :class="StatsUtils.getValueColorClass(summary.wearableModifiers.turningSpeedModifierPercentage)">
          {{ StatsUtils.getStandardDisplayValue(DisplayValueType.turningSpeedModifierPercentage, summary.wearableModifiers.turningSpeedModifierPercentage) }}
        </span>
      </Tooltip>
    </div>
    <div
      v-if="hasSummaryPrice"
      class="build-summary-group"
    >
      <div
        v-if="hasSummaryPrice"
        class="build-summary-value"
      >
        <InventoryPrice
          v-if="
            !isLoading"
          :inventory-price="summary.price"
          :is-build="true"
        />
      </div>
    </div>
    <div
      v-if="hasSummaryWeight"
      class="build-summary-group"
    >
      <Tooltip
        v-if="hasSummaryWeight"
        :tooltip="$t('caption.weight')"
        class="build-summary-value"
      >
        <font-awesome-icon
          icon="weight-hanging"
          class="icon-before-text"
        />
        <span :class="StatsUtils.getWeightColorClass(summary.weight)">{{ StatsUtils.getStandardDisplayValue(DisplayValueType.weight, summary.weight) }}</span>
      </Tooltip>
    </div>
  </div>
</template>










<style scoped>
.build-summary {
  align-items: center;
  background-color: var(--surface-50);
  border-color: var(--primary-color3);
  border-radius: 6px;
  border-style: solid;
  border-width: 1px;
  display: grid;
  font-size: 1.5rem;
  gap: 3rem;
  grid-template-columns: v-bind(gridTemplateColumn);
  max-width: 100%;
  padding: 0.5rem;
}

.build-summary .icon-before-text {
  height: 1.5rem;
  width: 1.5rem;
}

.build-summary-compact {
  align-items: center;
  display: grid;
  font-weight: bolder;
  gap: 1rem;
  grid-template-columns: v-bind(gridTemplateColumn);
  max-width: 100%;
  padding: 0.5rem;
}

.build-summary-icon {
  margin-left: 0.25rem;
}

.build-summary-group {
  align-items: center;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  gap: 1rem;
  justify-content: center;
}

.build-summary-stickied {
  border-top-left-radius: 0;
  border-top-right-radius: 0;
  border-top-style: none;
}

.build-summary-value {
  align-items: center;
  display: flex;
  flex-wrap: nowrap;
  white-space: nowrap;
}

/* Smartphone in portrait */
@media only screen and (max-width: 480px) {
  .build-summary-compact {
    grid-template-columns: auto;
  }
}

/* Smartphone in landscape */
@media only screen and (min-width: 481px) and (max-width: 767px) {
  .build-summary-compact {
    grid-template-columns: auto auto;
  }
}

/* Tablet in portrait */
@media only screen and (min-width: 768px) and (max-width: 991px) {}

/* Tablet in landscape */
@media only screen and (min-width: 992px) and (max-width: 1299px) {}

/* PC */
@media only screen and (min-width: 1300px) {}
</style>