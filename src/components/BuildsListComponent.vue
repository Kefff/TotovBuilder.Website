<script setup lang="ts">
import { useBreakpoints } from '@vueuse/core'
import { computed, onMounted, ref, watch } from 'vue'
import BuildFilterAndSortingData from '../models/utils/BuildFilterAndSortingData'
import { IBuildSummary } from '../models/utils/IBuildSummary'
import { IListSelectionOptions } from '../models/utils/IListSelectionOptions'
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
    infiniteScrolling?: boolean,
    isLoading?: boolean,
    maxElementsPerLine?: number,
    selectionOptions?: IListSelectionOptions,
    showActionsButton?: boolean,
    showChips?: boolean
    showNotExported?: boolean,
    showShoppingList?: boolean
  }>(),
  {
    elementToStickTo: undefined,
    infiniteScrolling: false,
    isLoading: false,
    maxElementsPerLine: 4,
    selectionOptions: () => <IListSelectionOptions>{
      canUnselect: true,
      isEnabled: false,
      isMultiSelection: false,
      selectionButtonCaption: undefined,
      selectionButtonIcon: undefined
    },
    showActionsButton: undefined,
    showChips: true,
    showNotExported: true,
    showShoppingList: undefined
  })

const _buildPropertiesService = Services.get(BuildPropertiesService)
const _sortingService = Services.get(SortingService)

const breakpoints = useBreakpoints(WebBrowserUtils.breakpoints)
const buildsPerLine = computed(() => {
  let elementsPerLine = 4

  if (isSizeTabletPortaitOrSmaller.value) {
    elementsPerLine = 1
  } else if (isSizeTabletLandscapeOrSmaller.value) {
    elementsPerLine = 2
  } else if (isSizePcOrSmaller.value) {
    elementsPerLine = 3
  }

  return props.maxElementsPerLine >= elementsPerLine ? elementsPerLine : props.maxElementsPerLine
})
const isSizeTabletPortaitOrSmaller = breakpoints.smaller('tabletLandscape')
const isSizeTabletLandscapeOrSmaller = breakpoints.smaller('pc')
const isSizePcOrSmaller = breakpoints.smaller('pcLarge')
const linesPerPage = computed(() => {
  let lines = 3

  if (isSizeTabletLandscapeOrSmaller.value) {
    lines = 10
  }

  return lines
})

const buildSummariesInternal = ref<IBuildSummary[]>([])

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
  if (modelFilterAndSortingData.value.filter == null) {
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
 * Sorts build summaries.
 * @param buildSummariesToSort - Build summaries to sort.
 */
async function sortBuildSummariesAsync(buildSummariesToSort: IBuildSummary[]): Promise<IBuildSummary[]> {
  buildSummariesToSort = await _sortingService.sortAsync(buildSummariesToSort, modelFilterAndSortingData.value)

  return buildSummariesToSort
}

/**
 * Updates the list of selected builds.
 * @param buildSummary - Build.
 * @param isSelected - Indicates whether the build is selected.
 */
function updateSelectedBuilds(buildSummary: IBuildSummary, isSelected: boolean): void {
  if (isSelected) {
    if (props.selectionOptions.isMultiSelection) {
      modelSelectedBuilds.value = [
        ...modelSelectedBuilds.value,
        buildSummary
      ]
    } else {
      modelSelectedBuilds.value = [buildSummary]
    }
  } else {
    modelSelectedBuilds.value = modelSelectedBuilds.value.filter(bs => bs.id !== buildSummary.id)
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
    <FilterChips
      v-if="showChips"
      v-model:filter-and-sorting-data="modelFilterAndSortingData"
      :element-to-stick-to="elementToStickTo"
      filter-sidebar-component="BuildsListSidebar"
    />
    <InfiniteScroller
      v-if="buildSummariesInternal.length > 0 && infiniteScrolling"
      :element-height="235"
      :elements-per-line="buildsPerLine"
      :elements="buildSummariesInternal"
      :get-key-function="i => (i as IBuildSummary).id"
    >
      <template #element="{ element }">
        <BuildCard
          :build-summary="<IBuildSummary>element"
          :is-selected="checkIsSelected(<IBuildSummary>element)"
          :selection-options="selectionOptions"
          :show-actions-button="showActionsButton"
          :show-not-exported="showNotExported"
          :show-shopping-list="showShoppingList"
          @update:is-selected="updateSelectedBuilds(<IBuildSummary>element, $event)"
        />
      </template>
    </InfiniteScroller>
    <Paginator
      v-else-if="buildSummariesInternal.length > 0 && !infiniteScrolling"
      :elements-per-line="buildsPerLine"
      :elements="buildSummariesInternal"
      :get-key-function="b => (b as IBuildSummary).id"
      :lines-per-page="linesPerPage"
    >
      <template #element="{ element }">
        <BuildCard
          :build-summary="<IBuildSummary>element"
          :is-selected="checkIsSelected(<IBuildSummary>element)"
          :selection-options="selectionOptions"
          :show-actions-button="showActionsButton"
          :show-not-exported="showNotExported"
          :show-shopping-list="showShoppingList"
          @update:is-selected="updateSelectedBuilds(<IBuildSummary>element, $event)"
        />
      </template>
    </Paginator>
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
  font-size: 1.5rem;
  margin-bottom: auto;
  margin-top: auto;
  padding-top: 3rem;
  text-align: center;
}
</style>