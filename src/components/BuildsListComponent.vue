<template>
  <Sticky
    v-if="buildSummaries.length > 0"
    :element-to-stick-to="elementToStickTo"
    align="left"
  >
    <div class="builds-list-chips">
      <Chip
        class="builds-list-chip"
        @click="showFilterAndSortSidebar()"
      >
        <Tooltip
          :tooltip="sortButtonTooltip"
          position="right"
        >
          <div class="builds-list-chip-group">
            <div class="builds-list-chip-icon">
              <font-awesome-icon :icon="sortChipIcon" />
            </div>
            <span>{{ $t(`caption.${modelFilterAndSortingData.property}`) }}</span>
          </div>
        </Tooltip>
      </Chip>
      <Chip
        v-if="modelFilterAndSortingData.filter == ''"
        class="builds-list-chip"
        @click="showFilterAndSortSidebar()"
      >
        <Tooltip :tooltip="$t('caption.addFilter')">
          <div class="builds-list-chip-group">
            <div class="builds-list-chip-icon">
              <font-awesome-icon icon="filter" />
            </div>
            <span>{{ $t('caption.filter') }}</span>
            <div class="builds-list-chip-icon-button builds-list-chip-icon-button-add-filter">
              <font-awesome-icon icon="plus" />
            </div>
          </div>
        </Tooltip>
      </Chip>
      <Chip
        v-else
        class="builds-list-chip"
      >
        <Tooltip
          :tooltip="$t('caption.filteredWith', { filter: modelFilterAndSortingData.filter })"
          style="overflow: hidden;"
        >
          <div
            class="builds-list-chip-group"
            @click="showFilterAndSortSidebar()"
          >
            <div class="builds-list-chip-icon">
              <font-awesome-icon icon="filter" />
            </div>
            <span>{{ modelFilterAndSortingData.filter }}</span>
          </div>
        </Tooltip>
        <Tooltip :tooltip="$t('caption.removeFilter')">
          <div
            class="builds-list-chip-icon-button builds-list-chip-icon-button-remove-filter"
            @click="removeFilter()"
          >
            <font-awesome-icon icon="times" />
          </div>
        </Tooltip>
      </Chip>
    </div>
  </Sticky>
  <div
    v-if="isLoading"
    class="builds-list-loading"
  >
    <Loading />
  </div>
  <div
    v-if="!isLoading && buildSummariesInternal.length > 0"
    class="builds-list-cards"
    :class="mode !== 'default' ? 'builds-list-cards-import-export' : ''"
  >
    <BuildCard
      v-for="buildSummary of buildSummariesInternal"
      :key="buildSummary.id"
      :build-summary="buildSummary"
      :mode="mode"
      :is-selected="checkIsSelected(buildSummary)"
      :show-not-exported="showNotExported"
      @update:is-selected="updateSelectedBuilds(buildSummary, $event)"
    />
  </div>
  <div
    v-else-if="!isLoading"
    class="builds-list-no-results-message"
  >
    {{ $t('message.noBuildsFound') }}
  </div>
</template>










<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import BuildFilterAndSortingData from '../models/utils/BuildFilterAndSortingData'
import { IBuildSummary } from '../models/utils/IBuildSummary'
import { GlobalSidebarDisplayedComponentParameters } from '../models/utils/IGlobalSidebarOptions'
import { SortingOrder } from '../models/utils/SortingOrder'
import vueI18n from '../plugins/vueI18n'
import { BuildPropertiesService } from '../services/BuildPropertiesService'
import { GlobalSidebarService } from '../services/GlobalSidebarService'
import Services from '../services/repository/Services'
import { SortingService } from '../services/sorting/SortingService'
import BuildCard from './BuildCardComponent.vue'
import Loading from './LoadingComponent.vue'
import Sticky from './StickyComponent.vue'

const modelSelectedBuilds = defineModel<IBuildSummary[]>('selectedBuilds', { required: false, default: [] })
const modelFilterAndSortingData = defineModel<BuildFilterAndSortingData>('filterAndSortingData', { required: false, default: new BuildFilterAndSortingData() })

const props = withDefaults(
  defineProps<{
    buildSummaries: IBuildSummary[],
    elementToStickTo?: HTMLElement | null,
    isLoading?: boolean,
    mode?: 'default' | 'export' | 'import',
    showNotExported: boolean,
  }>(),
  {
    elementToStickTo: undefined,
    isLoading: false,
    mode: 'default'
  })

