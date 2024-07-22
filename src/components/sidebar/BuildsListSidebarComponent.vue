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
import { IBuildsListFilterSortingData } from '../../models/utils/IBuildsListFilterSortingData'
import { SortingOrder } from '../../models/utils/SortingOrder'
import vueI18n from '../../plugins/vueI18n'
import StringUtils from '../../utils/StringUtils'

const modelFilterSortingData = defineModel<IBuildsListFilterSortingData>('parameters', { required: true })

const defaultSortField = 'name'
const defaultSortOrder = SortingOrder.asc

const buildsListSidebarFilterInput = ref()
const sortableProperties = ref<string[]>([])

const sortIcon = computed(() => modelFilterSortingData.value.currentSortOrder === SortingOrder.asc ? 'sort-alpha-down' : 'sort-alpha-up-alt')

onMounted(() => {
  sortableProperties.value = getSortableProperties()

  // Focus the filter input to be able to search.
  nextTick(() => buildsListSidebarFilterInput.value.$el.select()) // nextTick required for the focus to work
})

const filter = computed({
  get: () => modelFilterSortingData.value.filter,
  set: (value?: string) => {
    modelFilterSortingData.value = {
      currentSortField: modelFilterSortingData.value.currentSortField,
      currentSortOrder: modelFilterSortingData.value.currentSortOrder,
      filter: value
    }
  }
})

const sortField = computed({
  get: () => modelFilterSortingData.value.currentSortField,
  set: (value: string) => {
    modelFilterSortingData.value = {
      currentSortField: value,
      currentSortOrder: modelFilterSortingData.value.currentSortOrder,
      filter: modelFilterSortingData.value.filter
    }
  }
})

const sortOrder = computed({
  get: () => modelFilterSortingData.value.currentSortOrder,
  set: (value: SortingOrder) => {
    modelFilterSortingData.value = {
      currentSortField: modelFilterSortingData.value.currentSortField,
      currentSortOrder: value,
      filter: modelFilterSortingData.value.filter
    }
  }
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
  modelFilterSortingData.value = {
    currentSortField: defaultSortField,
    currentSortOrder: defaultSortOrder,
    filter: undefined
  }
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