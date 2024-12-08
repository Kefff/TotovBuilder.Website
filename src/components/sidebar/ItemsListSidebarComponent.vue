<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { ItemCategoryId } from '../../models/item/IItem'
import { ItemsListSidebarParameters } from '../../models/utils/IGlobalSidebarOptions'
import ItemFilterAndSortingData from '../../models/utils/ItemFilterAndSortingData'
import { SortingOrder } from '../../models/utils/SortingOrder'
import vueI18n from '../../plugins/vueI18n'
import { GlobalSidebarService } from '../../services/GlobalSidebarService'
import Services from '../../services/repository/Services'
import { ItemSortingFunctions } from '../../services/sorting/functions/ItemSortingFunctions'
import { SortingService } from '../../services/sorting/SortingService'
import StringUtils from '../../utils/StringUtils'
import InputTextField from '../InputTextFieldComponent.vue'
import Tooltip from '../TooltipComponent.vue'

const modelParameters = defineModel<ItemsListSidebarParameters>('parameters', { required: true })

const _globalSidebarService = Services.get(GlobalSidebarService)
const _sortingService = Services.get(SortingService)

const category = computed<ItemCategoryId | undefined>({
  get: () => modelParameters.value.categoryId,
  set: (value: ItemCategoryId | undefined) => {
    modelParameters.value = {
      ...modelParameters.value,
      categoryId: value
    }
  }
})
const categories = computed(() => {
  let categoriesAndCaption: { category: ItemCategoryId, caption: string }[] = []

  for (const rawCategory of Object.values(ItemCategoryId)) {
    if (rawCategory === ItemCategoryId.notFound) {
      continue
    }

    categoriesAndCaption.push({ category: rawCategory, caption: vueI18n.t(`caption.category${StringUtils.toUpperFirst(rawCategory)}`) })
  }

  categoriesAndCaption = categoriesAndCaption.sort((c1, c2) => c1.caption.localeCompare(c2.caption))

  return categoriesAndCaption
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
const sortField = computed({
  get: () => modelParameters.value.property,
  set: (value: string) => {
    modelParameters.value = _sortingService.setSortingProperty(modelParameters.value, ItemSortingFunctions, value, sortOrder.value) as ItemFilterAndSortingData
  }
})
const sortOrder = computed({
  get: () => modelParameters.value.order,
  set: (value: SortingOrder) => {
    modelParameters.value = _sortingService.setSortingProperty(modelParameters.value, ItemSortingFunctions, modelParameters.value.property, value) as ItemFilterAndSortingData
  }
})

const sortableProperties = ref<string[]>([])

onMounted(() => sortableProperties.value = getSortableProperties())

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
 * Gets sortable properties.
 */
function getSortableProperties(): string[] {
  const properties = [
    'armorClass',
    'ergonomics',
    'name',
    'price',
    'recoil',
    'weight'
  ]
  properties.sort((a, b) => StringUtils.compare(vueI18n.t(a), vueI18n.t(b)))

  return properties
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
  modelParameters.value = new ItemFilterAndSortingData()
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
          :options="categories"
          class="items-list-sidebar-value items-list-sidebar-category-dropdown"
          option-label="caption"
          option-value="category"
        >
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
        <div>
          <Tooltip
            v-if="category != null && !modelParameters.isCategoryReadOnly"
            :tooltip="$t('caption.clear')"
          >
            <div
              class="items-list-sidebar-clear-button"
              @click="category = undefined"
            >
              <font-awesome-icon icon="times" />
            </div>
          </Tooltip>
        </div>
      </div>
      <span class="items-list-sidebar-caption">{{ $t('caption.filter') }}</span>
      <div class="items-list-sidebar-field">
        <InputTextField
          ref="itemsListSidebarFilterInput"
          v-model:value="filter"
          :autofocus="true"
          class="items-list-sidebar-value"
          type="text"
          @keydown="onFilterKeyDown"
        />
        <div>
          <Tooltip
            v-if="filter != null"
            :tooltip="$t('caption.clear')"
          >
            <div
              class="items-list-sidebar-clear-button"
              @click="filter = undefined"
            >
              <font-awesome-icon icon="times" />
            </div>
          </Tooltip>
        </div>
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

.items-list-sidebar-clear-button {
  align-items: center;
  color: var(--error-color);
  cursor: pointer;
  display: flex;
  height: 100%;
  justify-content: center;
  width: 2.375rem;
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
  max-width: 15rem;
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