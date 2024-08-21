<template>
  <div class="sidebar-title">
    <div class="sidebar-title-icon">
      <font-awesome-icon icon="filter" />
    </div>
    <span>{{ $t('caption.filter') }}</span>
  </div>
  <div class="sidebar-option">
    <div class="builds-list-sidebar-group">
      <span class="builds-list-sidebar-caption">{{ $t('caption.filter') }}</span>
      <InputText
        ref="buildsListSidebarFilterInput"
        v-model="filter"
        class="builds-list-sidebar-value"
        type="text"
        @keydown="onFilterKeyDown"
      />
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
      <font-awesome-icon :icon="sortIcon" />
    </div>
    <span>{{ $t('caption.sort') }}</span>
  </div>
  <div class="sidebar-option">
    <div class="builds-list-sidebar-group">
      <span class="builds-list-sidebar-caption">{{ $t('caption.sortBy') }}</span>
      <Dropdown
        v-model="sortField"
        :options="sortableProperties"
        class="builds-list-sidebar-value"
      >
        <template #option="slotProps">
          <div class="builds-list-sidebar-option">
            {{ $t(`caption.${slotProps.option}`) }}
          </div>
        </template>
        <template #value="slotProps">
          <div>
            {{ $t(`caption.${slotProps.value}`) }}
          </div>
        </template>
      </Dropdown>
      <span class="builds-list-sidebar-caption">{{ $t('caption.order') }}</span>
      <Dropdown
        v-model="sortOrder"
        :options="[SortingOrder.asc, SortingOrder.desc]"
        class="builds-list-sidebar-value"
      >
        <template #option="slotProps">
          <div class="builds-list-sidebar-option">
            {{ getSortOrderCaption(slotProps.option) }}
          </div>
        </template>
        <template #value="slotProps">
          <div>
            {{ getSortOrderCaption(slotProps.value) }}
          </div>
        </template>
      </Dropdown>
    </div>
  </div>
  <div class="sidebar-title" />
  <div class="sidebar-option">
    <Button
      class="p-button-danger builds-list-sidebar-reset-button"
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

<script setup lang="ts">
import { computed, nextTick, onMounted, ref } from 'vue'
import BuildFilterAndSortingData from '../../models/utils/BuildFilterAndSortingData'
import { BuildsListSidebarParameters } from '../../models/utils/IGlobalSidebarOptions'
import { SortingOrder } from '../../models/utils/SortingOrder'
import vueI18n from '../../plugins/vueI18n'
import { GlobalSidebarService } from '../../services/GlobalSidebarService'
import Services from '../../services/repository/Services'
import { BuildSummarySortingFunctions } from '../../services/sorting/functions/BuildSummarySortingFunctions'
import { SortingService } from '../../services/sorting/SortingService'
import StringUtils from '../../utils/StringUtils'

const modelParameters = defineModel<BuildsListSidebarParameters>('parameters', { required: true })

const _globalSidebarService = Services.get(GlobalSidebarService)
const _sortingService = Services.get(SortingService)

const buildsListSidebarFilterInput = ref()
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
    modelParameters.value = _sortingService.setSortingProperty(modelParameters.value, BuildSummarySortingFunctions, value, sortOrder.value) as BuildFilterAndSortingData
  }
})
const sortIcon = computed(() => modelParameters.value.order === SortingOrder.asc ? 'sort-alpha-down' : 'sort-alpha-up-alt')
const sortOrder = computed({
  get: () => modelParameters.value.order,
  set: (value: SortingOrder) => {
    modelParameters.value = _sortingService.setSortingProperty(modelParameters.value, BuildSummarySortingFunctions, modelParameters.value.property, value) as BuildFilterAndSortingData
  }
})

onMounted(() => {
  sortableProperties.value = getSortableProperties()

  // Focus the filter input to be able to search.
  nextTick(() => buildsListSidebarFilterInput.value.$el.select()) // nextTick required for the focus to work
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
 * Reacts to a keyboard event in the filter input.
 * @param event - Keyboard event.
 */
function onFilterKeyDown(event: KeyboardEvent) {
  if (event.key === 'Enter') {
    _globalSidebarService.close('BuildsListSidebar')
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
 * Resets the filter an sort.
 */
function reset() {
  modelParameters.value = new BuildFilterAndSortingData()
  _globalSidebarService.close('BuildsListSidebar')
}
</script>

<style scoped>
@import '../../css/icon.css';
@import '../../css/sidebar.css';

.builds-list-sidebar-option {
  padding: 1rem;
}

.builds-list-sidebar-caption {
  margin-right: auto;
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
}

.builds-list-sidebar-reset-button {
  margin-left: auto;
}

.builds-list-sidebar-value {
  width: 15rem;
}
</style>