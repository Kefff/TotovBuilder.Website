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
        v-if="filterAndSortingData.filter == ''"
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
          @click="filterAndSortingData.filter = ''"
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
import { GlobalSidebarDisplayedComponentParametersType } from '../models/utils/IGlobalSidebarOptions'
import { SortingOrder } from '../models/utils/SortingOrder'
import { GlobalSidebarService } from '../services/GlobalSidebarService'
import { WebsiteConfigurationService } from '../services/WebsiteConfigurationService'
import Services from '../services/repository/Services'
import { SortingService } from '../services/sorting/SortingService'
import { BuildSummarySortingFunctions } from '../services/sorting/functions/BuildSummarySortingFunctions'
import StringUtils from '../utils/StringUtils'
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

const sortChipIcon = computed(() => filterAndSortingData.value.order === SortingOrder.asc ? 'sort-alpha-down' : 'sort-alpha-up-alt')

onMounted(() => {
  getFilterAndSortingData()
  filterAndSortBuildSummaries()
})

watch(
  () => props.buildSummaries,
  () => filterAndSortBuildSummaries())

watch(
  () => filterAndSortingData.value.filter,
  () => filterAndSortBuildSummaries())

/**
 * Checks whether a build summary matches the filter.
 * @param buildSummaryToCheck - Build summary that must be checked against the filter.
 * @param filterWords - Filter words.
 */
function checkMatchesFilter(buildSummaryToCheck: IBuildSummary, filterWords: string[]): boolean {
  for (const filterWord of filterWords) {
    if (StringUtils.contains(buildSummaryToCheck.name, filterWord)) {
      continue
    }

    let itemContains = false
    const items = buildSummaryToCheck.shoppingList.map(sli => sli.item)

    for (const item of items) {
      if (StringUtils.contains(item.shortName, filterWord)
        || StringUtils.contains(item.name, filterWord)) {
        itemContains = true
        break
      }
    }

    if (!itemContains) {
      return false
    }
  }

  return true
}

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
  let buildSummariesToFilter = [...props.buildSummaries]
  buildSummariesToFilter = await filterBuildSummaries(buildSummariesToFilter)
  buildSummariesToFilter = await sortBuildSummaries(buildSummariesToFilter)

  buildSummariesInternal.value = buildSummariesToFilter
}

/**
 * Filters build summaries.
 * @param buildSummariesToFilter - Build summaries to filter.
 */
async function filterBuildSummaries(buildSummariesToFilter: IBuildSummary[]): Promise<IBuildSummary[]> {
  if (filterAndSortingData.value.filter === '') {
    return buildSummariesToFilter
  }

  const filteredBuildSummaries: IBuildSummary[] = []
  const filterWords = filterAndSortingData.value.filter.split(' ')
  const promises: Promise<void>[] = []

  for (const buildSummaryToFilter of buildSummariesToFilter) {
    promises.push(new Promise(resolve => {
      const matchesFilter = checkMatchesFilter(buildSummaryToFilter, filterWords)

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
 * Gets the sorting data.
 */
function getFilterAndSortingData() {
  const websiteConfigurationService = Services.get(WebsiteConfigurationService)

  filterAndSortingData.value.filter = sessionStorage.getItem(websiteConfigurationService.configuration.buildsFilterStorageKey) ?? ''
  const property = localStorage.getItem(websiteConfigurationService.configuration.buildsSortFieldStorageKey) ?? 'name'
  const order = Number(localStorage.getItem(websiteConfigurationService.configuration.buildsSortOrderStorageKey)) ?? SortingOrder.asc
  sortingService.setSortingProperty(filterAndSortingData.value, BuildSummarySortingFunctions, property, order)
}

/**
 * React to the filter an sort sidebar being closed.
 *
 * Applies the filter and sort, and saves the sort.
 */
async function onFilterAndSortSidebarClosing(updatedParameters?: GlobalSidebarDisplayedComponentParametersType) {
  const updatedFilterAndSortingData = updatedParameters as BuildFilterAndSortingData
  const hasSortChange =
    updatedFilterAndSortingData.property !== filterAndSortingData.value.property
    || updatedFilterAndSortingData.order !== filterAndSortingData.value.order
  const hasFilterChange = updatedFilterAndSortingData.filter !== filterAndSortingData.value.filter

  if (!hasSortChange && !hasFilterChange) {
    return
  }

  let buildSummariesToFilter = [...(hasFilterChange ? props.buildSummaries : buildSummariesInternal.value)]
  filterAndSortingData.value = updatedFilterAndSortingData

  if (hasFilterChange) {
    buildSummariesToFilter = await filterBuildSummaries(buildSummariesToFilter)
  }

  buildSummariesToFilter = await sortBuildSummaries(buildSummariesToFilter)
  buildSummariesInternal.value = buildSummariesToFilter

  saveFilterAndSortingData()
}

/**
 * Saves filter and sorting data.
 */
function saveFilterAndSortingData() {
  const websiteConfigurationService = Services.get(WebsiteConfigurationService)
  sessionStorage.setItem(websiteConfigurationService.configuration.buildsFilterStorageKey, filterAndSortingData.value.filter)
  localStorage.setItem(websiteConfigurationService.configuration.buildsSortFieldStorageKey, filterAndSortingData.value.property)
  localStorage.setItem(websiteConfigurationService.configuration.buildsSortOrderStorageKey, filterAndSortingData.value.order.toString())
}

/**
 * Opens the filter and sort sidebar.
 */
function showFilterAndSortSidebar() {
  globalSidebarService.display({
    displayedComponentType: 'BuildsListSidebar',
    displayedComponentParameters: { ...filterAndSortingData.value },
    position: 'left'
  })
  globalSidebarService.registerOnClosingAction(onFilterAndSortSidebarClosing)
}

/**
 * Sorts build summaries.
 * @param buildSummariesToSort - Build summaries to sort.
 */
async function sortBuildSummaries(buildSummariesToSort: IBuildSummary[]): Promise<IBuildSummary[]> {
  buildSummariesToSort = await sortingService.sort(buildSummariesToSort, filterAndSortingData.value)

  return buildSummariesToSort
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