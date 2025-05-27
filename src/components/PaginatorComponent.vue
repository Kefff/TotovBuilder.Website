<script setup lang="ts">
import { useElementBounding, useScrollLock, useSwipe, UseSwipeDirection } from '@vueuse/core'
import { computed, nextTick, onMounted, ref, useTemplateRef, watch } from 'vue'
import WebBrowserUtils from '../utils/WebBrowserUtils'

const modelCurrentPage = defineModel<number>('currentPage', { default: 0 })

const props = withDefaults(
  defineProps<{
    autoScrollToFirstElementOfPage?: boolean,
    elementsPerLine?: number,
    getKeyFunction: (element: unknown) => string,
    elements: unknown[],
    linesPerPage?: number,
    scrollToIndex?: number
  }>(),
  {
    autoScrollToFirstElementOfPage: true,
    elementsPerLine: 1,
    linesPerPage: 1,
    scrollToIndex: undefined
  })

let _fixedLineHeight: number | undefined = undefined
const _swipeDeadzone = 50

const containerHeight = computed(() => {
  const lh = _fixedLineHeight ?? firstLineHeight.value
  const linesCount = displayedLines.value.length
  const gapsHeight = (linesCount - 1) * 14 // 1rem per between each line
  const ch = lh * linesCount + gapsHeight

  return `${ch}px`
})
const displayedLines = computed<unknown[][]>(() => {
  let last = first.value + props.linesPerPage
  const lines = groupedElements.value.slice(first.value, last)

  return lines
})
const first = computed(() => modelCurrentPage.value * props.linesPerPage)
const firstLine = computed(() => lines.value?.[0])
const gridTemplateColumns = computed(() => `repeat(${props.elementsPerLine}, 1fr)`)
const groupedElements = computed<unknown[][]>(() => {
  const groups: unknown[][] = []

  for (let i = 0; i < props.elements.length; i += props.elementsPerLine) {
    const group = props.elements.slice(i, i + props.elementsPerLine)
    groups.push(group)
  }

  return groups
})
const hasMultiplePages = computed(() => props.elements.length > (props.elementsPerLine * props.linesPerPage))
const { isSmartphonePortrait: isCompactMode } = WebBrowserUtils.getScreenSize()
const pageLinksCount = computed(() => isCompactMode.value ? 3 : 5)
const lastPageIndex = computed(() => {
  if (groupedElements.value.length < props.linesPerPage) {
    return 0
  }

  let lpi = Math.floor(groupedElements.value.length / props.linesPerPage) - (groupedElements.value.length % props.linesPerPage === 0 ? 1 : 0)

  return lpi
})
const swipeBlock = computed(() => _swipeDeadzone / 2)
const swipeChangeTrigger = computed(() => _swipeDeadzone * 3)
const swipeMaxLeft = computed(() => modelCurrentPage.value === 0 ? swipeBlock.value : undefined)
const swipeMinLeft = computed(() => modelCurrentPage.value === lastPageIndex.value ? -swipeBlock.value : undefined)
const transitionEnterFromTranslate = computed(() => previousPageIndex.value < modelCurrentPage.value ? 'translateX(100vw)' : 'translateX(-100vw)')
const transitionLeaveToTranslate = computed(() => previousPageIndex.value < modelCurrentPage.value ? 'translateX(-100vw)' : 'translateX(100vw)')

const isScrollLocked = useScrollLock(document.getElementById('app'))
const leftPosition = ref('0')
const lines = useTemplateRef<HTMLDivElement[]>('lines')
const paginator = useTemplateRef('paginator')
const { height: firstLineHeight } = useElementBounding(firstLine)
const { direction: swipeDirection, isSwiping, lengthX: swipeLength } = useSwipe(
  paginator,
  {
    onSwipe,
    onSwipeEnd,
    threshold: _swipeDeadzone
  })
const previousPageIndex = ref(-1)

watch(() => props.elements, () => scrollToElement(props.scrollToIndex))

onMounted(() => {
  if (modelCurrentPage.value > lastPageIndex.value) {
    // Can happend when deleting the last build from the last page.
    // Returning immediatly because the page will change and already trigger a scroll to top
    modelCurrentPage.value = lastPageIndex.value

    return
  }

  scrollToElement(props.scrollToIndex)
})

/**
 * Reacts to the paginator current page being changed.
 */
function onPageChange(newPage: number): void {
  if (_fixedLineHeight == null) {
    _fixedLineHeight = firstLineHeight.value
  }

  previousPageIndex.value = modelCurrentPage.value
  modelCurrentPage.value = newPage

  setTimeout(() => scrollToElement(), 500) // Wait a little before scrolling otherwise it creates a weird effect when swiping
}

/**
 * React to the inventory slot being swipped.
 *
 * Positions the inventory slot according to the swipe movement.
 */
