<script setup lang="ts">
import { computed, nextTick, onMounted, onUnmounted, ref, watch } from 'vue'
import { IItem, ItemCategoryId } from '../models/item/IItem'
import { IListSelectionOptions } from '../models/utils/IListSelectionOptions'
import ItemFilterAndSortingData from '../models/utils/ItemFilterAndSortingData'
import { GlobalFilterService } from '../services/GlobalFilterService'
import { ItemPropertiesService } from '../services/ItemPropertiesService'
import { ItemService } from '../services/ItemService'
import { ServiceInitializationState } from '../services/repository/ServiceInitializationState'
import Services from '../services/repository/Services'
import { ItemSortingFunctions } from '../services/sorting/functions/itemSortingFunctions'
import { SortingService } from '../services/sorting/SortingService'
import WebBrowserUtils from '../utils/WebBrowserUtils'
import FilterChips from './FilterChipsComponent.vue'
import InfiniteScroller from './InfiniteScrollerComponent.vue'
import ItemCard from './item-card/ItemCardComponent.vue'
import Loading from './LoadingComponent.vue'
import Paginator from './PaginatorComponent.vue'

const modelSelectedItems = defineModel<IItem[]>('selectedItems', { required: false, default: [] })
const modelFilterAndSortingData = defineModel<ItemFilterAndSortingData>('filterAndSortingData', { required: false, default: new ItemFilterAndSortingData(ItemSortingFunctions) })

const props = withDefaults(
  defineProps<{
    autoScrollToFirstElement?: boolean,
    elementToStickTo?: HTMLElement | null,
    getItemsFunction: () => Promise<IItem[]>,
    infiniteScrolling?: boolean,
    maxElementsPerLine?: number,
    selectionOptions?: IListSelectionOptions
  }>(),
  {
    autoScrollToFirstElement: true,
    elementToStickTo: undefined,
    infiniteScrolling: false,
    maxElementsPerLine: 5,
    selectionOptions: () => <IListSelectionOptions>{
      canUnselect: true,
      isEnabled: false,
      isMultiSelection: false,
      selectionButtonCaption: undefined,
      selectionButtonIcon: undefined
    }
  })

const _globalFilterService = Services.get(GlobalFilterService)
const _itemPropertiesService = Services.get(ItemPropertiesService)
const _itemService = Services.get(ItemService)
const _sortingService = Services.get(SortingService)

const comparisonItem = computed(() =>
  !props.selectionOptions.isMultiSelection && props.selectionOptions.showStatsComparison
    ? modelSelectedItems.value[0]
    : undefined)
const elementHeight = computed(() => {
  let h = 169 // 12rem + 1px base height with one weight / price line and 2 stats lines

  if (props.selectionOptions.isEnabled) {
    h += 49 // 3.5rem for the select button
  }

  if (isSmartphonePortrait.value) {
    h += 28 // 2rem because when in smartphone portrait, one less stats columns but one more stats line
  }

  return h
})
const elementsitemsPerLine = computed(() => {
  let columns = 5

  if (isSmartphonePortrait.value) {
    columns = 1
  } else if (isTabletPortraitOrSmaller.value) {
    columns = 2
  } else if (isTabletLandscapeOrSmaller.value) {
    columns = 3
  } else if (isPcOrSmaller.value) {
    columns = 4
  }

  return props.maxElementsPerLine >= columns ? columns : props.maxElementsPerLine
})
const firstSelectedItemIndex = computed(() => filteredAnSortedItems.value.findIndex(i => i.id === modelSelectedItems.value[0]?.id))
const linesPerPage = computed(() => {
  let lines = 4

  if (isTabletLandscapeOrSmaller.value) {
    lines = 10
  }

  return lines
})

const filteredAnSortedItems = ref<IItem[]>([])
const isInitialed = ref(false)
const isLoading = ref(true)
const {
  isSmartphonePortrait,
  isTabletPortraitOrSmaller,
  isTabletLandscapeOrSmaller,
  isPcOrSmaller
} = WebBrowserUtils.getScreenSize()

onMounted(() => {
  _globalFilterService.emitter.on(GlobalFilterService.changeEvent, onMerchantFilterChanged)

  // Getting the items once they have been fully initialized
  if (_itemService.initializationState === ServiceInitializationState.initializing) {
    _itemService.emitter.once(ItemService.initializationFinishedEvent, () => {
      filterAndSortItemsAsync(true)
      isInitialed.value = true
    })
  } else {
    filterAndSortItemsAsync(true)
    isInitialed.value = true
  }
})

onUnmounted(() => _globalFilterService.emitter.off(GlobalFilterService.changeEvent, onMerchantFilterChanged))

