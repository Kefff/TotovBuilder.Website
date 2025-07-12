<script setup lang="ts">
import VirtualScroller from 'primevue/virtualscroller'
import { computed, nextTick, onMounted, ref, useTemplateRef, watch } from 'vue'

const props = withDefaults(
  defineProps<{
    autoScrollToFirstElement?: boolean,
    elementsPerLine?: number,
    getKeyFunction: (element: unknown) => string,
    elements: unknown[],
    elementHeight: number,
    maxLinesAmount?: number,
    scrollToIndex?: number
  }>(),
  {
    autoScrollToFirstElement: true,
    elementsPerLine: 1,
    maxLinesAmount: undefined,
    scrollToIndex: undefined
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
const isLoading = ref(true)
const virtualScroller = useTemplateRef<VirtualScroller>('virtualScroller')

onMounted(() => initializeDisplayedElements())

watch(() => props.elements, () => initializeDisplayedElements())

/**
 * Initializes the list of displayed elements.
 */
function initializeDisplayedElements(): void {
  isLoading.value = true
  displayedElementGroups.value = Array.from({ length: groupedElements.value.length })

  nextTick(() => {
    isLoading.value = false
    scrollToElement(props.scrollToIndex)
  })
}

/**
 * Scrolls to an element.
 * @param elementIndex - Index of the element to scroll to. First element when undefined.
 */
function scrollToElement(elementIndex?: number): void {
  if (!props.autoScrollToFirstElement) {
    return
  }

  nextTick(() => { // Required for the scroll to triggered after initialization
    if (elementIndex == null || elementIndex < 0) {
      elementIndex = 0
    }

    const lineIndex = Math.floor(elementIndex / props.elementsPerLine)
    virtualScroller.value?.scrollToIndex(lineIndex, 'smooth')
  })
}
</script>










<template>
  <VirtualScroller
    ref="virtualScroller"
    :item-size="elementHeight"
    :items="groupedElements"
    :show-loader="true"
    :loading="isLoading"
    class="infinite-scroller"
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










<style scoped>
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
  margin-top: 0.5rem;
  overflow: hidden;
  width: 100%;
}

.infinite-scroller-line:first-child {
  margin-top: 0;
}
</style>