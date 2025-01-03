<script setup lang="ts">
import { watchDebounced } from '@vueuse/core'
import { computed, nextTick, onMounted, ref, watch } from 'vue'
import { ItemCategoryId } from '../../models/item/IItem'
import { ItemsListSidebarParameters } from '../../models/utils/IGlobalSidebarOptions'
import ItemFilterAndSortingData from '../../models/utils/ItemFilterAndSortingData'
import { SortingOrder } from '../../models/utils/SortingOrder'
import vueI18n from '../../plugins/vueI18n'
import { GlobalSidebarService } from '../../services/GlobalSidebarService'
import Services from '../../services/repository/Services'
import { IItemSortingFunctionList } from '../../services/sorting/functions/ISortingFunctionList'
import { ItemSortingFunctions } from '../../services/sorting/functions/itemSortingFunctions'
import { SortingService } from '../../services/sorting/SortingService'
import StringUtils from '../../utils/StringUtils'
import InputTextField from '../InputTextFieldComponent.vue'
import Tooltip from '../TooltipComponent.vue'

const modelParameters = defineModel<ItemsListSidebarParameters>('parameters', { required: true })

const _globalSidebarService = Services.get(GlobalSidebarService)
const _sortingService = Services.get(SortingService)

const availableCategories = computed(() => {
  let categories = modelParameters.value.availableItemCategories.map(cid => ({
    categoryId: cid,
    caption: vueI18n.t(`caption.category${StringUtils.toUpperFirst(cid)}`)
  }))
  categories.sort((c1, c2) => StringUtils.compare(c1.caption, c2.caption))

  return categories
})
const category = computed<ItemCategoryId | undefined>({
  get: () => modelParameters.value.categoryId,
  set: (value: ItemCategoryId | undefined) => {
    getSortingFunctions(value)
    const updatedItemFilterAndSortingData = new ItemFilterAndSortingData(modelParameters.value)
    updatedItemFilterAndSortingData.categoryId = value
    modelParameters.value = updatedItemFilterAndSortingData
  }
})
const filter = computed({
  get: () => modelParameters.value.filter,
  set: (value: string | undefined) => {
    const updatedItemFilterAndSortingData = new ItemFilterAndSortingData(modelParameters.value)
    updatedItemFilterAndSortingData.filter = value
    modelParameters.value = updatedItemFilterAndSortingData
  }
})
const sortableProperties = computed(() => {
  let properties: { name: string, caption: string }[] = []

  if (sortingFunctions.value != null) {
    for (const propertyName of Object.keys(sortingFunctions.value.functions)) {
      properties.push({
        name: propertyName,
        caption: `caption.${propertyName}`
      })
    }

    properties.sort((p1, p2) => StringUtils.compare(p1.caption, p2.caption))
  }

  return properties
})
const sortField = computed({
  get: () => modelParameters.value.property,
  set: (value: string) => {
    modelParameters.value = _sortingService.setSortingProperty(modelParameters.value, value, sortOrder.value) as ItemFilterAndSortingData
  }
})
const sortOrder = computed({
  get: () => modelParameters.value.order,
  set: (value: SortingOrder) => {
    modelParameters.value = _sortingService.setSortingProperty(modelParameters.value, modelParameters.value.property, value) as ItemFilterAndSortingData
  }
})

const filterInternal = ref(modelParameters.value.filter)
const sortingFunctions = ref<IItemSortingFunctionList>(ItemSortingFunctions)

onMounted(() => getSortingFunctions(category.value))

watch(
  () => modelParameters.value.filter,
  () => filterInternal.value = modelParameters.value.filter)

watchDebounced(
  // Applies the filter only 100ms after the last letter is typed
  // Short debounce because if the user clicks outside of the sidebar quickly after typing,
  // the sidebar is closed without having the time to update the filter
  filterInternal,
  () => filter.value = filterInternal.value,
  { debounce: 100 })

/**
 * Displays the merchants sidebar.
 */
function displayMerchants(): void {
  _globalSidebarService.display({
    displayedComponentType: 'MerchantItemsOptionsSidebar'
  })
}

/**
 * Gets sorting function associated with a category.
 * @param categoryId - Category ID.
 */
function getSortingFunctions(categoryId: ItemCategoryId | undefined): void {
  sortingFunctions.value = _sortingService.getSortingFunctionsFromItemCategory(categoryId)
  modelParameters.value.sortingFunctions = sortingFunctions.value // Needs to be updated because we create modelParameters with the default generic item sorting functions

  if (sortingFunctions.value.functions[sortField.value] == null) {
    nextTick(() => sortField.value = 'name') // nextTick needed otherwise the sort field dropdown does not update the displayed value
  }
}

/**
 * Gets the caption for a sort order.
 * @param sortOrder - Sort order.
 * @returns - Caption.
 */
function getSortOrderCaption(sortOrder: SortingOrder): string {
  if (sortOrder === SortingOrder.asc) {
    return vueI18n.t('caption.ascendant')
  } else {
    return vueI18n.t('caption.descendant')
  }
}

/**
 * Gets the icon for a sort order.
 * @param sortOrder - Sort order.
 * @returns - Icon.
 */
function getSortOrderIcon(sortOrder: SortingOrder): string {
  if (sortOrder === SortingOrder.asc) {
    return 'sort-amount-down-alt'
  } else {
    return 'sort-amount-up'
  }
}

/**
 * Reacts to a keyboard event in the filter input.
 * @param event - Keyboard event.
 */
function onFilterKeyDown(event: KeyboardEvent): void {
  if (event.key === 'Enter') {
    filter.value = filterInternal.value
    _globalSidebarService.close('ItemsListSidebar')
  }
}

