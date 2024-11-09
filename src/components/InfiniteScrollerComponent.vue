<script setup lang="ts">
import { useElementBounding } from '@vueuse/core'
import { computed, useTemplateRef } from 'vue'

const props = withDefaults(
  defineProps<{
    elementsPerLine: number,
    getKeyFunction: (item: unknown) => string,
    items: unknown[],
    minLinesAmount?: number
  }>(),
  {
    minLinesAmount: 1
  })

let _lastLineHeight: number = 0

const groupedItems = computed<unknown[]>(() => {
  const groups: unknown[][] = []

  for (let i = 0; i < props.items.length; i += props.elementsPerLine) {
    const group = props.items.slice(i, i + props.elementsPerLine)
    groups.push(group)
  }

  return groups
})
const lineHeight = computed(() => {
  if (lineBoundingBox.height.value > _lastLineHeight) {
    _lastLineHeight = lineBoundingBox.height.value
  }

  return _lastLineHeight
})
const minHeight = computed(() => {
  let height = lineHeight.value * minLinesAmountInternal.value

  if (height === 0) {
    // We need to have a height greater than 0 otherwise no line is displayed and we cannot
    // calculate the height of a line
    height = 1
  }

  return `${height}px`
})
const minLinesAmountInternal = computed(() => props.minLinesAmount > groupedItems.value.length ? groupedItems.value.length : props.minLinesAmount)
const gridTemplateColumns = computed(() => `repeat(${props.elementsPerLine}, 1fr)`)

const line = useTemplateRef('line')
const lineBoundingBox = useElementBounding(line)
</script>










<template>
  <VirtualScroller
    :items="groupedItems"
    :item-size="lineHeight"
    :style="`height: 100%; min-height: ${minHeight}; width: 100%;`"
  >
    <template #item="{ item }">
      <div
        ref="line"
        class="infinite-scroller-line"
      >
        <slot
          v-for="itemOfGroup of item"
          :key="getKeyFunction(itemOfGroup)"
          name="element"
          :element="itemOfGroup"
        />
      </div>
    </template>
  </VirtualScroller>
</template>










<style>
.infinite-scroller-line {
  display: grid;
  grid-template-columns: v-bind(gridTemplateColumns);
  gap: 1rem;
  margin-top: 1rem;
}

.infinite-scroller-line:first-child {
  margin-top: 0;
}
</style>