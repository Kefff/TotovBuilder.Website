<script setup lang="ts">
import { useBreakpoints } from '@vueuse/core'
import { computed, onMounted, ref, watch } from 'vue'
import BuildFilterAndSortingData from '../models/utils/BuildFilterAndSortingData'
import { IBuildSummary } from '../models/utils/IBuildSummary'
import { GlobalSidebarDisplayedComponentParameters } from '../models/utils/IGlobalSidebarOptions'
import { BuildPropertiesService } from '../services/BuildPropertiesService'
import Services from '../services/repository/Services'
import { SortingService } from '../services/sorting/SortingService'
import WebBrowserUtils from '../utils/WebBrowserUtils'
import BuildCard from './BuildCardComponent.vue'
import FilterChips from './FilterChipsComponent.vue'
import InfiniteScroller from './InfiniteScrollerComponent.vue'
import Loading from './LoadingComponent.vue'
import Paginator from './PaginatorComponent.vue'

const modelSelectedBuilds = defineModel<IBuildSummary[]>('selectedBuilds', { required: false, default: [] })
const modelFilterAndSortingData = defineModel<BuildFilterAndSortingData>('filterAndSortingData', { required: false, default: new BuildFilterAndSortingData() })

const props = withDefaults(
  defineProps<{
    buildSummaries: IBuildSummary[],
    elementToStickTo?: HTMLElement | null,
    maxElementsPerLine?: number,
    infiniteScrolling?: boolean,
    isLoading?: boolean,
    selectionButtonCaption?: string,
    selectionButtonIcon?: string,
    showActionsButton?: boolean,
    showChips?: boolean
    showNotExported?: boolean,
    showShoppingList?: boolean
  }>(),
  {
    elementToStickTo: undefined,
    maxElementsPerLine: 4,
    infiniteScrolling: false,
    isLoading: false,
    selectionButtonCaption: undefined,
    selectionButtonIcon: undefined,
    showActionsButton: undefined,
    showChips: true,
    showNotExported: true,
    showShoppingList: undefined
  })

const _buildPropertiesService = Services.get(BuildPropertiesService)
const _sortingService = Services.get(SortingService)

const buildsPerLine = computed(() => {
  let elementsPerLine = 4

  if (isSizeTabletPortaitOrSmaller.value) {
    elementsPerLine = 1
  } else if (isSizeTablet.value) {
    elementsPerLine = 2
  } else if (isSizePc.value) {
    elementsPerLine = 3
  }

  return props.maxElementsPerLine >= elementsPerLine ? elementsPerLine : props.maxElementsPerLine
})
const linesPerPage = computed(() => {
  let lines = 3

  if (isSizeTabletPortaitOrSmaller.value) {
    lines = 10
  } else if (isSizeTablet.value) {
    lines = 10
  }

  return lines
})

const breakpoints = useBreakpoints(WebBrowserUtils.breakpoints)
const buildSummariesInternal = ref<IBuildSummary[]>([])
const isSizeTabletPortaitOrSmaller = breakpoints.smaller('tabletLandscape')
const isSizeTablet = breakpoints.smaller('pc')
const isSizePc = breakpoints.smaller('pcLarge')

onMounted(() => {
  filterAndSortBuildSummariesAsync()
})

watch(
  () => props.buildSummaries,
  () => filterAndSortBuildSummariesAsync())

watch(
  () => modelFilterAndSortingData.value,
  () => filterAndSortBuildSummariesAsync())

/**
 * Indicates whether a build is selected.
 * @param buildSummary - Build.
 * @returns true when the build is selected; otherwise false.
 */
function checkIsSelected(buildSummary: IBuildSummary): boolean {
  const isSelected = modelSelectedBuilds.value.some(sbi => sbi.id === buildSummary.id)

  return isSelected
}

/**
 * Filters and sorts build summaries.
 */
async function filterAndSortBuildSummariesAsync(): Promise<void> {
  let buildSummariesToFilter = [...props.buildSummaries]
  buildSummariesToFilter = await filterBuildSummariesAsync(buildSummariesToFilter)
  buildSummariesToFilter = await sortBuildSummariesAsync(buildSummariesToFilter)

  buildSummariesInternal.value = buildSummariesToFilter
}

/**
 * Filters build summaries.
 * @param buildSummariesToFilter - Build summaries to filter.
 */
async function filterBuildSummariesAsync(buildSummariesToFilter: IBuildSummary[]): Promise<IBuildSummary[]> {
  if (modelFilterAndSortingData.value.filter === '') {
    return buildSummariesToFilter
  }

  const filteredBuildSummaries: IBuildSummary[] = []
  const promises: Promise<void>[] = []

  for (const buildSummaryToFilter of buildSummariesToFilter) {
    promises.push(new Promise(resolve => {
      const matchesFilter = _buildPropertiesService.checkMatchesFilter(buildSummaryToFilter, modelFilterAndSortingData.value.filter)

      if (matchesFilter) {
        filteredBuildSummaries.push(buildSummaryToFilter)
      }

      resolve()
    }))
  }

  await Promise.allSettled(promises)

  return filteredBuildSummaries
}

