<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
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

const modelParameters = defineModel<ItemsListSidebarParameters>('parameters', { required: true })

const _globalSidebarService = Services.get(GlobalSidebarService)
const _sortingService = Services.get(SortingService)

const sortableProperties = ref<string[]>([])

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

onMounted(() => {
  sortableProperties.value = getSortableProperties()
})

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
      <span class="items-list-sidebar-caption">{{ $t('caption.filter') }}</span>
      <InputTextField
        ref="itemsListSidebarFilterInput"
        v-model:value="filter"
        :autofocus="true"
        class="items-list-sidebar-value"
        type="text"
        @keydown="onFilterKeyDown"
      />
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
  margin-right: auto;
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
}

.items-list-sidebar-reset-button {
  align-items: center;
  display: flex;
  justify-content: center;
  width: 100%;
}

.items-list-sidebar-value {
  width: 15rem;
}

.items-list-sidebar-value-value {
  align-items: center;
  display: flex;
  height: 100%;
}
</style>