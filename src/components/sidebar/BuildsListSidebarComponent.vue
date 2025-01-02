<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import BuildFilterAndSortingData from '../../models/utils/BuildFilterAndSortingData'
import { BuildsListSidebarParameters } from '../../models/utils/IGlobalSidebarOptions'
import { SortingOrder } from '../../models/utils/SortingOrder'
import vueI18n from '../../plugins/vueI18n'
import { GlobalSidebarService } from '../../services/GlobalSidebarService'
import Services from '../../services/repository/Services'
import { SortingService } from '../../services/sorting/SortingService'
import StringUtils from '../../utils/StringUtils'
import InputTextField from '../InputTextFieldComponent.vue'
import Tooltip from '../TooltipComponent.vue'

const modelParameters = defineModel<BuildsListSidebarParameters>('parameters', { required: true })

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
    modelParameters.value = _sortingService.setSortingProperty(modelParameters.value, value, sortOrder.value) as BuildFilterAndSortingData
  }
})
const sortOrder = computed({
  get: () => modelParameters.value.order,
  set: (value: SortingOrder) => {
    modelParameters.value = _sortingService.setSortingProperty(modelParameters.value, modelParameters.value.property, value) as BuildFilterAndSortingData
  }
})

onMounted(() => {
  sortableProperties.value = getSortableProperties()
})

/**
 * Displays the merchants sidebar.
 */
function displayMerchants(): void {
  _globalSidebarService.display({
    displayedComponentType: 'MerchantItemsOptionsSidebar'
  })
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
      <span class="builds-list-sidebar-caption">{{ $t('caption.merchants') }}</span>
      <div class="builds-list-sidebar-field">
        <Button
          class="builds-list-sidebar-long-button"
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
    <div class="builds-list-sidebar-group">
      <span class="builds-list-sidebar-caption">{{ $t('caption.filter') }}</span>
      <div class="builds-list-sidebar-field">
        <InputTextField
          ref="buildsListSidebarFilterInput"
          v-model:value="filter"
          :autofocus="parameters.focusFilter"
          class="builds-list-sidebar-value"
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
      <span class="builds-list-sidebar-caption">{{ $t('caption.sortBy') }}</span>
      <Dropdown
        v-model="sortField"
        :options="sortableProperties"
        class="builds-list-sidebar-value"
      >
        <template #option="slotProps">
          {{ $t(`caption.${slotProps.option}`) }}
        </template>
        <template #value="slotProps">
          <div class="builds-list-sidebar-value-value">
            <span>{{ $t(`caption.${slotProps.value}`) }}</span>
          </div>
        </template>
      </Dropdown>
      <span class="builds-list-sidebar-caption">{{ $t('caption.order') }}</span>
      <div class="builds-list-sidebar-field">
        <Dropdown
          v-model="sortOrder"
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
            <div class="builds-list-sidebar-value-value">
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
      class="builds-list-sidebar-long-button"
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
.builds-list-sidebar-caption {
  margin-right: auto;
}

.builds-list-sidebar-field {
  align-items: center;
  display: flex;
  gap: 0.5rem;
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
  overflow: hidden;
  width: 100%;
}

.builds-list-sidebar-value-value {
  align-items: center;
  display: flex;
  height: 100%;
}
</style>