const _buildPropertiesService = Services.get(BuildPropertiesService)
const _globalSidebarService = Services.get(GlobalSidebarService)
const _sortingService = Services.get(SortingService)

const buildSummariesInternal = ref<IBuildSummary[]>([])

const sortButtonTooltip = computed(() => vueI18n.t(
  'caption.sortedBy',
  {
    property: vueI18n.t(`caption.${modelFilterAndSortingData.value.property}`).toLocaleLowerCase(),
    order: modelFilterAndSortingData.value.order === SortingOrder.asc
      ? vueI18n.t('caption.ascendant').toLocaleLowerCase()
      : vueI18n.t('caption.descendant').toLocaleLowerCase()
  }))
const sortChipIcon = computed(() => modelFilterAndSortingData.value.order === SortingOrder.asc ? 'sort-amount-down-alt' : 'sort-amount-up')

onMounted(() => {
  addEventListener('keydown', (e) => onKeyDown(e))

  filterAndSortBuildSummaries()
})

onUnmounted(() => {
  removeEventListener('keydown', (e) => onKeyDown(e))
})

watch(
  () => props.buildSummaries,
  () => filterAndSortBuildSummaries())

watch(
  () => modelFilterAndSortingData.value,
  () => filterAndSortBuildSummaries())

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
 * React to the filter an sort sidebar being closed.
 *
 * Applies the filter and sort, and saves the sort.
 * @param updatedParameters - Filter and sort data updated by the side bar.
 */
function onFilterAndSortSidebarClose(updatedParameters?: GlobalSidebarDisplayedComponentParameters) {
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
 * Reacts to a keyboard event.
 * @param event - Keyboard event.
 */
function onKeyDown(event: KeyboardEvent) {
  if (event.key === 'f'
    && (event.ctrlKey
      || event.metaKey)) {

    if (!_globalSidebarService.isDisplayed()) {
      event.preventDefault() // Prevents the browser save action to be triggered
      showFilterAndSortSidebar()
    }
  }
}

/**
 * Removes the filter.
 */
function removeFilter() {
  modelFilterAndSortingData.value = {
    ...modelFilterAndSortingData.value,
    filter: ''
  }
}

/**
 * Opens the filter and sort sidebar.
 */
function showFilterAndSortSidebar() {
  _globalSidebarService.display({
    displayedComponentType: 'BuildsListSidebar',
    displayedComponentParameters: { ...modelFilterAndSortingData.value },
    onCloseAction: onFilterAndSortSidebarClose
  })
}

/**
 * Sorts build summaries.
 * @param buildSummariesToSort - Build summaries to sort.
 */
async function sortBuildSummaries(buildSummariesToSort: IBuildSummary[]): Promise<IBuildSummary[]> {
  buildSummariesToSort = await _sortingService.sort(buildSummariesToSort, modelFilterAndSortingData.value)

  return buildSummariesToSort
}

/**
 * Updates the list of selected build IDs.
 * @param buildSummary - Build.
 * @param isSelected - Indicates whetehr the build is selected.
 */
function updateSelectedBuilds(buildSummary: IBuildSummary, isSelected: boolean) {
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










<style scoped>
@import '../css/icon.css';

.builds-list-cards {
  display: grid;
  grid-gap: 1rem;
  grid-template-columns: repeat(4, 1fr);
}

.builds-list-cards-import-export {
  grid-template-columns: 1fr !important;
}

.builds-list-chip {
  background-color: var(--surface-300);
  border-style: solid;
  border-width: 1px;
  border-color: var(--primary-color);
  cursor: pointer;
  padding-bottom: 0.5rem;
  padding-top: 0.5rem;
  overflow: hidden;
}

.builds-list-chip-group {
  align-items: center;
  display: flex;
}

.builds-list-chip-group > span {
  overflow: hidden;
  text-overflow: ellipsis;
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
  margin-bottom: 0.5rem;
  margin-top: 0.5rem;
}

.builds-list-chips-container {
  margin-bottom: 0.5rem;
  margin-right: auto;
  display: flex;
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
@media only screen and (min-width: 992px) and (max-width: 1299px) {
  .builds-list-cards {
    grid-template-columns: repeat(2, 1fr);
  }
}

/* PC */
@media only screen and (min-width: 1300px) and (max-width: 1799px) {
  .builds-list-cards {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media only screen and (min-width: 1600px) {}
</style>