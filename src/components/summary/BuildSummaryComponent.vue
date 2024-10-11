<script setup lang="ts">
import { computed, ref } from 'vue'
import { IBuildSummary } from '../../models/utils/IBuildSummary'
import StatsUtils, { DisplayValueType } from '../../utils/StatsUtils'
import InventoryPrice from '../InventoryPriceComponent.vue'
import Sticky from '../StickyComponent.vue'
import Tooltip from '../TooltipComponent.vue'

const props = defineProps<{
  elementToStickTo: HTMLElement,
  isLoading: boolean,
  summary: IBuildSummary,
}>()

const isBuildSummaryStickied = ref(false)

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
  <Sticky
    v-model:is-stickied="isBuildSummaryStickied"
    align="center"
    :element-to-stick-to="elementToStickTo"
    class="build-summary-container"
  >
    <div
      v-show="!isLoading"
      class="build-summary"
      :class="isBuildSummaryStickied ? 'build-summary-stickied' : undefined"
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
        v-if="hasSummaryPrice || hasSummaryWeight"
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
  </Sticky>
</template>










<style scoped>
@import '../../css/icon.css';
@import '../../css/stats.css';

.build-summary {
  align-items: center;
  background-color: var(--surface-50);
  border-color: var(--primary-color6);
  border-radius: 6px;
  border-style: solid;
  border-width: 1px;
  display: flex;
  font-size: 1.5rem;
  font-weight: bold;
  max-width: 100%;
  padding: 0.5rem;
}

.build-summary-container {
  margin-bottom: 1rem;
  margin-top: 1rem;
}

.build-summary-group {
  align-items: center;
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  margin-right: 2rem;
}

.build-summary-group:last-child {
  margin-right: 0;
}

.build-summary-icon {
  margin-left: 0.25rem;
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
  margin-right: 1rem;
  white-space: nowrap;
}

.build-summary-value .icon-before-text {
  height: 1.5rem;
  width: 1.5rem;
}

.build-summary-value:last-child {
  margin-right: 0;
}
</style>