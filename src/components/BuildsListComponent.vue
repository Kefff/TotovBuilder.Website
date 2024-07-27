<template>
  <div class="builds-list-chips-container">
    <div class="builds-list-chips">
      <Chip
        class="builds-list-chip"
        @click="showFilterAndSortSidebar()"
      >
        <div class="builds-list-chip-group">
          <div class="builds-list-chip-icon">
            <font-awesome-icon :icon="sortChipIcon" />
          </div>
          <span>{{ $t(`caption.${filterAndSortingData.property}`) }}</span>
        </div>
      </Chip>
      <Chip
        v-if="filterAndSortingData.filter == null"
        class="builds-list-chip"
        @click="showFilterAndSortSidebar()"
      >
        <div class="builds-list-chip-group">
          <div class="builds-list-chip-icon">
            <font-awesome-icon icon="filter" />
          </div>
          <span>{{ $t('caption.filter') }}</span>
          <div class="builds-list-chip-icon-button builds-list-chip-icon-button-add-filter">
            <font-awesome-icon icon="plus" />
          </div>
        </div>
      </Chip>
      <Chip
        v-else
        class="builds-list-chip"
      >
        <div
          class="builds-list-chip-group"
          @click="showFilterAndSortSidebar()"
        >
          <div class="builds-list-chip-icon">
            <font-awesome-icon icon="filter" />
          </div>
          <span>{{ filterAndSortingData.filter }}</span>
        </div>
        <div
          class="builds-list-chip-icon-button builds-list-chip-icon-button-remove-filter"
          @click="filterAndSortingData.filter = undefined"
        >
          <font-awesome-icon icon="times" />
        </div>
      </Chip>
    </div>
  </div>
  <div class="builds-list-cards">
    <BuildCard
      v-for="buildSummary of buildSummariesInternal"
      :key="buildSummary.id"
      :build-summary="buildSummary"
      :is-selected="checkIsSelected(buildSummary.id)"
      :show-not-exported="showNotExported"
      @update:is-selected="updatedSelectedBuilds(buildSummary.id, $event)"
    />
  </div>
</template>










<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import BuildFilterAndSortingData from '../models/utils/BuildFilterAndSortingData'
import { IBuildSummary } from '../models/utils/IBuildSummary'
import { SortingOrder } from '../models/utils/SortingOrder'
import { GlobalSidebarService } from '../services/GlobalSidebarService'
import { WebsiteConfigurationService } from '../services/WebsiteConfigurationService'
import Services from '../services/repository/Services'
import { SortingService } from '../services/sorting/SortingService'
import { BuildSummarySortingFunctions } from '../services/sorting/functions/BuildSummarySortingFunctions'
import BuildCard from './BuildCardComponent.vue'

const globalSidebarService = Services.get(GlobalSidebarService)
const sortingService = Services.get(SortingService)

const modelSelectedBuildIds = defineModel<string[]>('selectedBuildIds', { required: false, default: [] })

const props = defineProps<{
  buildSummaries: IBuildSummary[],
  showNotExported: boolean,
}>()

const buildSummariesInternal = ref<IBuildSummary[]>([])
const filterAndSortingData = ref<BuildFilterAndSortingData>(new BuildFilterAndSortingData())
const oldFilterAndSort = ref<BuildFilterAndSortingData>()

const sortChipIcon = computed(() => filterAndSortingData.value.order === SortingOrder.asc ? 'sort-alpha-down' : 'sort-alpha-up-alt')

onMounted(() => {
  getSortingData()
  filterAndSortBuildSummaries()
})

watch(
  () => props.buildSummaries,
  () => filterAndSortBuildSummaries())

/**
 * Indicates whether a build is selected.
 * @param buildId - ID of the build.
 * @returns true when the build is selected; otherwise false.
 */
function checkIsSelected(buildId: string): boolean {
  const isSelected = modelSelectedBuildIds.value.some(sbi => sbi === buildId)

  return isSelected
}

/**
 * Filters and sorts build summaries.
 */
async function filterAndSortBuildSummaries() {
  filterBuildSummaries()
  await sortBuildSummaries()
}

/**
 * Filters build summaries.
 */
function filterBuildSummaries() {
  buildSummariesInternal.value = [...props.buildSummaries]
}

/**
 * Gets the sorting data.
 */
