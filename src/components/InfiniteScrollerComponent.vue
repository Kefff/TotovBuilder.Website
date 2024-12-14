<script setup lang="ts">
import { VirtualScrollerLazyEvent } from 'primevue/virtualscroller'
import { computed, nextTick, onMounted, ref, watch } from 'vue'

const props = withDefaults(
  defineProps<{
    elementsPerLine?: number,
    getKeyFunction: (element: unknown) => string,
    elements: unknown[],
    elementHeight: number,
    maxLinesAmount?: number
  }>(),
  {
    elementsPerLine: 1,
    maxLinesAmount: undefined
  })

const gridTemplateColumns = computed(() => `repeat(${props.elementsPerLine}, 1fr)`)
const groupedElements = computed<unknown[][]>(() => {
  const groups: unknown[][] = []

  for (let i = 0; i < props.elements.length; i += props.elementsPerLine) {
    const group = props.elements.slice(i, i + props.elementsPerLine)
    groups.push(group)
  }

  return groups
})
const lineHeight = computed(() => `${props.elementHeight}px`)
const maxHeight = computed(() => {
  if (props.maxLinesAmount == null) {
    return '100%'
  }

  let height = props.maxLinesAmount * props.elementHeight

  return `${height}px`
})
const minHeight = computed(() => `${props.elementHeight}px`)

const displayedElementGroups = ref<unknown[][]>([])
const isInitialized = ref(false)
const isLoading = ref(false)

watch(() => props.elements, () => initializeDisplayedElements())

onMounted(() => initializeDisplayedElements())

/**
 * Initializes the list of displayed elements.
 */
function initializeDisplayedElements(): void {
  isInitialized.value = false
  displayedElementGroups.value = Array.from({ length: groupedElements.value.length })

  nextTick(() => {
    isInitialized.value = true
    scrollToFirstLine()
  })
}

/**
 * Reacts to a lazy load event of the virtual scroller.
 *
 * Adds to the list of displayed items the items corresponding to the lazy loadingevent.
 */
function onLazyLoad(event: VirtualScrollerLazyEvent): void {
  let first = event.first
  let last = event.last

  if (event.last > groupedElements.value.length) {
    last = groupedElements.value.length - 1
  }

  isLoading.value = true

  const nextLines = groupedElements.value.slice(first, last + 1)
  const take = last - first
  let newDisplayedElementGroups = [...displayedElementGroups.value]

  for (let i = 0; i < take; i++) {
    newDisplayedElementGroups[first + i] = nextLines[i]
  }

  displayedElementGroups.value = newDisplayedElementGroups

  isLoading.value = false
}

/**
 * Scrolls to the first line.
 */
function scrollToFirstLine(): void {
  const firstLine = document.getElementsByClassName('infinite-scroller-line')[0]

  if (firstLine != null) {
    firstLine.scrollIntoView({ behavior: 'smooth', block: 'center' })
  }
}
</script>










<template>
  <VirtualScroller
    v-if="isInitialized"
    :item-size="elementHeight"
    :items="displayedElementGroups"
    :lazy="true"
    :loading="isLoading"
    :show-loader="true"
    class="infinite-scroller"
    @lazy-load="onLazyLoad"
  >
    <template #item="{ item }">
      <div class="infinite-scroller-line">
        <slot
          v-for="element of item"
          :key="getKeyFunction(element)"
          name="element"
          :element="element"
        />
      </div>
    </template>
  </VirtualScroller>
</template>










<style>
.infinite-scroller {
  height: 100% !important;
  max-height: v-bind(maxHeight) !important;
  min-height: v-bind(minHeight) !important;
  width: 100% !important;
}

.infinite-scroller-line {
  display: grid;
  gap: 1rem;
  grid-template-columns: v-bind(gridTemplateColumns);
  height: v-bind(lineHeight);
  margin-top: 1rem;
  overflow: hidden;
  width: 100%;
}

.infinite-scroller-line:first-child {
  margin-top: 0;
}
</style>