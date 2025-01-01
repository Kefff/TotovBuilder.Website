<script setup lang="ts">
import { computed, nextTick, onMounted, ref } from 'vue'
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

const _categories = getCategories()

const category = computed<ItemCategoryId | undefined>({
  get: () => modelParameters.value.categoryId,
  set: (value: ItemCategoryId | undefined) => {
    getSortingFunctions(value)
    modelParameters.value = {
      ...modelParameters.value,
      categoryId: value
    }
  }
})
const filter = computed({
  get: () => modelParameters.value.filter,
  set: (value: string) => {
    modelParameters.value = {
      ...modelParameters.value,
      filter: value
    }
  }
})
const sortableProperties = computed(() => {
  let propertyNames: string[] = []

  if (sortingFunctions.value != null) {
    for (const propertyName of Object.keys(sortingFunctions.value.functions)) {
      propertyNames.push(propertyName)
    }

    propertyNames = propertyNames.sort((p1, p2) => StringUtils.compare(
      vueI18n.t(`caption.${p1}`),
      vueI18n.t(`caption.${p2}`)))
  }

  return propertyNames
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

const sortingFunctions = ref<IItemSortingFunctionList>(ItemSortingFunctions)

onMounted(() => {
  getSortingFunctions(category.value)
})

/**
 * Gets item categories.
 */
function getCategories(): ItemCategoryId[] {
  let categories: ItemCategoryId[] = Object.values(ItemCategoryId).filter(c => c !== ItemCategoryId.notFound)
  categories = categories.sort((c1, c2) => StringUtils.compare(
    vueI18n.t(`caption.category${StringUtils.toUpperFirst(c1)}`),
    vueI18n.t(`caption.category${StringUtils.toUpperFirst(c2)}`)))

  return categories
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
      <span class="items-list-sidebar-caption">{{ $t('caption.category') }}</span>
      <div class="items-list-sidebar-field">
        <Dropdown
          v-model="category"
          :disabled="modelParameters.isCategoryReadOnly"
          :options="_categories"
          class="items-list-sidebar-value items-list-sidebar-category-dropdown"
        >
          <template #option="slotProps">
            <span>{{ $t(`caption.category${StringUtils.toUpperFirst(slotProps.option)}`) }}</span>
          </template>
          <template #value="slotProps">
            <div
              v-if="slotProps.value != null"
              class="items-list-sidebar-category-value"
            >
              <span>
                {{ $t(`caption.category${StringUtils.toUpperFirst(slotProps.value)}`) }}
              </span>
            </div>
          </template>
        </Dropdown>
        <Tooltip
          v-if="category != null && !modelParameters.isCategoryReadOnly"
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
      <span class="items-list-sidebar-caption">{{ $t('caption.filter') }}</span>
      <div class="items-list-sidebar-field">
        <InputTextField
          ref="itemsListSidebarFilterInput"
          v-model:value="filter"
          :autofocus="parameters.focusFilter"
          class="items-list-sidebar-value"
          type="text"
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
            @click="filter = undefined"
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
      <span class="items-list-sidebar-caption">{{ $t('caption.sortBy') }}</span>
      <Dropdown
        v-model="sortField"
        :options="sortableProperties"
        class="items-list-sidebar-value"
      >
        <template #option="slotProps">
          {{ $t(`caption.${slotProps.option}`) }}
        </template>
        <template #value="slotProps">
          <div class="items-list-sidebar-value-value">
            <span>{{ $t(`caption.${slotProps.value}`) }}</span>
          </div>
        </template>
      </Dropdown>
      <span class="items-list-sidebar-caption">{{ $t('caption.order') }}</span>
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
            <div class="items-list-sidebar-value-value">
              <font-awesome-icon
                :icon="getSortOrderIcon(slotProps.value)"
                class="icon-before-text"
              />
              <span>{{ getSortOrderCaption(slotProps.value) }}</span>
            </div>
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
      class="items-list-sidebar-reset-button"
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
.items-list-sidebar-caption {
  width: 100%;
}

.items-list-sidebar-category-value {
  align-items: center;
  display: flex;
  height: 100%;
  padding: 0.25rem;
}

.items-list-sidebar-category-value > span {
  overflow: hidden;
  text-overflow: ellipsis;
}

.items-list-sidebar-field {
  align-items: center;
  display: flex;
  gap: 0.5rem;
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

.items-list-sidebar-reset-button {
  align-items: center;
  display: flex;
  justify-content: center;
  width: 100%;
}

.items-list-sidebar-value {
  overflow: hidden;
  width: 100%;
}

.items-list-sidebar-value-value {
  align-items: center;
  display: flex;
  height: 100%;
}
</style>










<style>
.items-list-sidebar-category-dropdown.p-dropdown > .p-dropdown-label {
  padding: 0;
}
</style>