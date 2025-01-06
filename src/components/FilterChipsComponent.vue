<script setup lang="ts">
import { useBreakpoints, useEventListener, watchDebounced } from '@vueuse/core'
import { computed, inject, Ref, ref, watch } from 'vue'
import BuildFilterAndSortingData from '../models/utils/BuildFilterAndSortingData'
import { FilterAndSortingDataType } from '../models/utils/FilterAndSortingData'
import { GlobalSidebarDisplayedComponentParameters } from '../models/utils/IGlobalSidebarOptions'
import ItemFilterAndSortingData from '../models/utils/ItemFilterAndSortingData'
import { SortingOrder } from '../models/utils/SortingOrder'
import vueI18n from '../plugins/vueI18n'
import { GlobalSidebarService } from '../services/GlobalSidebarService'
import Services from '../services/repository/Services'
import { SortingService } from '../services/sorting/SortingService'
import StringUtils from '../utils/StringUtils'
import WebBrowserUtils from '../utils/WebBrowserUtils'
import InputTextField from './InputTextFieldComponent.vue'
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

const canRemoveCategoryIdFilter = computed(() => modelFilterAndSortingData.value.type === FilterAndSortingDataType.item
  && (modelFilterAndSortingData.value as ItemFilterAndSortingData).categoryId != null
  && !(modelFilterAndSortingData.value as ItemFilterAndSortingData).isCategoryIdReadOnly)
const canRemoveFilter = computed(() =>
  (modelFilterAndSortingData.value.filter != null
    && modelFilterAndSortingData.value.filter !== '')
  || canRemoveCategoryIdFilter.value)
