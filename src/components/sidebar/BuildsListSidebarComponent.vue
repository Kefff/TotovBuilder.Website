<script setup lang="ts">
import { watchDebounced } from '@vueuse/core'
import { computed, ref, watch } from 'vue'
import BuildFilterAndSortingData from '../../models/utils/BuildFilterAndSortingData'
import { BuildsListSidebarParameters } from '../../models/utils/IGlobalSidebarOptions'
import { SortingOrder } from '../../models/utils/SortingOrder'
import vueI18n from '../../plugins/vueI18n'
import { GlobalSidebarService } from '../../services/GlobalSidebarService'
import Services from '../../services/repository/Services'
import { SortingService } from '../../services/sorting/SortingService'
import WebBrowserUtils from '../../utils/WebBrowserUtils'
import InputTextField from '../InputTextFieldComponent.vue'
import Tooltip from '../TooltipComponent.vue'

const modelParameters = defineModel<BuildsListSidebarParameters>('parameters', { required: true })

const _globalSidebarService = Services.get(GlobalSidebarService)
const _sortingService = Services.get(SortingService)

const filter = computed({
  get: () => modelParameters.value.filter,
  set: (value: string | undefined) => {
    const updatedBuildFilterAndSortingData = new BuildFilterAndSortingData(modelParameters.value)
    updatedBuildFilterAndSortingData.filter = value
    modelParameters.value = updatedBuildFilterAndSortingData
  }
})
const order = computed({
  get: () => modelParameters.value.order,
  set: (value: SortingOrder) => {
    const filterAndSortingData = _sortingService.setSortingProperty(modelParameters.value, modelParameters.value.property, value)
    modelParameters.value = filterAndSortingData
  }
})
const property = computed({
  get: () => modelParameters.value.property,
  set: (value: string) => {
    const filterAndSortingData = _sortingService.setSortingProperty(modelParameters.value, value, order.value)
    modelParameters.value = filterAndSortingData
  }
})

const filterInternal = ref(modelParameters.value.filter)
const isTouchScreen = WebBrowserUtils.isTouchScreen()

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
    _globalSidebarService.close('BuildsListSidebar')
  }
}

/**
 * Resets the filter an sort.
 */
function reset(): void {
  modelParameters.value = new BuildFilterAndSortingData()
  _globalSidebarService.close('BuildsListSidebar')
}
</script>










<template>
  <div class="sidebar-option">
    <div class="builds-list-sidebar-group">
      <span>
        {{ $t('caption.filter') }}
      </span>
      <div class="builds-list-sidebar-field">
        <InputTextField
          ref="buildsListSidebarFilterInput"
          v-model:value="filterInternal"
          :autofocus="!isTouchScreen"
          class="builds-list-sidebar-value"
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
  <div class="sidebar-option builds-list-sidebar-filter-explanation">
    <div class="sidebar-option-icon">
      <font-awesome-icon icon="info-circle" />
    </div>
    <span>{{ $t('message.buildsListFilterExplanation') }}</span>
  </div>
  <div class="sidebar-title">
    <div class="sidebar-title-icon">
      <font-awesome-icon :icon="getSortOrderIcon(modelParameters.order)" />
    </div>
    <span>{{ $t('caption.sort') }}</span>
  </div>
  <div class="sidebar-option">
    <div class="builds-list-sidebar-group">
      <span>
        {{ $t('caption.sortBy') }}
      </span>
      <Dropdown
        v-model="property"
        :filter-fields="['caption']"
        :option-label="o => $t(`caption.${o.name}`)"
        :options="parameters.sortableProperties"
        class="builds-list-sidebar-value"
        option-value="name"
      />
    </div>
  </div>
  <div class="sidebar-option">
    <div class="builds-list-sidebar-group">
      <span>
        {{ $t('caption.order') }}
      </span>
      <div class="builds-list-sidebar-field">
        <Dropdown
          v-model="order"
          :options="[SortingOrder.asc, SortingOrder.desc]"
          class="builds-list-sidebar-value"
        >
          <template #option="slotProps">
            <font-awesome-icon
              :icon="getSortOrderIcon(slotProps.option)"
              class="icon-before-text"
            />
            <span>{{ getSortOrderCaption(slotProps.option) }}</span>
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
            @click="order = -order"
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
      class="builds-list-sidebar-long-button"
      severity="danger"
      outlined
      @click="reset"
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
.builds-list-sidebar-field {
  align-items: center;
  display: flex;
  gap: 0.5rem;
  overflow-x: hidden;
  width: 100%;
}

.builds-list-sidebar-filter-explanation {
  color: var(--util-color7);
  margin-top: 0;
}

.builds-list-sidebar-filter-explanation > span {
  font-size: 0.85rem;
  max-width: 21rem;
  white-space: preserve;
}

.builds-list-sidebar-group {
  align-items: center;
  display: grid;
  gap: 1rem;
  grid-template-columns: 1fr 2fr;
  width: 100%;
}

.builds-list-sidebar-long-button {
  align-items: center;
  display: flex;
  justify-content: center;
  width: 100%;
}

.builds-list-sidebar-value {
  align-items: center;
  display: flex;
  overflow-x: hidden;
  width: 100%;
}

.builds-list-sidebar-value > span {
  overflow-x: hidden;
  text-overflow: ellipsis;
}
</style>