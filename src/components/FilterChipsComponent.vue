<script setup lang="ts">
import { useEventListener } from '@vueuse/core'
import { computed } from 'vue'
import { IItem } from '../models/item/IItem'
import BuildFilterAndSortingData from '../models/utils/BuildFilterAndSortingData'
import { IBuildSummary } from '../models/utils/IBuildSummary'
import ItemFilterAndSortingData from '../models/utils/ItemFilterAndSortingData'
import { SortingOrder } from '../models/utils/SortingOrder'
import vueI18n from '../plugins/vueI18n'
import { GlobalSidebarService } from '../services/GlobalSidebarService'
import Services from '../services/repository/Services'
import { ISortingFunction } from '../services/sorting/functions/ISortingFunction'
import { SortingService } from '../services/sorting/SortingService'
import StringUtils from '../utils/StringUtils'
import Sticky from './StickyComponent.vue'
import Tooltip from './TooltipComponent.vue'

const modelFilterAndSortingData = defineModel<BuildFilterAndSortingData | ItemFilterAndSortingData>('filterAndSortingData', { required: true })

const props = withDefaults(
  defineProps<{
    elementToStickTo?: HTMLElement | null,
    filterSidebarComponent: 'BuildsListSidebar' | 'ItemsListSidebar'
  }>(),
  {
    elementToStickTo: undefined
  })

const _globalSidebarService = Services.get(GlobalSidebarService)
const _sortingService = Services.get(SortingService)

useEventListener(document, 'keydown', onKeyDown)

const categoryFilterCaption = computed(() => {
  let caption: string | undefined = undefined
  const itemFilterAndSortingData = modelFilterAndSortingData.value as ItemFilterAndSortingData

  if (itemFilterAndSortingData?.categoryId != null) {
    caption = vueI18n.t(`caption.category${StringUtils.toUpperFirst(itemFilterAndSortingData.categoryId)}`)
  }

  return caption
})
const filterCaption = computed(() => {
  let caption: string | undefined = undefined

  if (modelFilterAndSortingData.value.filter != null) {
    caption = modelFilterAndSortingData.value.filter
  }

  return caption
})
const filterTooltip = computed(() => {
  const itemFilterAndSortingData = modelFilterAndSortingData.value as ItemFilterAndSortingData
  let tooltip = ''

  if (itemFilterAndSortingData?.categoryId != null) {
    tooltip += vueI18n.t('caption.filteredWith1', { category: vueI18n.t(`caption.category${StringUtils.toUpperFirst(itemFilterAndSortingData.categoryId)}`) })
  }

  if (modelFilterAndSortingData.value.filter != null) {
    if (tooltip !== '') {
      tooltip += '\n'
    }

    tooltip += vueI18n.t('caption.filteredWith2', { filter: modelFilterAndSortingData.value.filter })
  }

  return tooltip !== '' ? tooltip : undefined
})
const sortButtonTooltip = computed(() => vueI18n.t(
  'caption.sortedBy',
  {
    property: vueI18n.t(`caption.${modelFilterAndSortingData.value.property}`).toLocaleLowerCase(),
    order: modelFilterAndSortingData.value.order === SortingOrder.asc
      ? vueI18n.t('caption.ascendant').toLocaleLowerCase()
      : vueI18n.t('caption.descendant').toLocaleLowerCase()
  }))
const sortChipIcon = computed(() => modelFilterAndSortingData.value.order === SortingOrder.asc ? 'sort-amount-down-alt' : 'sort-amount-up')

/**
 * Reacts to a keyboard event.
 * @param event - Keyboard event.
 */
function onKeyDown(event: KeyboardEvent): void {
  if (event.key === 'f'
    && (event.ctrlKey
      || event.metaKey)) {

    if (!_globalSidebarService.isDisplayed()) {
      event.preventDefault() // Prevents the browser save action to be triggered
      showFilterAndSortSidebar(true)
    }
  }
}

/**
 * Opens the filter and sort sidebar.
 * @param focusFilter - Indicates whether the filter field should be focused.
 */
function showFilterAndSortSidebar(focusFilter: boolean): void {
  _globalSidebarService.display({
    displayedComponentType: props.filterSidebarComponent,
    displayedComponentParameters: {
      ...modelFilterAndSortingData.value,
      focusFilter
    },
    onCloseAction: (updatedParameters) => {
      modelFilterAndSortingData.value = <BuildFilterAndSortingData | ItemFilterAndSortingData>updatedParameters
    }
  })
}

/**
 * Switches the sort order.
 */