watch(
  () => modelFilterAndSortingData.value,
  (value: ItemFilterAndSortingData, oldValue: ItemFilterAndSortingData) => {
    filterAndSortItemsAsync(value.categoryId != oldValue.categoryId || value.filter !== oldValue.filter)
  })

/**
 * Indicates whether an item is selected.
 * @param item - Item.
 * @returns `true` when the build is selected; otherwise `false`.
 */
function checkIsSelected(item: IItem): boolean {
  const isSelected = modelSelectedItems.value.some(sbi => sbi.id === item.id)

  return isSelected
}

/**
 * Filters and sorts items.
 * @param hasFilterChanged - Indicates whether the filter has changed.
 */
async function filterAndSortItemsAsync(itemsListNeedsUpdate: boolean): Promise<void> {
  isLoading.value = true
  let itemsToFilterAndSort

  if (itemsListNeedsUpdate) {
    itemsToFilterAndSort = await props.getItemsFunction()

    const fasd = new ItemFilterAndSortingData(modelFilterAndSortingData.value.sortingFunctions, modelFilterAndSortingData.value)
    fasd.availableItemCategories = getAvailableItemCategoryIdsFromItems(itemsToFilterAndSort)

    filteredAnSortedItems.value = itemsToFilterAndSort
    modelFilterAndSortingData.value = fasd

    // Updating the filter and sorting data will call again filterAndSortItemsAsync.
    // The second time it is called, itemsListNeedsUpdate will be false and items will only be filtered and sorted
  } else {
    itemsToFilterAndSort = [...filteredAnSortedItems.value]
    itemsToFilterAndSort = await filterItemsAsync(itemsToFilterAndSort)
    itemsToFilterAndSort = await sortItemsAsync(itemsToFilterAndSort)
    filteredAnSortedItems.value = itemsToFilterAndSort

    nextTick(() => isLoading.value = false)
  }
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

  const filteredItemSummaries: IItem[] = []
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
          filteredItemSummaries.push(itemToFilter)
        }
      }

      resolve()
    }))
  }

  await Promise.allSettled(promises)

  return filteredItemSummaries
}

/**
 * Gets the list of available item category IDs from the comple list of items.
 */
function getAvailableItemCategoryIdsFromItems(items: IItem[]): ItemCategoryId[] {
  let categoryIds: ItemCategoryId[] = []

  if (items.length > 0) {
    categoryIds = Array.from(new Set(items.map(i => i.categoryId))) // Set removes duplicates
  }

  return categoryIds
}

/**
 * Reacts to a the merchant filter changing.
 *
 * Filters and sorts them.
 */
function onMerchantFilterChanged(): void {
  filterAndSortItemsAsync(true)
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
  <div class="items-list-container">
    <div
      v-if="!isInitialed || isLoading"
      class="items-list-loading"
    >
      <Loading />
    </div>
    <div
      v-if="isInitialed"
      class="items-list"
    >
      <FilterChips
        v-model:filter-and-sorting-data="modelFilterAndSortingData"
        :element-to-stick-to="elementToStickTo"
        filter-sidebar-component="ItemsListSidebar"
      />
      <InfiniteScroller
        v-if="infiniteScrolling && filteredAnSortedItems.length > 0"
        v-show="!isLoading"
        :auto-scroll-to-first-element="autoScrollToFirstElement"
        :element-height="elementHeight"
        :elements-per-line="elementsitemsPerLine"
        :elements="filteredAnSortedItems"
        :get-key-function="i => (i as IItem).id"
        :scroll-to-index="firstSelectedItemIndex"
      >
        <template #element="{ element }">
          <ItemCard
            :comparison-item="comparisonItem"
            :filter-and-sorting-data="filterAndSortingData"
            :item="<IItem>element"
            :is-selected="checkIsSelected(<IItem>element)"
            :selection-options="selectionOptions"
            @update:is-selected="onSelectedItemsChanged(<IItem>element, $event)"
          />
        </template>
      </InfiniteScroller>
      <Paginator
        v-else-if="!infiniteScrolling && filteredAnSortedItems.length > 0"
        v-show="!isLoading"
        :auto-scroll-to-first-element-of-page="autoScrollToFirstElement"
        :elements-per-line="elementsitemsPerLine"
        :elements="filteredAnSortedItems"
        :get-key-function="i => (i as IItem).id"
        :lines-per-page="linesPerPage"
        :scroll-to-index="firstSelectedItemIndex"
      >
        <template #element="{ element }">
          <ItemCard
            :comparison-item="comparisonItem"
            :filter-and-sorting-data="filterAndSortingData"
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
  </div>
</template>










<style scoped>
.items-list {
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
}

.items-list-container {
  align-items: center;
  display: flex;
  height: 100%;
  justify-content: center;
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