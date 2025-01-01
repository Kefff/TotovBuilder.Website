<script setup lang="ts">
import { useEventListener } from '@vueuse/core'
import { computed } from 'vue'
import BuildFilterAndSortingData from '../models/utils/BuildFilterAndSortingData'
import ItemFilterAndSortingData from '../models/utils/ItemFilterAndSortingData'
import { SortingOrder } from '../models/utils/SortingOrder'
import vueI18n from '../plugins/vueI18n'
import { GlobalSidebarService } from '../services/GlobalSidebarService'
import Services from '../services/repository/Services'
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

const canRemoveCategoryIdFilter = computed(() => isItemFilterAndSortingData.value
  && (modelFilterAndSortingData.value as ItemFilterAndSortingData).categoryId != null
  && !(modelFilterAndSortingData.value as ItemFilterAndSortingData).isCategoryReadOnly)
const canRemoveFilter = computed(() =>
  modelFilterAndSortingData.value.filter != null
  || canRemoveCategoryIdFilter.value)
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
const isItemFilterAndSortingData = computed(() => (modelFilterAndSortingData.value as unknown as Record<string, unknown>)['isCategoryReadOnly'] != null)
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

function removeFilter(): void {
  const updatedFilterAndSortingData = {
    ...modelFilterAndSortingData.value,
    filter: undefined
  }

  if (canRemoveCategoryIdFilter.value) {
    (updatedFilterAndSortingData as ItemFilterAndSortingData).categoryId = undefined
  }

  modelFilterAndSortingData.value = updatedFilterAndSortingData
}

/**
 * Switches the sort order.
 */
function switchSortOrder(): void {
  const isItemFilterAndSortingData = (modelFilterAndSortingData.value as unknown as Record<string, unknown>)['isCategoryReadOnly'] != null

  if (isItemFilterAndSortingData) {
    modelFilterAndSortingData.value = _sortingService.setSortingProperty(
      modelFilterAndSortingData.value as ItemFilterAndSortingData,
      modelFilterAndSortingData.value.property,
      -modelFilterAndSortingData.value.order) as ItemFilterAndSortingData
  } else {
    modelFilterAndSortingData.value = _sortingService.setSortingProperty(
      modelFilterAndSortingData.value as BuildFilterAndSortingData,
      modelFilterAndSortingData.value.property,
      -modelFilterAndSortingData.value.order)
  }
}
</script>










<template>
  <Sticky
    :element-to-stick-to="elementToStickTo"
    align="left"
  >
    <div class="filter-chips">
      <Chip class="filter-chip filter-chip-content">
        <div class="filter-chip-icon-button-left">
          <Tooltip
            :tooltip="$t('caption.switchSortOrder')"
            class="filter-chip-icon"
            @click="switchSortOrder"
          >
            <font-awesome-icon :icon="sortChipIcon" />
          </Tooltip>
        </div>
        <Tooltip
          :tooltip="sortButtonTooltip"
          class="filter-chip-text"
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
        <Tooltip
          :tooltip="$t('caption.addFilter')"
          class="filter-chip-content"
        >
          <div
            class="filter-chip-icon"
            style="color: var(--success-color);"
          >
            <font-awesome-icon icon="plus" />
          </div>
          <span
            class="filter-chip-text"
            style="padding-left: 0;"
          >
            {{ $t('caption.filter') }}
          </span>
        </Tooltip>
      </Chip>
      <Chip
        v-else
        class="filter-chip filter-chip-content"
      >
        <Tooltip
          :tooltip="filterTooltip"
          class="filter-chip-content"
          @click="showFilterAndSortSidebar(true)"
        >
          <div class="filter-chip-icon">
            <font-awesome-icon icon="filter" />
          </div>
          <div
            class="filter-chip-text"
            style="padding-left: 0;"
          >
            <span>{{ categoryFilterCaption }}</span>
            <span>{{ filterCaption }}</span>
          </div>
        </Tooltip>
        <div
          v-show="canRemoveFilter"
          class="filter-chip-icon-button-right"
        >
          <Tooltip
            :tooltip="$t('caption.removeFilter')"
            style="color: var(--error-color);"
            class="filter-chip-icon"
            @click="removeFilter"
          >
            <font-awesome-icon icon="times" />
          </Tooltip>
        </div>
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
  overflow: hidden;
  padding: 0rem;
}

.filter-chip:hover {
  cursor: pointer;
}

.filter-chip-content {
  align-items: center;
  display: grid;
  grid-template-columns: auto auto;
  height: 100%;
  width: 100%;
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
  align-items: center;
  display: flex;
  height: 100%;
  padding: 0.5rem;
}

.filter-chip-icon-button-left {
  align-items: center;
  border-right-color: var(--primary-color6);
  border-right-style: solid;
  border-right-width: 1px;
  display: flex;
  height: 100%;
  justify-content: center;
}

.filter-chip-icon-button-right {
  align-items: center;
  border-left-color: var(--primary-color6);
  border-left-style: solid;
  border-left-width: 1px;
  display: flex;
  height: 100%;
  justify-content: center;
}

.filter-chip-text {
  display: flex;
  flex-direction: column;
  height: 100%;
  justify-content: center;
  overflow: hidden;
  padding: 0.5rem;
  width: 100%;
}

.filter-chip-text > span {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
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