/**
 * Resets the filter an sort.
 */
function reset(): void {
  const sortingFunctions = modelParameters.value.sortingFunctions
  const resettedSortingData = new ItemFilterAndSortingData()
  resettedSortingData.sortingFunctions = sortingFunctions
  modelParameters.value = resettedSortingData
  _globalSidebarService.close('ItemsListSidebar')
}
</script>










<template>
  <div class="sidebar-option">
    <div class="items-list-sidebar-group">
      <span>
        {{ $t('caption.merchants') }}
      </span>
      <div class="items-list-sidebar-field">
        <Button
          class="items-list-sidebar-long-button"
          outlined
          @click="displayMerchants()"
        >
          <font-awesome-icon
            icon="user-tag"
            class="icon-before-text"
          />
          <span>{{ $t('caption.merchantItemsOptions') }}</span>
        </Button>
      </div>
    </div>
  </div>
  <div class="sidebar-option">
    <div class="items-list-sidebar-group">
      <span>
        {{ $t('caption.category') }}
      </span>
      <div class="items-list-sidebar-field">
        <Dropdown
          v-model="category"
          :disabled="modelParameters.isCategoryIdReadOnly"
          :filter-fields="['caption']"
          :option-label="o => $t(`caption.category${StringUtils.toUpperFirst(o.categoryId)}`)"
          :options="availableCategories"
          class="items-list-sidebar-value items-list-sidebar-category-dropdown"
          option-value="categoryId"
        />
        <Tooltip
          v-if="category != null && !modelParameters.isCategoryIdReadOnly"
          :tooltip="$t('caption.clear')"
        >
          <Button
            class="p-button-sm"
            outlined
            severity="danger"
            @click="category = undefined"
          >
            <font-awesome-icon icon="times" />
          </Button>
        </Tooltip>
      </div>
    </div>
  </div>
  <div class="sidebar-option">
    <div class="items-list-sidebar-group">
      <span>
        {{ $t('caption.filter') }}
      </span>
      <div class="items-list-sidebar-field">
        <InputTextField
          ref="itemsListSidebarFilterInput"
          v-model:value="filterInternal"
          :autofocus="parameters.focusFilter"
          class="items-list-sidebar-value"
          @keydown="onFilterKeyDown"
        />
        <Tooltip
          v-if="filter != null"
          :tooltip="$t('caption.clear')"
        >
          <Button
            class="p-button-sm"
            outlined
            severity="danger"
            @click="filterInternal = undefined"
          >
            <font-awesome-icon icon="times" />
          </Button>
        </Tooltip>
      </div>
    </div>
  </div>
  <div class="sidebar-title">
    <div class="sidebar-title-icon">
      <font-awesome-icon :icon="getSortOrderIcon(modelParameters.order)" />
    </div>
    <span>{{ $t('caption.sort') }}</span>
  </div>
  <div class="sidebar-option">
    <div class="items-list-sidebar-group">
      <span>
        {{ $t('caption.sortBy') }}
      </span>
      <Dropdown
        v-model="sortField"
        :filter-fields="['caption']"
        :option-label="o => $t(`caption.${o.name}`)"
        :options="sortableProperties"
        class="items-list-sidebar-value"
        option-value="name"
      />
    </div>
  </div>
  <div class="sidebar-option">
    <div class="items-list-sidebar-group">
      <span>
        {{ $t('caption.order') }}
      </span>
      <div class="items-list-sidebar-field">
        <Dropdown
          v-model="sortOrder"
          :options="[SortingOrder.asc, SortingOrder.desc]"
          class="items-list-sidebar-value"
        >
          <template #option="slotProps">
            <div class="items-list-sidebar-option">
              <font-awesome-icon
                :icon="getSortOrderIcon(slotProps.option)"
                class="icon-before-text"
              />
              <span>{{ getSortOrderCaption(slotProps.option) }}</span>
            </div>
          </template>
          <template #value="slotProps">
            <font-awesome-icon
              :icon="getSortOrderIcon(slotProps.value)"
              class="icon-before-text"
            />
            <span>{{ getSortOrderCaption(slotProps.value) }}</span>
          </template>
        </Dropdown>
        <Tooltip :tooltip="$t('caption.switchSortOrder')">
          <Button
            class="p-button-sm"
            outlined
            @click="sortOrder = -sortOrder"
          >
            <font-awesome-icon icon="exchange-alt" />
          </Button>
        </Tooltip>
      </div>
    </div>
  </div>
  <div class="sidebar-title" />
  <div class="sidebar-option">
    <Button
      class="items-list-sidebar-long-button"
      severity="danger"
      outlined
      @click="reset()"
    >
      <font-awesome-icon
        icon="undo"
        class="icon-before-text"
      />
      <span>{{ $t('caption.resetFilterAndSort') }}</span>
    </Button>
  </div>
</template>










<style scoped>
.items-list-sidebar-field {
  align-items: center;
  display: flex;
  gap: 0.5rem;
  overflow-x: hidden;
  width: 100%;
}

.items-list-sidebar-filter-explanation > span {
  font-size: 0.85rem;
  max-width: 21rem;
  white-space: preserve;
}

.items-list-sidebar-group {
  align-items: center;
  display: grid;
  gap: 1rem;
  grid-template-columns: 1fr 2fr;
  width: 100%;
}

.items-list-sidebar-long-button {
  align-items: center;
  display: flex;
  justify-content: center;
  width: 100%;
}

.items-list-sidebar-value {
  align-items: center;
  display: flex;
  overflow-x: hidden;
  width: 100%;
}

.items-list-sidebar-value > span {
  overflow-x: hidden;
  text-overflow: ellipsis;
}
</style>