const categoryFilterCaption = computed(() => {
  let caption: string | undefined = undefined
  const itemFilterAndSortingData = modelFilterAndSortingData.value as ItemFilterAndSortingData

  if (itemFilterAndSortingData?.categoryId != null) {
    caption = vueI18n.t(`caption.category${StringUtils.toUpperFirst(itemFilterAndSortingData.categoryId)}`)
  }

  return caption
})
const filterCaption = computed(() => modelFilterAndSortingData.value.filter)
const filterTooltip = computed(() => {
  let hasCategory = false

  if (modelFilterAndSortingData.value.type === FilterAndSortingDataType.item) {
    hasCategory = (modelFilterAndSortingData.value as ItemFilterAndSortingData).categoryId != null
  }

  const hasFilter = modelFilterAndSortingData.value.filter != null && modelFilterAndSortingData.value.filter !== ''

  if (!hasCategory && !hasFilter) {
    return vueI18n.t('caption.addFilter')
  }

  let tooltip = ''

  if (hasCategory) {
    tooltip += vueI18n.t('caption.filteredWith1', { category: vueI18n.t(`caption.category${StringUtils.toUpperFirst((modelFilterAndSortingData.value as ItemFilterAndSortingData).categoryId!)}`) })
  }

  if (hasFilter) {
    if (hasCategory) {
      tooltip += '\n'
    }

    tooltip += vueI18n.t('caption.filteredWith2', { filter: modelFilterAndSortingData.value.filter })
  }

  return tooltip
})
const property = computed({
  get: () => modelFilterAndSortingData.value.property,
  set: (value: string) => {
    if (modelFilterAndSortingData.value.type === FilterAndSortingDataType.item) {
      _sortingService.setSortingProperty(
        modelFilterAndSortingData.value as ItemFilterAndSortingData,
        value,
        modelFilterAndSortingData.value.order)
      modelFilterAndSortingData.value = copyFilterAndSortingData(modelFilterAndSortingData.value)
    } else {
      _sortingService.setSortingProperty(
        modelFilterAndSortingData.value as BuildFilterAndSortingData,
        value,
        modelFilterAndSortingData.value.order)
      modelFilterAndSortingData.value = copyFilterAndSortingData(modelFilterAndSortingData.value)
    }
  }
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
const switchSortOrderButtonTooltip = computed(() => vueI18n.t(
  'caption.switchSortOrder',
  {
    currentSortOrder: modelFilterAndSortingData.value.order === SortingOrder.asc
      ? vueI18n.t('caption.ascendant').toLocaleLowerCase()
      : vueI18n.t('caption.descendant').toLocaleLowerCase()
  }))

const breakpoints = useBreakpoints(WebBrowserUtils.breakpoints)
const isCompactMode = breakpoints.smaller('tabletPortrait')
const isTouchScreen = inject<Ref<boolean>>('isTouchScreen')
const filterInternal = ref(modelFilterAndSortingData.value.filter)

watch(
  () => modelFilterAndSortingData.value.filter,
  () => filterInternal.value = modelFilterAndSortingData.value.filter)

watchDebounced(
  // Applies the filter only 500ms after the last letter is typed
  filterInternal,
  () => applyQuickFilter(),
  { debounce: 500 })

/**
 * Applies the quick filter.
 */
function applyQuickFilter(): void {
  modelFilterAndSortingData.value.filter = filterInternal.value
  modelFilterAndSortingData.value = copyFilterAndSortingData(modelFilterAndSortingData.value)
}

/**
 * Checks whether filter and sorting data are different from the current ones.
 * @param updatedFilterAndSortingData - Filter and sorting data to check.
 */
function checkIsFilterAndSortingDataChanged(updatedFilterAndSortingData: GlobalSidebarDisplayedComponentParameters | undefined): boolean {
  updatedFilterAndSortingData = updatedFilterAndSortingData as BuildFilterAndSortingData | ItemFilterAndSortingData

  if (updatedFilterAndSortingData.filter !== modelFilterAndSortingData.value.filter
    || updatedFilterAndSortingData.order !== modelFilterAndSortingData.value.order
    || updatedFilterAndSortingData.property !== modelFilterAndSortingData.value.property) {
    return true
  }

  if (modelFilterAndSortingData.value.type === FilterAndSortingDataType.item
    && (updatedFilterAndSortingData as ItemFilterAndSortingData).categoryId !== (modelFilterAndSortingData.value as ItemFilterAndSortingData).categoryId) {
    return true
  }

  return false
}

/**
 * Creates a copy of filter and sorting data.
 * @param filterAndSortingToCopy - Filter and sorting data to copy.
 */
function copyFilterAndSortingData(filterAndSortingToCopy: BuildFilterAndSortingData | ItemFilterAndSortingData): BuildFilterAndSortingData | ItemFilterAndSortingData {
  let copy: BuildFilterAndSortingData | ItemFilterAndSortingData

  if (modelFilterAndSortingData.value.type === FilterAndSortingDataType.item) {
    copy = new ItemFilterAndSortingData(filterAndSortingToCopy.sortingFunctions, filterAndSortingToCopy as ItemFilterAndSortingData)
  } else {
    copy = new BuildFilterAndSortingData(filterAndSortingToCopy as BuildFilterAndSortingData)
  }

  return copy
}

/**
 * Reacts to a keyboard event.
 * @param event - Keyboard event.
 */
function onKeyDown(event: KeyboardEvent): void {
  const isGlobalSidebarDisplayed = _globalSidebarService.isDisplayed()

  if (event.key === 'f'
    && (event.ctrlKey || event.metaKey)
    && !isGlobalSidebarDisplayed) {
    event.preventDefault() // Prevents the browser save action to be triggered
    showFilterAndSortSidebar()
  }
}

/**
 * Removes the current filter.
 */
function removeFilter(): void {
  modelFilterAndSortingData.value.filter = undefined

  if (canRemoveCategoryIdFilter.value) {
    (modelFilterAndSortingData.value as ItemFilterAndSortingData).categoryId = undefined
  }

  modelFilterAndSortingData.value = copyFilterAndSortingData(modelFilterAndSortingData.value)
}

/**
 * Opens the filter and sort sidebar.
 */
function showFilterAndSortSidebar(): void {
  _globalSidebarService.display({
    displayedComponentType: props.filterSidebarComponent,
    displayedComponentParameters: modelFilterAndSortingData.value,
    onCloseAction: (updatedParameters) => {
      const hasChanged = checkIsFilterAndSortingDataChanged(updatedParameters)

      if (hasChanged) {
        modelFilterAndSortingData.value = updatedParameters as BuildFilterAndSortingData | ItemFilterAndSortingData
      }
    }
  })
}

/**
 * Switches the sort order.
 */
function switchSortOrder(): void {
  _sortingService.setSortingProperty(
    modelFilterAndSortingData.value,
    modelFilterAndSortingData.value.property,
    -modelFilterAndSortingData.value.order)
  modelFilterAndSortingData.value = copyFilterAndSortingData(modelFilterAndSortingData.value)
}
</script>










<template>
  <Sticky
    :element-to-stick-to="elementToStickTo"
    align="left"
  >
    <div class="filter-chips">
      <!-- Sorting chip -->
      <Chip class="filter-chip filter-chip-content">
        <div class="filter-chip-icon-button-left">
          <Tooltip
            :tooltip="switchSortOrderButtonTooltip"
            class="filter-chip-icon"
            @click="switchSortOrder"
          >
            <font-awesome-icon :icon="sortChipIcon" />
          </Tooltip>
        </div>
        <Tooltip
          v-if="isCompactMode"
          :tooltip="sortButtonTooltip"
          class="filter-chip-text"
        >
          <span @click="showFilterAndSortSidebar">
            {{ $t(`caption.${modelFilterAndSortingData.property}`) }}
          </span>
        </Tooltip>
        <Dropdown
          v-else
          v-model="property"
          :filter-fields="['caption']"
          :option-label="o => $t(`caption.${o.name}`)"
          :options="modelFilterAndSortingData.sortableProperties"
          class="filter-chip-quick-filter-input"
          style="margin-left: 0.5rem"
          option-value="name"
        />
      </Chip>
      <!-- Add filter chip -->
      <Chip
        v-if="isCompactMode && categoryFilterCaption == null && filterCaption == null"
        class="filter-chip"
        @click="showFilterAndSortSidebar"
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
      <!-- Filter chip -->
      <Chip
        v-else
        class="filter-chip filter-chip-content"
      >
        <!-- Mobile -->
        <Tooltip
          v-if="isCompactMode"
          :tooltip="filterTooltip"
          class="filter-chip-content"
          @click="showFilterAndSortSidebar"
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
        <!-- With quick filter -->
        <div
          v-else
          class="filter-chip-content"
          @click="showFilterAndSortSidebar"
        >
          <Tooltip
            class="filter-chip-content filter-chip-icon-button-left"
            :tooltip="filterTooltip"
          >
            <div
              v-if="categoryFilterCaption == null && filterCaption == null"
              class="filter-chip-icon"
              style="color: var(--success-color);"
            >
              <font-awesome-icon icon="plus" />
            </div>
            <div
              v-else
              class="filter-chip-icon"
            >
              <font-awesome-icon icon="filter" />
            </div>
          </Tooltip>
          <div class="filter-chip-quick-filter">
            <Tooltip
              v-if="categoryFilterCaption != null"
              class="filter-chip-text"
              :tooltip="filterTooltip"
            >
              <div class="">
                <span>{{ categoryFilterCaption }}</span>
              </div>
            </Tooltip>
            <div
              class="filter-chip-quick-filter-input"
              :class="{
                'filter-chip-quick-filter-input-with-category': categoryFilterCaption != null,
                'filter-chip-quick-filter-input-with-remove-button': canRemoveFilter
              }"
              @click="$event => $event.stopPropagation()"
            >
              <InputTextField
                v-model:value="filterInternal"
                :autofocus="!isTouchScreen"
                :caption="$t('caption.addFilter')"
                caption-mode="placeholder"
              />
            </div>
          </div>
        </div>
        <!-- Remove filter button -->
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
  border-color: var(--primary-color3);
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
  grid-template-columns: auto auto auto;
  height: 100%;
  width: 100%;
}

.filter-chip-icon {
  align-items: center;
  display: flex;
  height: 100%;
  padding-bottom: 0.25rem;
  padding-left: 0.5rem;
  padding-right: 0.5rem;
  padding-top: 0.25rem;
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

.filter-chip-quick-filter > .filter-chip-text {
  padding-bottom: 0.25rem;
  padding-left: 0.75rem;
  padding-top: 0.25rem;
}

.filter-chip-quick-filter-input {
  align-items: center;
  display: flex;
  margin-bottom: 0.25rem;
  margin-left: 0.5rem;
  margin-right: 0.75rem;
  margin-top: 0.25rem;
}

.filter-chip-quick-filter-input-with-category {
  margin-bottom: 0.25rem;
  margin-top: 0;
}

.filter-chip-quick-filter-input-with-remove-button {
  margin-right: 0.5rem;
}

.filter-chip-text {
  display: flex;
  flex-direction: column;
  height: 100%;
  justify-content: center;
  overflow: hidden;
  padding: 0.25rem;
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









<style>
.filter-chip-quick-filter-input > .input-text-field > input,
.filter-chip-quick-filter-input.p-dropdown {
  height: 1.75rem;
}
</style>