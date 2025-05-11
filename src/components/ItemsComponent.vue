<script setup lang="ts">
import { computed, nextTick, onMounted, ref, useTemplateRef } from 'vue'
import { useRouter } from 'vue-router'
import { IItem, ItemCategoryId } from '../models/item/IItem'
import ItemFilterAndSortingData from '../models/utils/ItemFilterAndSortingData'
import { IToolbarButton } from '../models/utils/IToolbarButton'
import vueI18n from '../plugins/vueI18n'
import { GlobalSidebarService } from '../services/GlobalSidebarService'
import { ItemService } from '../services/ItemService'
import Services from '../services/repository/Services'
import { SeoService } from '../services/SeoService'
import { ItemSortingFunctions } from '../services/sorting/functions/itemSortingFunctions'
import { WebsiteConfigurationService } from '../services/WebsiteConfigurationService'
import ItemsList from './ItemsListComponent.vue'
import NotificationButton from './NotificationButtonComponent.vue'
import Toolbar from './ToolbarComponent.vue'

const _globalSidebarService = Services.get(GlobalSidebarService)
const _itemService = Services.get(ItemService)
const _websiteConfigurationService = Services.get(WebsiteConfigurationService)

const _router = useRouter()
const _toolbarButtons: IToolbarButton[] = [
  {
    action: goToHome,
    canBeMovedToSidebar: () => false,
    caption: () => vueI18n.t('caption.backToHome'),
    followedBySeparation: true,
    icon: () => 'arrow-left',
    name: 'backToHome',
    showCaption: () => 'never',
    style: () => 'discreet'
  },
  {
    action: displayMerchantItemsOptions,
    caption: () => vueI18n.t('caption.merchants'),
    icon: () => 'user-tag',
    isDisabled: () => isLoading.value,
    name: 'merchantItemsOptions',
    position: () => 'right',
    style: () => 'outlined'
  },
  {
    action: displayGeneralOptions,
    caption: () => vueI18n.t('caption.options'),
    icon: () => 'cog',
    name: 'generalOptions',
    position: () => 'right',
    showCaption: () => 'never',
    style: () => 'discreet'
  }
]

const filterAndSortingData = ref(new ItemFilterAndSortingData(ItemSortingFunctions))
const isLoading = ref(true)
const itemsToolbar = useTemplateRef('itemsToolbar')

const toolbarContainer = computed(() => itemsToolbar.value?.container)

onMounted(() => {
  Services.get(SeoService).updateSeoMetadata({
    title: vueI18n.t('caption.items')
  })

  getInitialFilterAndSortingData()
})

/**
 * Displays the general options sidebar.
 */
function displayGeneralOptions(): void {
  _globalSidebarService.display({
    displayedComponentType: 'GeneralOptionsSidebar'
  })
}

/**
 * Displays the merchant items options sidebar.
 */
function displayMerchantItemsOptions(): void {
  _globalSidebarService.display({
    displayedComponentType: 'MerchantItemsOptionsSidebar'
  })
}

/**
 * Gets the initial filter and sorting data applied to items.
 */
function getInitialFilterAndSortingData(): void {
  const savedCategoryId = sessionStorage.getItem(_websiteConfigurationService.configuration.itemsFilterAndSortCategoryStorageKey)
  const categoryId = savedCategoryId != null ? ItemCategoryId[savedCategoryId as keyof typeof ItemCategoryId] : undefined

  const fasd = new ItemFilterAndSortingData(ItemSortingFunctions)
  fasd.categoryId = categoryId // This automatically sets the last used sorting property and order
  fasd.filter = sessionStorage.getItem(_websiteConfigurationService.configuration.itemsFilterStorageKey) ?? undefined
  filterAndSortingData.value = fasd
}

/**
 * Gets the items.
 */
async function getItemsAsync(): Promise<IItem[]> {
  isLoading.value = true

  const items = await _itemService.getAllAsync()

  nextTick(() => isLoading.value = false)

  return items
}

/**
 * Redirects to the welcome page.
 */
function goToHome(): void {
  _router.push({ name: 'Welcome' })
}

/**
 * Reacts to the filter and sorting data being changed.
 *
 * Saves filter and sorting data.
 */
function onFilterAndSortingDataChanged(): void {
  if (filterAndSortingData.value.categoryId == null) {
    sessionStorage.removeItem(_websiteConfigurationService.configuration.itemsFilterAndSortCategoryStorageKey)
  } else {
    sessionStorage.setItem(_websiteConfigurationService.configuration.itemsFilterAndSortCategoryStorageKey, filterAndSortingData.value.categoryId)
  }

  if (filterAndSortingData.value.filter == null) {
    sessionStorage.removeItem(_websiteConfigurationService.configuration.itemsFilterStorageKey)
  } else {
    sessionStorage.setItem(_websiteConfigurationService.configuration.itemsFilterStorageKey, filterAndSortingData.value.filter)
  }

  localStorage.setItem(_websiteConfigurationService.configuration.itemsSortPropertyStorageKey, filterAndSortingData.value.property)
  localStorage.setItem(_websiteConfigurationService.configuration.itemsSortOrderStorageKey, filterAndSortingData.value.order.toString())
}

/**
 * Reacts to an item being selected.
 *
 * Displays in a sidebar the stats of the item the user has selected.
 * @param selectedBuilds - Selected items.
 */
function onItemSelected(selectedItems: IItem[]): void {
  if (selectedItems.length > 0) {
    _globalSidebarService.display({
      displayedComponentType: 'StatsSidebar',
      displayedComponentParameters: selectedItems[0]
    })
  }
}
</script>










<template>
  <div class="items">
    <div class="items-title items-title-outside-toolbar">
      {{ $t('caption.itemsList') }}
    </div>
    <Toolbar
      ref="itemsToolbar"
      :buttons="_toolbarButtons"
    >
      <template #center>
        <div class="items-title items-title-in-toolbar">
          {{ $t('caption.itemsList') }}
        </div>
      </template>
      <template #right>
        <NotificationButton />
      </template>
    </Toolbar>
    <ItemsList
      v-model:filter-and-sorting-data="filterAndSortingData as ItemFilterAndSortingData"
      :element-to-stick-to="toolbarContainer"
      :get-items-function="getItemsAsync"
      :has-selection="false"
      class="items-list"
      @update:filter-and-sorting-data="onFilterAndSortingDataChanged"
      @update:selected-items="onItemSelected"
    />
  </div>
</template>










<style>
.items {
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
}

.items-list {
  height: 100%;
}

.items-title {
  align-items: center;
  display: flex;
  font-size: 1.5rem;
  justify-content: center;
  min-height: 2.75rem;
  text-align: center;
}

.items-title-in-toolbar {
  height: 100%;
}

.items-title-outside-toolbar {
  margin-bottom: 1rem;
}

/* Smartphone in portrait */
@media only screen and (max-width: 480px) {
  .items-title-in-toolbar {
    display: none;
  }
}

/* Smartphone in landscape */
@media only screen and (min-width: 481px) and (max-width: 767px) {
  .items-title-in-toolbar {
    display: none;
  }
}

/* Tablet in portrait */
@media only screen and (min-width: 768px) and (max-width: 991px) {
  .items-title-outside-toolbar {
    display: none;
  }
}

/* Tablet in landscape */
@media only screen and (min-width: 992px) and (max-width: 1299px) {
  .items-title-outside-toolbar {
    display: none;
  }
}

/* PC */
@media only screen and (min-width: 1300px) {
  .items-title-outside-toolbar {
    display: none;
  }
}
</style>