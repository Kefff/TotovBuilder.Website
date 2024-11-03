<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import BuildFilterAndSortingData from '../models/utils/BuildFilterAndSortingData'
import { IBuildSummary } from '../models/utils/IBuildSummary'
import { GlobalSidebarDisplayedComponentParameters } from '../models/utils/IGlobalSidebarOptions'
import { BuildPropertiesService } from '../services/BuildPropertiesService'
import Services from '../services/repository/Services'
import { SortingService } from '../services/sorting/SortingService'
import BuildCard from './BuildCardComponent.vue'
import FilterChips from './FilterChipsComponent.vue'
import Loading from './LoadingComponent.vue'

const modelSelectedBuilds = defineModel<IBuildSummary[]>('selectedBuilds', { required: false, default: [] })
const modelFilterAndSortingData = defineModel<BuildFilterAndSortingData>('filterAndSortingData', { required: false, default: new BuildFilterAndSortingData() })

const props = withDefaults(
  defineProps<{
    buildSummaries: IBuildSummary[],
    elementToStickTo?: HTMLElement | null,
    gridMaxColumns?: number,
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
    gridMaxColumns: 4,
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

const cardsListClass = computed(() => `builds-list-cards${props.gridMaxColumns}`)

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
  <div v-else>
    <div v-if="buildSummaries.length > 0">
      <FilterChips
        v-if="showChips"
        v-model:filter-and-sorting-data="modelFilterAndSortingData"
        filter-sidebar-component="BuildsListSidebar"
        :element-to-stick-to="elementToStickTo"
        @filter-and-sort-changed="onFilterAndSortChanged"
      />
      <div
        v-if="buildSummariesInternal.length > 0"
        class="builds-list-cards"
        :class="cardsListClass"
      >
        <BuildCard
          v-for="buildSummary of buildSummariesInternal"
          :key="buildSummary.id"
          :build-summary="buildSummary"
          :is-selected="checkIsSelected(buildSummary)"
          :selection-button-caption="selectionButtonCaption"
          :selection-button-icon="selectionButtonIcon"
          :show-actions-button="showActionsButton"
          :show-not-exported="showNotExported"
          :show-shopping-list="showShoppingList"
          @update:is-selected="updateSelectedBuilds(buildSummary, $event)"
        />
      </div>
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
@import '../css/icon.css';

.builds-list-cards {
  display: grid;
  grid-gap: 1rem;
}

.builds-list-cards1 {
  grid-template-columns: 1fr;
}

.builds-list-cards2 {
  grid-template-columns: repeat(2, 1fr);
}

.builds-list-cards3 {
  grid-template-columns: repeat(3, 1fr);
}

.builds-list-cards4 {
  grid-template-columns: repeat(4, 1fr);
}

.builds-list-loading {
  margin-bottom: auto;
  margin-top: auto;
  padding-top: 3rem;
}

.builds-list-no-results-message {
  margin-bottom: auto;
  margin-top: auto;
  padding-top: 3rem;
  font-size: 1.5rem;
  text-align: center;
}

/* Smartphone in portrait */
@media only screen and (max-width: 480px) {
  .builds-list-cards2 {
    grid-template-columns: 1fr;
  }

  .builds-list-cards3 {
    grid-template-columns: 1fr;
  }

  .builds-list-cards4 {
    grid-template-columns: 1fr;
  }
}

/* Smartphone in landscape */
@media only screen and (min-width: 481px) and (max-width: 767px) {
  .builds-list-cards2 {
    grid-template-columns: 1fr;
  }

  .builds-list-cards3 {
    grid-template-columns: 1fr;
  }

  .builds-list-cards4 {
    grid-template-columns: 1fr;
  }
}

/* Tablet in portrait */
@media only screen and (min-width: 768px) and (max-width: 991px) {
  .builds-list-cards3 {
    grid-template-columns: repeat(2, 1fr);
  }

  .builds-list-cards4 {
    grid-template-columns: repeat(2, 1fr);
  }
}

/* Tablet in landscape */
@media only screen and (min-width: 992px) and (max-width: 1299px) {
  .builds-list-cards3 {
    grid-template-columns: repeat(2, 1fr);
  }

  .builds-list-cards4 {
    grid-template-columns: repeat(2, 1fr);
  }
}

/* PC */
@media only screen and (min-width: 1300px) and (max-width: 1799px) {
  .builds-list-cards4 {
    grid-template-columns: repeat(3, 1fr);
  }
}
</style>