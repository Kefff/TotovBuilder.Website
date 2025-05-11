<script setup lang="ts">
import { useEventListener, watchDebounced } from '@vueuse/core'
import { computed, inject, onMounted, onUnmounted, Ref, ref, watch } from 'vue'
import BuildFilterAndSortingData from '../models/utils/BuildFilterAndSortingData'
import { FilterAndSortingDataType } from '../models/utils/FilterAndSortingData'
import { IGlobalFilter } from '../models/utils/IGlobalFilter'
import { GlobalSidebarDisplayedComponentParameters } from '../models/utils/IGlobalSidebarOptions'
import ItemFilterAndSortingData from '../models/utils/ItemFilterAndSortingData'
import { SortingOrder } from '../models/utils/SortingOrder'
import vueI18n from '../plugins/vueI18n'
import { GlobalFilterService } from '../services/GlobalFilterService'
import { GlobalSidebarService } from '../services/GlobalSidebarService'
import Services from '../services/repository/Services'
import StringUtils from '../utils/StringUtils'
import WebBrowserUtils from '../utils/WebBrowserUtils'
import InputTextField from './InputTextFieldComponent.vue'
import MerchantIcon from './MerchantIconComponent.vue'
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

const _globalFilterService = Services.get(GlobalFilterService)
const _globalSidebarService = Services.get(GlobalSidebarService)

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
const enabledMerchants = computed(() => {
  const merchants = globalFilter.value?.merchantFilters.filter(mf => mf.enabled) ?? []

  return merchants
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
const merchantsTooltip = computed(() => {
  let tooltip = vueI18n.t('caption.merchantItemsOptions')

  if (globalFilter.value == null) {
    return tooltip
  }

  if (!globalFilter.value.excludeItemsWithoutMatchingPrice) {
    tooltip += `\n\n${vueI18n.t('caption.showItemsWithoutMatchingPrice')}`
  }

  if (!globalFilter.value.excludePresetBaseItems) {
    if (tooltip.length > 0) {
      tooltip += '\n\n'
    }

    tooltip += vueI18n.t('caption.showPresetBaseItems')
  }

  if (enabledMerchants.value.length > 0) {
    if (tooltip.length > 0) {
      tooltip += '\n\n'
    }

    tooltip += `${vueI18n.t('caption.merchants')} :`

    for (const merchant of enabledMerchants.value) {
      tooltip += `\n${vueI18n.t('caption.merchant_' + merchant.merchant)}`

      if (merchant.merchantLevel > 0) {
        tooltip += ` ${vueI18n.t('caption.level')} ${merchant.merchantLevel}`
      }
    }
  }

  return tooltip
})
const property = computed({
  get: () => modelFilterAndSortingData.value.property,
  set: (value: string) => {
    const fasd = copyFilterAndSortingData()
    fasd.property = value
    fasd.order = modelFilterAndSortingData.value.order
    modelFilterAndSortingData.value = fasd
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

const filterInternal = ref(modelFilterAndSortingData.value.filter)
const globalFilter = ref<IGlobalFilter>()
const isInSidebar = inject<Ref<boolean>>('isInSidebar', ref(false))
const { isTabletPortraitOrSmaller: isCompactMode } = WebBrowserUtils.getScreenSize()

const isTouchScreen = WebBrowserUtils.isTouchScreen()

watch(
  () => modelFilterAndSortingData.value.filter,
  () => filterInternal.value = modelFilterAndSortingData.value.filter)

watchDebounced(
  // Applies the filter only 500ms after the last letter is typed
  filterInternal,
  () => applyQuickFilter(),
  { debounce: 500 })

onMounted(() => {
  _globalFilterService.emitter.on(GlobalFilterService.changeEvent, getGlobalFilter)

  getGlobalFilter()
})

onUnmounted(() => {
  _globalFilterService.emitter.off(GlobalFilterService.changeEvent, getGlobalFilter)
})

/**
 * Applies the quick filter.
 */
function applyQuickFilter(): void {
  const fasd = copyFilterAndSortingData()
  fasd.filter = filterInternal.value
  modelFilterAndSortingData.value = fasd
}

/**
 * Checks whether updated filter and sorting data are different from the current ones.
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
 * Copies the current filer and sorting data.
 */
function copyFilterAndSortingData(): BuildFilterAndSortingData | ItemFilterAndSortingData {
  const fasd = modelFilterAndSortingData.value.type === FilterAndSortingDataType.build
    ? new BuildFilterAndSortingData(modelFilterAndSortingData.value)
    : new ItemFilterAndSortingData(modelFilterAndSortingData.value.sortingFunctions, modelFilterAndSortingData.value as ItemFilterAndSortingData)

  return fasd
}

/**
 * Gets the global filter.
 */
function getGlobalFilter(): void {
  globalFilter.value = _globalFilterService.get()
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
  const fasd = copyFilterAndSortingData()
  fasd.filter = undefined

  if (canRemoveCategoryIdFilter.value) {
    (fasd as ItemFilterAndSortingData).categoryId = undefined
  }

  modelFilterAndSortingData.value = fasd
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
 * Opens the global filter sidebar.
 */
function showGlobalFilterSidebar(): void {
  _globalSidebarService.display({
    displayedComponentType: 'MerchantItemsOptionsSidebar'
  })
}

/**
 * Switches the sort order.
 */
function switchSortOrder(): void {
  const fasd = copyFilterAndSortingData()
  fasd.order = -fasd.order
  modelFilterAndSortingData.value = fasd
}
</script>










<template>
  <Sticky
    :element-to-stick-to="elementToStickTo"
    align="left"
  >
    <div class="filter-chips">
      <!-- Sorting chip -->
      <Chip class="filter-chip">
        <Tooltip
          :disabled-on-mobile="true"
          :full-size="true"
          :tooltip="switchSortOrderButtonTooltip"
          class="filter-chip-icon-button-left"
          @click="switchSortOrder"
        >
          <div class="filter-chip-icon">
            <font-awesome-icon :icon="sortChipIcon" />
          </div>
        </Tooltip>
        <Tooltip
          v-if="isCompactMode || isTouchScreen"
          :tooltip="sortButtonTooltip"
          class="filter-chip-text"
        >
          <span @click="showFilterAndSortSidebar">
            {{ $t(`caption.${modelFilterAndSortingData.property}`) }}
          </span>
        </Tooltip>
        <div
          v-else
          class="filter-chip-sort"
          @click="showFilterAndSortSidebar"
        >
          <Dropdown
            v-model="property"
            :filter-fields="['caption']"
            :option-label="o => $t(`caption.${o.name}`)"
            :options="modelFilterAndSortingData.sortableProperties"
            class="filter-chip-quick-filter-input"
            option-value="name"
            @click="($event: MouseEvent) => $event.stopPropagation()"
          />
        </div>
      </Chip>
      <!-- Merchants chip -->
      <Chip class="filter-chip">
        <Tooltip
          :full-size="true"
          :tooltip="merchantsTooltip"
          style="height: 100%;"
          @click="showGlobalFilterSidebar"
        >
          <div class="filter-chip-merchants">
            <div class="filter-chip-icon">
              <font-awesome-icon icon="user-tag" />
            </div>
            <div
              v-if="(isInSidebar || isCompactMode) && enabledMerchants.length > 0"
              class="filter-chip-merchants-count"
            >
              {{ enabledMerchants.length }}
            </div>
            <div
              v-if="!isInSidebar && !isCompactMode"
              class="filter-chip-merchants-list"
            >
              <MerchantIcon
                v-for="merchant of enabledMerchants"
                :key="merchant.merchant"
                :merchant="merchant.merchant"
                :merchant-level="merchant.merchantLevel"
              />
            </div>
          </div>
        </Tooltip>
      </Chip>
      <!-- Add filter chip -->
      <Chip
        v-if="(isCompactMode || isTouchScreen)
          && categoryFilterCaption == null
          && filterCaption == null"
        class="filter-chip"
        @click="showFilterAndSortSidebar"
      >
        <Tooltip :tooltip="$t('caption.addFilter')">
          <div class="filter-chip-content">
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
          </div>
        </Tooltip>
      </Chip>
      <!-- Filter chip -->
      <Chip
        v-else
        class="filter-chip"
      >
        <!-- Mobile -->
        <Tooltip
          v-if="isCompactMode || isTouchScreen"
          :tooltip="filterTooltip"
          class="filter-chip-content filter-chip-text-mobile"
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
            :full-size="true"
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
              <span>{{ categoryFilterCaption }}</span>
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
                :caption="$t('caption.addFilter')"
                caption-mode="placeholder"
                :autofocus="!isTouchScreen"
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
            :disabled-on-mobile="true"
            :full-size="true"
            :tooltip="$t('caption.removeFilter')"
            style="color: var(--error-color);"
            @click="removeFilter"
          >
            <div class="filter-chip-icon">
              <font-awesome-icon icon="times" />
            </div>
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
  height: 100%;
  overflow: hidden;
  padding: 0rem;
  width: 100%;
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
  padding-left: 0.5rem;
  padding-right: 0.5rem;
}

.filter-chip-icon-button-left {
  align-items: center;
  border-right-color: var(--primary-color6);
  border-right-style: solid;
  border-right-width: 1px;
  display: flex;
  height: 100%;
  justify-content: center;
  width: unset;
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

.filter-chip-merchants {
  align-items: center;
  display: flex;
}

.filter-chip-merchants-count {
  align-items: center;
  background-color: var(--primary-color);
  border-radius: 50%;
  display: flex;
  justify-content: center;
  margin-right: 0.325rem;
  width: 1.25rem;
}

.filter-chip-merchants-list {
  align-items: center;
  display: flex;
  gap: 0.75rem;
  margin-right: 1rem;
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

.filter-chip-sort {
  align-items: center;
  display: flex;
  height: 100%;
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
  grid-template-columns: auto auto auto;
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

.filter-chips .p-chip img {
  /* Chips overrides MerchantIcon image */
  border-radius: 3px;
  height: 1.85rem;
  margin-left: unset;
  margin-right: unset;
  width: 2rem;
}

.filter-chip-merchants-list > .merchant-icon > .merchant-icon-level {
  transform: translate(1.5rem, 0.5rem);
}

.filter-chip-text-mobile > div {
  overflow: hidden;
}
</style>