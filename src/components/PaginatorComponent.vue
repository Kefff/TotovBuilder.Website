<script setup lang="ts">
import { useBreakpoints } from '@vueuse/core'
import { PageState } from 'primevue/paginator'
import { computed, nextTick, ref } from 'vue'
import WebBrowserUtils from '../utils/WebBrowserUtils'

const props = withDefaults(
  defineProps<{
    elementsPerLine?: number,
    getKeyFunction: (element: unknown) => string,
    elements: unknown[],
    linesPerPage?: number
  }>(),
  {
    elementsPerLine: 1,
    linesPerPage: 1
  })

const breakpoints = useBreakpoints(WebBrowserUtils.breakpoints)
const displayedLines = computed<unknown[][]>(() => {
  const start = currentPage.value * props.linesPerPage
  let end = start + props.linesPerPage
  const lines = groupedElements.value.slice(start, end)

  return lines
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
const hasMultiplePages = computed(() => props.elements.length > (props.elementsPerLine * props.linesPerPage))
const isCompactMode = breakpoints.smaller('smartphoneLandscape')
const pageLinksCount = computed(() => isCompactMode.value ? 3 : 5)

const currentPage = ref(0)

/**
 * Reacts to the paginator current page being changed.
 */
function onPageChange(state: PageState): void {
  currentPage.value = state.page

  nextTick(() => {
    const firstLine = document.getElementsByClassName('paginator-line')[0]
    firstLine.scrollIntoView({ behavior: 'smooth', block: 'center' })
  })
}
</script>










<template>
  <div class="paginator">
    <div
      v-for="(line, index) of displayedLines"
      :key="index"
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
  <div
    v-if="hasMultiplePages"
    class="paginator-pages"
  >
    <Paginator
      :rows="linesPerPage"
      :total-records="groupedElements.length"
      :page-link-size="pageLinksCount"
      template="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink JumpToPageDropdown"
      @page="onPageChange"
    />
  </div>
</template>










<style>
.paginator {
  height: 100%;
  width: 100%;
  display: flex;
  justify-content: center;
  flex-direction: column;
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

.paginator-pages {
  display: flex;
  justify-content: center;
  margin-top: 0.5rem;
  width: 100%;
}

.paginator-pages > nav {
  width: 100%;
}

.paginator-pages nav .p-paginator {
  padding: 0.25rem
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