function switchSortOrder(): void {
  const isItemFilterAndSortingData = (modelFilterAndSortingData.value as unknown as Record<string, unknown>)['isCategoryReadOnly'] != null

  if (isItemFilterAndSortingData) {
    const itemFilterAndSortingData = { ...modelFilterAndSortingData.value } as ItemFilterAndSortingData
    const sortingFunctions: Record<string, ISortingFunction<IItem>> = {}
    sortingFunctions[itemFilterAndSortingData.property] = { ...itemFilterAndSortingData.currentSortingFunction }
    modelFilterAndSortingData.value = _sortingService.setSortingProperty(
      itemFilterAndSortingData,
      itemFilterAndSortingData.property,
      -itemFilterAndSortingData.order
    ) as ItemFilterAndSortingData
  } else {
    const buildFilterAndSortingData = { ...modelFilterAndSortingData.value } as BuildFilterAndSortingData
    const sortingFunctions: Record<string, ISortingFunction<IBuildSummary>> = {}
    sortingFunctions[buildFilterAndSortingData.property] = { ...buildFilterAndSortingData.currentSortingFunction }
    modelFilterAndSortingData.value = _sortingService.setSortingProperty(
      buildFilterAndSortingData,
      buildFilterAndSortingData.property,
      -buildFilterAndSortingData.order)
  }
}
</script>










<template>
  <Sticky
    :element-to-stick-to="elementToStickTo"
    align="left"
  >
    <div class="filter-chips">
      <Chip class="filter-chip">
        <div
          class="filter-chip-icon"
          @click="switchSortOrder"
        >
          <font-awesome-icon :icon="sortChipIcon" />
        </div>
        <Tooltip
          :tooltip="sortButtonTooltip"
          class="filter-chip-text"
          position="right"
          style="width: 100%;"
        >
          <span @click="showFilterAndSortSidebar(false)">
            {{ $t(`caption.${modelFilterAndSortingData.property}`) }}
          </span>
        </Tooltip>
      </Chip>
      <Chip
        v-if="categoryFilterCaption == null && filterCaption == null"
        class="filter-chip"
        @click="showFilterAndSortSidebar(true)"
      >
        <Tooltip :tooltip="$t('caption.addFilter')">
          <div class="filter-chip-group">
            <div class="filter-chip-icon">
              <font-awesome-icon icon="filter" />
            </div>
            <span>{{ $t('caption.filter') }}</span>
            <div class="filter-chip-icon-button filter-chip-icon-button-add-filter">
              <font-awesome-icon icon="plus" />
            </div>
          </div>
        </Tooltip>
      </Chip>
      <Chip
        v-else
        class="filter-chip"
        @click="showFilterAndSortSidebar(true)"
      >
        <div class="filter-chip-icon">
          <font-awesome-icon icon="filter" />
        </div>
        <Tooltip
          :tooltip="filterTooltip"
          class="filter-chip-text"
          style="overflow: hidden;"
        >
          <div class="filter-chip-caption-multiline">
            <span>{{ categoryFilterCaption }}</span>
            <span>{{ filterCaption }}</span>
          </div>
        </Tooltip>
      </Chip>
    </div>
  </Sticky>
</template>










<style scoped>
.filter-chip {
  background-color: var(--surface-300);
  border-color: var(--primary-color);
  border-style: solid;
  border-width: 1px;
  cursor: pointer;
  display: flex;
  flex-wrap: nowrap;
  font-size: 0.85rem;
  height: 100%;
  overflow: hidden;
  padding: 0.5rem;
}

.filter-chip-caption-multiline {
  display: flex;
  flex-direction: column;
  justify-content: center;
  overflow: hidden;
}

.filter-chip-caption-multiline > span {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  width: 100%;
}

.filter-chip-icon {
  padding-right: 0.5rem;
}

.filter-chip-icon-button {
  align-items: center;
  display: flex;
  justify-content: center;
  padding-left: 1rem;
}

.filter-chip-icon-button:hover {
  cursor: pointer;
}

.filter-chip-icon-button-add-filter {
  color: var(--success-color);
}

.filter-chip-icon-button-remove-filter {
  color: var(--error-color);
}

.filter-chip-text {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  width: 100%;
}

.filter-chips {
  align-items: center;
  display: grid;
  grid-gap: 0.5rem;
  grid-template-columns: auto auto;
  margin-bottom: 0.5rem;
  margin-top: 0.5rem;
}

.filter-chips-container {
  margin-bottom: 0.5rem;
  margin-right: auto;
  display: flex;
}
</style>