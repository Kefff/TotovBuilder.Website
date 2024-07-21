<template>
  <Chip
    v-if="filterAndSort.filter != null"
    class="builds-list-filter-chip"
  >
    <div class="builds-list-filter-chip-filter-icon">
      <font-awesome-icon icon="filter" />
    </div>
    <span>{{ $t('caption.filter') }} : {{ filterAndSort.filter }}</span>
    <Tooltip :tooltip="$t('caption.removeFilter')">
      <div
        class="builds-list-filter-chip-remove-icon"
        @click="filterAndSort.filter = undefined"
      >
        <font-awesome-icon icon="times" />
      </div>
    </Tooltip>
  </Chip>
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
import { IBuildSummary } from '../models/utils/IBuildSummary'
import { IBuildsListFilterSortingData } from '../models/utils/IBuildsListFilterSortingData'
import { GlobalSidebarDisplayedComponentParametersType } from '../models/utils/IGlobalSidebarOptions'
import { SortingOrder } from '../models/utils/SortingOrder'
import { GlobalSidebarService } from '../services/GlobalSidebarService'
import { WebsiteConfigurationService } from '../services/WebsiteConfigurationService'
import Services from '../services/repository/Services'
import BuildCard from './BuildCardComponent.vue'

const globalSidebarService = Services.get(GlobalSidebarService)

const modelFilterAndSortSidebarVisible = defineModel<boolean>('filterAndSortSidebarVisible', { required: true })
const modelSelectedBuildIds = defineModel<string[]>('selectedBuildIds', { required: false, default: [] })

const props = defineProps<{
  buildSummaries: IBuildSummary[],
  showNotExported: boolean,
}>()

const filterAndSort = ref<IBuildsListFilterSortingData>({
  currentSortField: 'name',
  currentSortOrder: SortingOrder.asc,
  filter: undefined
})

const buildSummariesInternal = computed(() => props.buildSummaries)

watch(() => modelFilterAndSortSidebarVisible.value, () => showFilterAndSortSidebar())

onMounted(() => {
  getSortingData()
})

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
 * Gets the sorting data.
 */
function getSortingData() {
  const websiteConfigurationService = Services.get(WebsiteConfigurationService)

  filterAndSort.value.currentSortField = localStorage.getItem(websiteConfigurationService.configuration.buildsSortFieldStorageKey) ?? 'name'
  filterAndSort.value.currentSortOrder = Number(localStorage.getItem(websiteConfigurationService.configuration.buildsSortOrderStorageKey)) ?? 1
}

/**
 * React to the filter an sort sidebar being closed.
 *
 * Applies the filter and sort, and saves the sort.
 */
function onFilterAndSortSidebarClosing(updatedParameters?: GlobalSidebarDisplayedComponentParametersType) {
  const updatedFilterAndSort = updatedParameters as IBuildsListFilterSortingData

  if (updatedFilterAndSort.currentSortField !== filterAndSort.value.currentSortField
    || updatedFilterAndSort.currentSortOrder !== filterAndSort.value.currentSortOrder
    || updatedFilterAndSort.filter !== filterAndSort.value.filter) {
    filterAndSort.value = updatedParameters as IBuildsListFilterSortingData
    saveSortingData()
  }

  modelFilterAndSortSidebarVisible.value = false
}

/**
 * Saves sorting data.
 */
function saveSortingData() {
  const websiteConfigurationService = Services.get(WebsiteConfigurationService)
  localStorage.setItem(websiteConfigurationService.configuration.buildsSortFieldStorageKey, filterAndSort.value.currentSortField)
  localStorage.setItem(websiteConfigurationService.configuration.buildsSortOrderStorageKey, filterAndSort.value.currentSortOrder.toString())
}

/**
 * Opens the filter and sort sidebar.
 */
function showFilterAndSortSidebar() {
  if (!modelFilterAndSortSidebarVisible.value) {
    return
  }

  globalSidebarService.display({
    displayedComponentType: 'BuildsListSidebar',
    displayedComponentParameters: filterAndSort.value,
    position: 'left'
  })
  globalSidebarService.registerOnClosingAction(onFilterAndSortSidebarClosing)
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

.builds-list-filter-chip {
  padding: 0.5rem;
  margin-bottom: 0.5rem;
}

.builds-list-filter-chip-filter-icon {
  margin-left: 0.5rem;
  margin-right: 0.5rem;
}

.builds-list-filter-chip-remove-icon {
  align-items: center;
  color: var(--error-color);
  display: flex;
  justify-content: center;
  padding-left: 1rem;
  padding-right: 1rem;
}

.builds-list-filter-chip-remove-icon:hover {
  cursor: pointer;
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