<script setup lang="ts">
import { useBreakpoints } from '@vueuse/core'
import { computed, onMounted, ref, watch } from 'vue'
import { IItem } from '../models/item/IItem'
import { GlobalSidebarDisplayedComponentParameters } from '../models/utils/IGlobalSidebarOptions'
import { IListSelectionOptions } from '../models/utils/IListSelectionOptions'
import ItemFilterAndSortingData from '../models/utils/ItemFilterAndSortingData'
import { ItemPropertiesService } from '../services/ItemPropertiesService'
import Services from '../services/repository/Services'
import { SortingService } from '../services/sorting/SortingService'
import WebBrowserUtils from '../utils/WebBrowserUtils'
import FilterChips from './FilterChipsComponent.vue'
import InfiniteScroller from './InfiniteScrollerComponent.vue'
import ItemCard from './item-card/ItemCardComponent.vue'
import Loading from './LoadingComponent.vue'
import Paginator from './PaginatorComponent.vue'

const modelSelectedItems = defineModel<IItem[]>('selectedItems', { required: false, default: [] })
const modelFilterAndSortingData = defineModel<ItemFilterAndSortingData>('filterAndSortingData', { required: false, default: new ItemFilterAndSortingData() })

const props = withDefaults(
  defineProps<{
    elementToStickTo?: HTMLElement | null,
    infiniteScrolling?: boolean,
    isLoading?: boolean,
    items: IItem[],
    maxElementsPerLine?: number,
    selectionOptions?: IListSelectionOptions,
  }>(),
  {
    elementToStickTo: undefined,
    infiniteScrolling: false,
    isLoading: false,
    maxElementsPerLine: 5,
    selectionOptions: () => <IListSelectionOptions>{
      canUnselect: true,
      isEnabled: false,
      selectionButtonCaption: undefined,
      selectionButtonIcon: undefined
    }
  })

const _itemPropertiesService = Services.get(ItemPropertiesService)
const _sortingService = Services.get(SortingService)

const firstSelectedItemIndex = computed(() => itemsInternal.value.findIndex(i => i.id === modelSelectedItems.value[0]?.id))
const itemsPerLine = computed(() => {
  let columns = 5

  if (isSizeSmartphonePortrait.value) {
    columns = 1
  } else if (isSizeTabletPortaitOrSmaller.value) {
    columns = 2
  } else if (isSizeTabletOrSmaller.value) {
    columns = 3
  } else if (isSizePcOrSmaller.value) {
    columns = 4
  }

  return props.maxElementsPerLine >= columns ? columns : props.maxElementsPerLine
})
const breakpoints = useBreakpoints(WebBrowserUtils.breakpoints)
const linesPerPage = computed(() => {
  let lines = 5

  if (isSizeTabletOrSmaller.value) {
    lines = 10
  }

  return lines
})
const isSizeSmartphonePortrait = breakpoints.smaller('smartphoneLandscape')
const isSizeTabletPortaitOrSmaller = breakpoints.smaller('tabletLandscape')
const isSizeTabletOrSmaller = breakpoints.smaller('pc')
const isSizePcOrSmaller = breakpoints.smaller('pcLarge')

const itemsInternal = ref<IItem[]>([])

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
 * Indicates whether an item is selected.
 * @param item - Item.
 * @returns true when the build is selected; otherwise false.
 */
function checkIsSelected(item: IItem): boolean {
  const isSelected = modelSelectedItems.value.some(sbi => sbi.id === item.id)

  return isSelected
}

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

/**
 * Updates the list of selected items.
 * @param item - Item.
 * @param isSelected - Indicates whether the item is selected.
 */
function onSelectedItemsChanged(item: IItem, isSelected: boolean): void {
  if (isSelected) {
    if (props.selectionOptions.isMultiSelection) {
      modelSelectedItems.value = [
        ...modelSelectedItems.value,
        item
      ]
    } else {
      modelSelectedItems.value = [item]
    }
  } else {
    modelSelectedItems.value = modelSelectedItems.value.filter(i => i.id !== item.id)
  }
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
      :element-height="selectionOptions.isEnabled ? 207 : 156"
      :elements-per-line="itemsPerLine"
      :elements="itemsInternal"
      :get-key-function="i => (i as IItem).id"
      :scroll-to-index="firstSelectedItemIndex"
    >
      <template #element="{ element }">
        <ItemCard
          :item="<IItem>element"
          :is-selected="checkIsSelected(<IItem>element)"
          :selection-options="selectionOptions"
          @update:is-selected="onSelectedItemsChanged(<IItem>element, $event)"
        />
      </template>
    </InfiniteScroller>
    <Paginator
      v-else-if="itemsInternal.length > 0 && !infiniteScrolling"
      :elements-per-line="itemsPerLine"
      :elements="itemsInternal"
      :get-key-function="i => (i as IItem).id"
      :lines-per-page="linesPerPage"
      :scroll-to-index="firstSelectedItemIndex"
    >
      <template #element="{ element }">
        <ItemCard
          :item="<IItem>element"
          :is-selected="checkIsSelected(<IItem>element)"
          :selection-options="selectionOptions"
          @update:is-selected="onSelectedItemsChanged(<IItem>element, $event)"
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