function getSortingData() {
  const websiteConfigurationService = Services.get(WebsiteConfigurationService)

  const property = localStorage.getItem(websiteConfigurationService.configuration.buildsSortFieldStorageKey) ?? 'name'
  const order = Number(localStorage.getItem(websiteConfigurationService.configuration.buildsSortOrderStorageKey)) ?? SortingOrder.asc
  sortingService.setSortingProperty(filterAndSortingData.value, BuildSummarySortingFunctions, property, order)
}

/**
 * React to the filter an sort sidebar being closed.
 *
 * Applies the filter and sort, and saves the sort.
 */
async function onFilterAndSortSidebarClosing() {
  const hasSortChange =
    filterAndSortingData.value.property !== oldFilterAndSort.value?.property
    || filterAndSortingData.value.order !== oldFilterAndSort.value?.order
  const hasChangedFilter = filterAndSortingData.value.filter !== oldFilterAndSort.value?.filter

  if (hasChangedFilter) {
    filterBuildSummaries()
  }

  if (hasSortChange || hasChangedFilter) {
    await sortBuildSummaries()
    saveSortingData()
  }

  oldFilterAndSort.value = undefined
}

/**
 * Saves sorting data.
 */
function saveSortingData() {
  const websiteConfigurationService = Services.get(WebsiteConfigurationService)
  localStorage.setItem(websiteConfigurationService.configuration.buildsSortFieldStorageKey, filterAndSortingData.value.property)
  localStorage.setItem(websiteConfigurationService.configuration.buildsSortOrderStorageKey, filterAndSortingData.value.order.toString())
}

/**
 * Opens the filter and sort sidebar.
 */
function showFilterAndSortSidebar() {
  // Saving the old filter to be able to detect changes to apply
  oldFilterAndSort.value = {
    ...filterAndSortingData.value
  }
  globalSidebarService.display({
    displayedComponentType: 'BuildsListSidebar',
    displayedComponentParameters: filterAndSortingData.value,
    position: 'left'
  })
  globalSidebarService.registerOnClosingAction(onFilterAndSortSidebarClosing)
}

/**
 * Sorts build summaries.
 */
async function sortBuildSummaries() {
  buildSummariesInternal.value = await sortingService.sort(props.buildSummaries, filterAndSortingData.value)
}

/**
 * Updates the list of selected build IDs.
 * @param buildId - ID of the build.
 * @param isSelected - Indicates whetehr the build is selected.
 */
function updatedSelectedBuilds(buildId: string, isSelected: boolean) {
  if (isSelected) {
    modelSelectedBuildIds.value = [
      ...modelSelectedBuildIds.value,
      buildId
    ]
  } else {
    modelSelectedBuildIds.value = modelSelectedBuildIds.value.filter(sbi => sbi !== buildId)
  }
}
</script>










<style scoped>
.builds-list-cards {
  display: grid;
  grid-gap: 1rem;
  grid-template-columns: repeat(3, 1fr);
}

.builds-list-chip {
  cursor: pointer;
  margin-bottom: 0.5rem;
  overflow: hidden;
  padding-bottom: 0.5rem;
  padding-top: 0.5rem;
}

.builds-list-chip-group {
  align-items: center;
  display: flex;
  overflow: hidden;
}

.builds-list-chip-group > span {
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
}

.builds-list-chip-icon {
  margin-right: 0.5rem;
}

.builds-list-chip-icon-button {
  align-items: center;
  display: flex;
  justify-content: center;
  padding-left: 1rem;
}

.builds-list-chip-icon-button:hover {
  cursor: pointer;
}

.builds-list-chip-icon-button-add-filter {
  color: var(--success-color);
}

.builds-list-chip-icon-button-remove-filter {
  color: var(--error-color);
}

.builds-list-chips {
  align-items: center;
  display: grid;
  grid-gap: 0.5rem;
  grid-template-columns: auto auto;
}

.builds-list-chips-container {
  display: flex;
}

/* Smartphone in portrait */
@media only screen and (min-width: 320px) and (max-width: 480px) {
  .builds-list-cards {
    grid-template-columns: 1fr;
  }
}

/* Smartphone in landscape */
@media only screen and (min-width: 481px) and (max-width: 767px) {
  .builds-list-cards {
    grid-template-columns: 1fr;
  }
}

/* Tablet in portrait */
@media only screen and (min-width: 768px) and (max-width: 991px) {
  .builds-list-cards {
    grid-template-columns: repeat(2, 1fr);
  }
}

/* Tablet in landscape */
@media only screen and (min-width: 992px) and (max-width: 1199px) {}

/* PC */
@media only screen and (min-width: 1200px) {}
</style>