function onSwipe(): void {
  if (swipeDirection.value !== 'left' && swipeDirection.value !== 'right') {
    return
  }

  isScrollLocked.value = true
  let left = Math.max(Math.abs(swipeLength.value) - _swipeDeadzone, 0)

  if (swipeDirection.value === 'left') {
    left = -left

    if (swipeMinLeft.value != null && left < swipeMinLeft.value) {
      left = swipeMinLeft.value
    }
  } else if (swipeMaxLeft.value != null && left > swipeMaxLeft.value) {
    left = swipeMaxLeft.value
  }

  leftPosition.value = `${left}px`
}

/**
 * React to the swip action on the inventory slot stopping.
 *
 * Repositions the inventory slot at its original place or trigger the inventory slot change.
 */
function onSwipeEnd(e: TouchEvent, direction: UseSwipeDirection): void {
  if (direction === 'left'
    && modelCurrentPage.value < lastPageIndex.value
    && (swipeLength.value - _swipeDeadzone) > swipeChangeTrigger.value) {
    leftPosition.value = '0'
    onPageChange(modelCurrentPage.value + 1)
  } else if (direction === 'right'
    && modelCurrentPage.value > 0
    && (swipeLength.value + _swipeDeadzone) < -swipeChangeTrigger.value) {
    leftPosition.value = '0'
    onPageChange(modelCurrentPage.value - 1)
  } else {
    leftPosition.value = '0'
  }

  isScrollLocked.value = false
}

/**
 * Changes the page if necessary and scrolls to an element.
 * @param elementIndex - Index of the element to scroll to. First element of the current page when undefined.
 */
function scrollToElement(elementIndex?: number): void {
  if (elementIndex == null && !props.autoScrollToFirstElementOfPage) {
    return
  }

  let lineIndex: number
  const elementsPerPage = props.elementsPerLine * props.linesPerPage

  if (elementIndex == null || elementIndex < 0) {
    lineIndex = 0
  } else {
    const page = Math.floor(elementIndex / elementsPerPage)
    const indexInPage = elementIndex - (page * elementsPerPage)
    lineIndex = Math.floor(indexInPage / props.elementsPerLine)

    if (page !== modelCurrentPage.value) {
      onPageChange(page)
    }
  }

  nextTick(() => { // Required for the scroll to triggered after initialization / changing page
    const line = document.getElementsByClassName('paginator-line')[lineIndex]

    if (line != null) {
      line.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
    }
  })
}
</script>










<template>
  <div>
    <div class="paginator-container">
      <TransitionGroup name="paginator-page-transition">
        <div
          :key="modelCurrentPage"
          ref="paginator"
          class="paginator"
          :class="{ 'paginator-animated': !isSwiping }"
        >
          <div
            v-for="(line, index) of displayedLines"
            :key="index"
            ref="lines"
            class="paginator-line"
          >
            <slot
              v-for="element of line"
              :key="getKeyFunction(element)"
              name="element"
              :element="element"
            />
          </div>
        </div>
      </TransitionGroup>
    </div>
    <div
      v-if="hasMultiplePages"
      class="paginator-pages"
    >
      <Paginator
        v-model:first="first"
        :rows="linesPerPage"
        :total-records="groupedElements.length"
        :page-link-size="pageLinksCount"
        template="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink JumpToPageDropdown"
        @page="onPageChange($event.page)"
      />
    </div>
  </div>
</template>










<style scoped>
.paginator {
  display: flex;
  flex-direction: column;
  justify-content: center;
  left: v-bind(leftPosition);
  position: absolute;
  width: 100%;
}

.paginator-animated {
  transition: all 0.2s ease-in-out;
}

.paginator-container {
  height: v-bind(containerHeight);
  overflow-x: hidden;
  position: relative;
  width: 100%;
}

.paginator-line {
  display: grid;
  gap: 1rem;
  grid-template-columns: v-bind(gridTemplateColumns);
  margin-top: 1rem;
  width: 100%;
}

.paginator-line:first-child {
  margin-top: 0;
}

.paginator-page {
  cursor: pointer;
}

.paginator-page-transition-enter-active {
  transition: all 0.25s 0.25s ease;
}

.paginator-page-transition-leave-active {
  position: absolute;
  transition: all 0.25s ease;
}

.paginator-page-transition-enter-from {
  opacity: 0;
  transform: v-bind(transitionEnterFromTranslate);
}

.paginator-page-transition-leave-to {
  opacity: 0;
  transform: v-bind(transitionLeaveToTranslate);
}

.paginator-pages {
  display: flex;
  justify-content: center;
  margin-top: 0.5rem;
  width: 100%;
}

.paginator-pages > nav {
  width: 100%;
}
</style>

<style>
.paginator-pages nav .p-paginator {
  padding: 0.25rem;
}

.paginator-pages nav .p-paginator .p-paginator-page-options {
  align-items: center;
  border-color: var(--primary-color6);
  display: flex;
  height: 2rem;
}

.paginator-pages nav .p-paginator .p-paginator-page-options .p-dropdown-label {
  color: var(--util-color7);
  padding-left: 0.5rem;
  padding-right: 0.5rem;
}
</style>