/**
 * React to the filter an sort having changed.
 *
 * Applies the filter and sort, and saves the sort.
 * @param updatedParameters - Filter and sort data updated by the side bar.
 */
function onFilterAndSortChanged(updatedParameters?: GlobalSidebarDisplayedComponentParameters): void {
  const updatedFilterAndSortingData = updatedParameters as BuildFilterAndSortingData
  const hasSortChange =
    updatedFilterAndSortingData.property !== modelFilterAndSortingData.value.property
    || updatedFilterAndSortingData.order !== modelFilterAndSortingData.value.order
  const hasFilterChange = updatedFilterAndSortingData.filter !== modelFilterAndSortingData.value.filter

  if (hasSortChange || hasFilterChange) {
    modelFilterAndSortingData.value = updatedFilterAndSortingData
  }
}

/**
 * Sorts build summaries.
 * @param buildSummariesToSort - Build summaries to sort.
 */
async function sortBuildSummariesAsync(buildSummariesToSort: IBuildSummary[]): Promise<IBuildSummary[]> {
  buildSummariesToSort = await _sortingService.sortAsync(buildSummariesToSort, modelFilterAndSortingData.value)

  return buildSummariesToSort
}

/**
 * Updates the list of selected build IDs.
 * @param buildSummary - Build.
 * @param isSelected - Indicates whether the build is selected.
 */
function updateSelectedBuilds(buildSummary: IBuildSummary, isSelected: boolean): void {
  if (isSelected) {
    modelSelectedBuilds.value = [
      ...modelSelectedBuilds.value,
      buildSummary
    ]
  } else {
    modelSelectedBuilds.value = modelSelectedBuilds.value.filter(sbi => sbi.id !== buildSummary.id)
  }
}
</script>










<template>
  <div
    v-if="isLoading"
    class="builds-list-loading"
  >
    <Loading />
  </div>
  <div
    v-else
    class="builds-list"
  >
    <div v-if="buildSummaries.length > 0">
      <FilterChips
        v-if="showChips"
        v-model:filter-and-sorting-data="modelFilterAndSortingData"
        filter-sidebar-component="BuildsListSidebar"
        :element-to-stick-to="elementToStickTo"
        @filter-and-sort-changed="onFilterAndSortChanged"
      />
      <InfiniteScroller
        v-if="infiniteScrolling"
        :element-height="253"
        :elements-per-line="buildsPerLine"
        :elements="buildSummariesInternal"
        :get-key-function="i => (i as IBuildSummary).id"
      >
        <template #element="{ element }">
          <BuildCard
            :build-summary="<IBuildSummary>element"
            :is-selected="checkIsSelected(<IBuildSummary>element)"
            :selection-button-caption="selectionButtonCaption"
            :selection-button-icon="selectionButtonIcon"
            :show-actions-button="showActionsButton"
            :show-not-exported="showNotExported"
            :show-shopping-list="showShoppingList"
            @update:is-selected="updateSelectedBuilds(<IBuildSummary>element, $event)"
          />
        </template>
      </InfiniteScroller>
      <Paginator
        v-else
        :elements-per-line="buildsPerLine"
        :elements="buildSummariesInternal"
        :get-key-function="b => (b as IBuildSummary).id"
        :lines-per-page="linesPerPage"
      >
        <template #element="{ element }">
          <BuildCard
            :build-summary="<IBuildSummary>element"
            :is-selected="checkIsSelected(<IBuildSummary>element)"
            :selection-button-caption="selectionButtonCaption"
            :selection-button-icon="selectionButtonIcon"
            :show-actions-button="showActionsButton"
            :show-not-exported="showNotExported"
            :show-shopping-list="showShoppingList"
            @update:is-selected="updateSelectedBuilds(<IBuildSummary>element, $event)"
          />
        </template>
      </Paginator>
    </div>
    <div
      v-else
      class="builds-list-no-results-message"
    >
      {{ $t('message.noBuildsFound') }}
    </div>
  </div>
</template>










<style scoped>
.builds-list {
  height: 100%;
  width: 100%;
}

.builds-list > div {
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
}

.builds-list-loading {
  margin-bottom: auto;
  margin-top: auto;
  padding-top: 3rem;
  /* Because the is a 3rem padding above the app-footer */
}

.builds-list-no-results-message {
  margin-bottom: auto;
  margin-top: auto;
  padding-top: 3rem;
  font-size: 1.5rem;
  text-align: center;
}
</style>