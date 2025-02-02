<script setup lang="ts">
import { computed, nextTick, onMounted, onUnmounted, ref, watch } from 'vue'
import { IBuild } from '../models/build/IBuild'
import BuildFilterAndSortingData from '../models/utils/BuildFilterAndSortingData'
import { IBuildSummary } from '../models/utils/IBuildSummary'
import { IListSelectionOptions } from '../models/utils/IListSelectionOptions'
import { BuildPropertiesService } from '../services/BuildPropertiesService'
import { BuildService } from '../services/BuildService'
import { GlobalFilterService } from '../services/GlobalFilterService'
import { ImportService } from '../services/ImportService'
import { ItemService } from '../services/ItemService'
import { ServiceInitializationState } from '../services/repository/ServiceInitializationState'
import Services from '../services/repository/Services'
import { SortingService } from '../services/sorting/SortingService'
import WebBrowserUtils from '../utils/WebBrowserUtils'
import BuildCard from './BuildCardComponent.vue'
import FilterChips from './FilterChipsComponent.vue'
import InfiniteScroller from './InfiniteScrollerComponent.vue'
import Loading from './LoadingComponent.vue'
import Paginator from './PaginatorComponent.vue'

const modelSelectedBuilds = defineModel<IBuild[]>('selectedBuilds', { required: false, default: [] })
const modelFilterAndSortingData = defineModel<BuildFilterAndSortingData>('filterAndSortingData', { required: false, default: new BuildFilterAndSortingData() })

