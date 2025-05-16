<script setup lang="ts">
import { round } from 'round-ts'
import { computed } from 'vue'
import StatsUtils from '../utils/StatsUtils'

const props = withDefaults(
  defineProps<{
    compareToValue: number | undefined,
    currentValue: number | undefined,
    fixedDecimalCount?: number
    invert?: boolean,
    isPercentage?: boolean,
    roundDecimalCount?: number
  }>(),
  {
    fixedDecimalCount: undefined,
    invert: false,
    isPercentage: false,
    roundDecimalCount: 0,
    suffix: undefined
  })

const currentValueInternal = computed(() => props.currentValue ?? 0)
const compareToValueInternal = computed(() => props.compareToValue ?? 0)
const comparisonValue = computed(() => round((currentValueInternal.value - compareToValueInternal.value) * (props.isPercentage ? 100 : 1), props.roundDecimalCount))
const displayValue = computed(() => StatsUtils.getDisplayValue(comparisonValue.value, true, props.roundDecimalCount, props.fixedDecimalCount))
const valueClass = computed(() => StatsUtils.getValueColorClass(comparisonValue.value, props.invert))
</script>










<template>
  <div
    v-if="compareToValue !== 0 && comparisonValue !== 0"
    class="value-comparison"
  >
    <span>(</span>
    <div
      class="value-comparison-value"
      :class="valueClass"
    >
      <slot name="prefix" />
      <span>{{ displayValue }}</span>
      <slot name="suffix" />
    </div>
    <span>)</span>
  </div>
</template>










<style scoped>
.value-comparison {
  color: var(--text-color);
  font-size: 0.75rem;
  font-weight: normal;
  height: 1rem;
  margin-left: 0.25rem;
  white-space: nowrap;
}

.value-comparison {
  align-items: center;
  display: flex;
}
</style>