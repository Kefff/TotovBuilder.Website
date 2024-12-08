<script setup lang="ts">
import { useBreakpoints } from '@vueuse/core'
import { computed, onMounted, ref, watch } from 'vue'
import { IItem } from '../models/item/IItem'
import { GlobalSidebarDisplayedComponentParameters } from '../models/utils/IGlobalSidebarOptions'
import ItemFilterAndSortingData from '../models/utils/ItemFilterAndSortingData'
import { ItemPropertiesService } from '../services/ItemPropertiesService'
import Services from '../services/repository/Services'
import { SortingService } from '../services/sorting/SortingService'
import WebBrowserUtils from '../utils/WebBrowserUtils'
import FilterChips from './FilterChipsComponent.vue'
import InfiniteScroller from './InfiniteScrollerComponent.vue'
import ItemCardSelector from './item-card/ItemCardSelectorComponent.vue'
import Loading from './LoadingComponent.vue'
import Paginator from './PaginatorComponent.vue'

const modelFilterAndSortingData = defineModel<ItemFilterAndSortingData>('filterAndSortingData', { required: false, default: new ItemFilterAndSortingData() })

const props = withDefaults(
  defineProps<{
    elementToStickTo?: HTMLElement | null,
    maxElementsPerLine?: number,
    infiniteScrolling?: boolean,
    isLoading?: boolean,
    items: IItem[]
  }>(),
  {
    elementToStickTo: undefined,
    maxElementsPerLine: 4,
    infiniteScrolling: false,
    isLoading: false
  })

const _itemPropertiesService = Services.get(ItemPropertiesService)
const _sortingService = Services.get(SortingService)

const itemsPerLine = computed(() => {
  let columns = 4

  if (oneItemPerLine.value) {
    columns = 1
  } else if (twoItemsPerLine.value) {
    columns = 2
  } else if (threeItemsPerLine.value) {
    columns = 3
  }

  return props.maxElementsPerLine >= columns ? columns : props.maxElementsPerLine
})

const breakpoints = useBreakpoints(WebBrowserUtils.breakpoints)
const itemsInternal = ref<IItem[]>([])
const oneItemPerLine = breakpoints.smaller('tabletLandscape')
const twoItemsPerLine = breakpoints.smaller('pc')
const threeItemsPerLine = breakpoints.smaller('pcLarge')

onMounted(() => {
  filterAndSortItemsAsync()
})

watch(
  () => props.items,
  () => filterAndSortItemsAsync())

watch(
  () => modelFilterAndSortingData.value,
  () => filterAndSortItemsAsync())

/**
 * Filters and sorts items.
 */
async function filterAndSortItemsAsync(): Promise<void> {
  let itemsToFilter = [...props.items]
  itemsToFilter = await filterItemsAsync(itemsToFilter)
  itemsToFilter = await sortItemsAsync(itemsToFilter)

  itemsInternal.value = itemsToFilter
}

/**
 * Filters build summaries.
 * @param itemsToFilter - Build summaries to filter.
 */
async function filterItemsAsync(itemsToFilter: IItem[]): Promise<IItem[]> {
  if (modelFilterAndSortingData.value.categoryId == null
    && modelFilterAndSortingData.value.filter == null) {
    return itemsToFilter
  }

  const filtereditemsummaries: IItem[] = []
  const promises: Promise<void>[] = []

  for (const itemToFilter of itemsToFilter) {
    promises.push(new Promise(resolve => {
      const isInCategory = modelFilterAndSortingData.value.categoryId == null
        ? true
        : itemToFilter.categoryId === modelFilterAndSortingData.value.categoryId

      if (isInCategory) {
        const matchesFilter = modelFilterAndSortingData.value.filter == null
          ? true
          : _itemPropertiesService.checkMatchesFilter(itemToFilter, modelFilterAndSortingData.value.filter)

        if (matchesFilter) {
          filtereditemsummaries.push(itemToFilter)
        }
      }

      resolve()
    }))
  }

  await Promise.allSettled(promises)

  return filtereditemsummaries
}

/**
 * React to the filter an sort sidebar being closed.
 *
 * Applies the filter and sort, and saves the sort.
 * @param updatedParameters - Filter and sort data updated by the side bar.
 */
function onFilterAndSortChanged(updatedParameters?: GlobalSidebarDisplayedComponentParameters): void {
  const updatedFilterAndSortingData = updatedParameters as ItemFilterAndSortingData
  const hasCategoryChanged = updatedFilterAndSortingData.categoryId !== modelFilterAndSortingData.value.categoryId
  const hasSortChange =
    updatedFilterAndSortingData.property !== modelFilterAndSortingData.value.property
    || updatedFilterAndSortingData.order !== modelFilterAndSortingData.value.order
  const hasFilterChange = updatedFilterAndSortingData.filter !== modelFilterAndSortingData.value.filter

  if (hasCategoryChanged || hasSortChange || hasFilterChange) {
    modelFilterAndSortingData.value = updatedFilterAndSortingData
  }
}

/**
 * Sorts items.
 * @param itemsToSort - Items to sort.
 */
async function sortItemsAsync(itemsToSort: IItem[]): Promise<IItem[]> {
  itemsToSort = await _sortingService.sortAsync(itemsToSort, modelFilterAndSortingData.value)

  return itemsToSort
}
</script>










<template>
  <div
    v-if="isLoading"
    class="items-list-loading"
  >
    <Loading />
  </div>
  <div
    v-else
    class="items-list"
  >
    <FilterChips
      v-if="items.length > 0"
      v-model:filter-and-sorting-data="modelFilterAndSortingData"
      filter-sidebar-component="ItemsListSidebar"
      :element-to-stick-to="elementToStickTo"
      @filter-and-sort-changed="onFilterAndSortChanged"
    />
    <InfiniteScroller
      v-if="itemsInternal.length > 0 && infiniteScrolling"
      :element-height="50"
      :elements-per-line="itemsPerLine"
      :elements="itemsInternal"
      :get-key-function="i => (i as IItem).id"
    >
      <template #element="{ element }">
        <ItemCardSelector
          :item="<IItem>element"
          :show-details-button="true"
        />
      </template>
    </InfiniteScroller>
    <Paginator
      v-else-if="itemsInternal.length > 0 && !infiniteScrolling"
      :elements-per-line="itemsPerLine"
      :elements="itemsInternal"
      :get-key-function="i => (i as IItem).id"
      :lines-per-page="10"
    >
      <template #element="{ element }">
        <ItemCardSelector
          :item="<IItem>element"
          :show-details-button="true"
        />
      </template>
    </Paginator>
    <div
      v-else
      class="items-list-no-results-message"
    >
      {{ $t('message.noItemsFound') }}
    </div>
  </div>
</template>










<style>
.items-list {
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
}

.items-list-loading {
  margin-bottom: auto;
  margin-top: auto;
  padding-top: 3rem;
}

.items-list-no-results-message {
  font-size: 1.5rem;
  margin-bottom: auto;
  margin-top: auto;
  padding-top: 3rem;
  text-align: center;
}
</style>