const props = withDefaults(
  defineProps<{
    autoScrollToFirstElement?: boolean,
    elementToStickTo?: HTMLElement | null,
    getBuildsFunction: () => IBuild[],
    infiniteScrolling?: boolean,
    maxElementsPerLine?: number,
    selectionOptions?: IListSelectionOptions,
    showActionsButton?: boolean,
    showChips?: boolean
    showNotExported?: boolean,
    showShoppingList?: boolean
  }>(),
  {
    autoScrollToFirstElement: true,
    elementToStickTo: undefined,
    infiniteScrolling: false,
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

const _buildService = Services.get(BuildService)
const _buildPropertiesService = Services.get(BuildPropertiesService)
const _globalFilterService = Services.get(GlobalFilterService)
const _importService = Services.get(ImportService)
const _itemService = Services.get(ItemService)
const _sortingService = Services.get(SortingService)

let _builds: IBuild[] = []

const buildsPerLine = computed(() => {
  let elementsPerLine = 4

  if (isSmartphoneLandscapeOrSmaller.value) {
    elementsPerLine = 1
  } else if (isTabletLandscapeOrSmaller.value) {
    elementsPerLine = 2
  } else if (isPcOrSmaller.value) {
    elementsPerLine = 3
  }

  return props.maxElementsPerLine >= elementsPerLine ? elementsPerLine : props.maxElementsPerLine
})
const {
  isSmartphoneLandscapeOrSmaller,
  isTabletLandscapeOrSmaller,
  isPcOrSmaller
} = WebBrowserUtils.getScreenSize()
const linesPerPage = computed(() => {
  let lines = 3

  if (isTabletLandscapeOrSmaller.value) {
    lines = 10
  }

  return lines
})

const filteredAndSortedBuildSummaries = ref<IBuildSummary[]>([])
const isInitialized = ref(false)
const isLoading = ref(true)

onMounted(() => {
  _buildService.emitter.on(BuildService.deletedEvent, onBuildDeleted)
  _globalFilterService.emitter.on(GlobalFilterService.changeEvent, onMerchantFilterChanged)
  _importService.emitter.on(ImportService.buildsImportedEvent, onBuildImported)

  // Getting the builds once items have been fully initialized
  if (_itemService.initializationState === ServiceInitializationState.initializing) {
    _itemService.emitter.once(ItemService.initializationFinishedEvent, () => {
      filterAndSortBuildsAsync(true)
      isInitialized.value = true
    })
  } else {
    filterAndSortBuildsAsync(true)
    isInitialized.value = true
  }
})

onUnmounted(() => {
  _buildService.emitter.off(BuildService.deletedEvent, onBuildDeleted)
  _globalFilterService.emitter.off(GlobalFilterService.changeEvent, onMerchantFilterChanged)
  _importService.emitter.off(ImportService.buildsImportedEvent, onBuildImported)
})

watch(
  () => modelFilterAndSortingData.value,
  (value: BuildFilterAndSortingData, oldValue: BuildFilterAndSortingData) => filterAndSortBuildsAsync(value.filter !== oldValue.filter))

/**
 * Indicates whether a build is selected.
 * @param build - Build.
 * @returns `true` when the build is selected; otherwise `false`.
 */
function checkIsSelected(build: IBuildSummary): boolean {
  const isSelected = modelSelectedBuilds.value.some(sbi => sbi.id === build.id)

  return isSelected
}

/**
 * Gets builds (if necessary), get their summaries, filters and sorts them.
 * @param buildsListNeedsUpdate - Indicates whether the builds list need to be updated before summaries are gotten, filtered and sorted.
 * This is the case when a build has been deleted or a new build has been imported.
 */
async function filterAndSortBuildsAsync(buildsListNeedsUpdate: boolean): Promise<void> {
  isLoading.value = true

  if (buildsListNeedsUpdate) {
    _builds = props.getBuildsFunction()
  }

  let buildSummariesToFilterAndSort: IBuildSummary[] = []
  const promises: Promise<void>[] = []

  for (const build of _builds) {
    const promise = _buildPropertiesService.getSummaryAsync(build)
      .then(bs => {
        buildSummariesToFilterAndSort.push(bs)
      })
    promises.push(promise)
  }

  await Promise.allSettled(promises)
  buildSummariesToFilterAndSort = await filterBuildsAsync(buildSummariesToFilterAndSort)
  buildSummariesToFilterAndSort = await sortBuildsAsync(buildSummariesToFilterAndSort)
  filteredAndSortedBuildSummaries.value = buildSummariesToFilterAndSort

  nextTick(() => isLoading.value = false)
}

/**
 * Filters build summaries.
 * @param buildSummariesToFilter - Build summaries to filter.
 */
async function filterBuildsAsync(buildSummariesToFilter: IBuildSummary[]): Promise<IBuildSummary[]> {
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
 * Reacts to a build being deleted.
 *
 * Updates the builds and their summaries, filters and sorts them.
 */
function onBuildDeleted(): void {
  filterAndSortBuildsAsync(true)
}

/**
 * Reacts to a build being impoted.
 *
 * Updates the builds and their summaries, filters and sorts them.
 */
function onBuildImported(): void {
  filterAndSortBuildsAsync(true)
}

/**
 * Reacts to a the merchant filter changing.
 *
 * Updates the build summaries, filters and sorts them.
 */
function onMerchantFilterChanged(): void {
  filterAndSortBuildsAsync(false)
}

/**
 * Sorts build summaries.
 * @param buildSummariesToSort - Build summaries to sort.
 */
async function sortBuildsAsync(buildSummariesToSort: IBuildSummary[]): Promise<IBuildSummary[]> {
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
    const build = _builds.find(b => b.id === buildSummary.id)

    if (props.selectionOptions.isMultiSelection) {
      modelSelectedBuilds.value = [
        ...modelSelectedBuilds.value,
        build!
      ]
    } else {
      modelSelectedBuilds.value = [build!]
    }
  } else {
    modelSelectedBuilds.value = modelSelectedBuilds.value.filter(bs => bs.id !== buildSummary.id)
  }
}
</script>










<template>
  <div
    v-if="isLoading || !isInitialized"
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
      v-if="filteredAndSortedBuildSummaries.length > 0 && infiniteScrolling"
      :auto-scroll-to-first-element="autoScrollToFirstElement"
      :element-height="235"
      :elements-per-line="buildsPerLine"
      :elements="filteredAndSortedBuildSummaries"
      :get-key-function="i => (i as IBuildSummary).id"
    >
      <template #element="{ element }">
        <BuildCard
          :build-summary="element as IBuildSummary"
          :is-selected="checkIsSelected(element as IBuildSummary)"
          :selection-options="selectionOptions"
          :show-actions-button="showActionsButton"
          :show-not-exported="showNotExported"
          :show-shopping-list="showShoppingList"
          @update:is-selected="updateSelectedBuilds(<IBuildSummary>element, $event)"
        />
      </template>
    </InfiniteScroller>
    <Paginator
      v-else-if="filteredAndSortedBuildSummaries.length > 0 && !infiniteScrolling"
      :auto-scroll-to-first-element-of-page="autoScrollToFirstElement"
      :elements-per-line="buildsPerLine"
      :elements="filteredAndSortedBuildSummaries"
      :get-key-function="b => (b as IBuildSummary).id"
      :lines-per-page="linesPerPage"
    >
      <template #element="{ element }">
        <BuildCard
          :build-summary="element as IBuildSummary"
          :is-selected="checkIsSelected(element as IBuildSummary)"
          :selection-options="selectionOptions"
          :show-actions-button="showActionsButton"
          :show-not-exported="showNotExported"
          :show-shopping-list="showShoppingList"
          @update:is-selected="updateSelectedBuilds(element as IBuildSummary, $event)"
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