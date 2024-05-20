<script setup lang="ts">
import { DataTableSortEvent } from 'primevue/datatable'
import { onMounted, ref, watch } from 'vue'
import { IShoppingListItem } from '../models/build/IShoppingListItem'
import { IBuildSummary } from '../models/utils/IBuildSummary'
import { BuildPropertiesService } from '../services/BuildPropertiesService'
import { GlobalSidebarService } from '../services/GlobalSidebarService'
import { WebsiteConfigurationService } from '../services/WebsiteConfigurationService'
import Services from '../services/repository/Services'
import StatsUtils, { DisplayValueType } from '../utils/StatsUtils'
import InventoryPrice from './InventoryPriceComponent.vue'
import ItemIcon from './ItemIconComponent.vue'
import Tooltip from './tooltip/TooltipComponent.vue'

const buildPropertiesService = Services.get(BuildPropertiesService)

const modelSelectedBuildSummaries = defineModel<IBuildSummary[]>('selectedBuildSummaries')

const props = withDefaults(
  defineProps<{
    buildSummaries: IBuildSummary[],
    showNotExported?: boolean
  }>(),
  {
    showNotExported: true
  })

const buildsItemsInInventorySlot = ref<IShoppingListItem[][]>([])
const sortField = ref('name')
const sortOrder = ref(1)

onMounted(() => {
  getSortingData()
  getBuildsItemsInInventorySlot()
})

watch(() => props.buildSummaries.length, () => {
  getBuildsItemsInInventorySlot()
})

/**
 * Gets the items of each build that are in an inventory slot.
 */
function getBuildsItemsInInventorySlot() {
  const buildsItems: IShoppingListItem[][] = []
  for (const buildSummary of props.buildSummaries) {
    const buildItems = buildSummary.shoppingList.filter(sli => sli.inventorySlotId != null)
    buildsItems.push(buildItems)
  }

  buildsItemsInInventorySlot.value = buildsItems
}

/**
 * Gets the tooltip for not exported builds.
 * @param buildSummary - Build summary.
 * @returns Tooltip.
 */
function getNotExportedTooltip(buildSummary: IBuildSummary): string {
  if (buildSummary.exported) {
    return ''
  }

  const tooltip = buildPropertiesService.getNotExportedTooltip(buildSummary.lastUpdated, buildSummary.lastExported)

  return tooltip
}

/**
 * Gets the sorting data.
 */
function getSortingData() {
  const websiteConfigurationService = Services.get(WebsiteConfigurationService)

  sortField.value = localStorage.getItem(websiteConfigurationService.configuration.buildsSortFieldStorageKey) ?? 'name'
  sortOrder.value = Number(localStorage.getItem(websiteConfigurationService.configuration.buildsSortOrderStorageKey)) ?? 1
}

/**
 * Saves the last used sorting data.
 * @param event - Sorting event.
 */
function onSort(event: DataTableSortEvent) {
  const websiteConfigurationService = Services.get(WebsiteConfigurationService)
  const sortField = event.sortField as string
  const sortOrder = event.sortOrder as number

  localStorage.setItem(websiteConfigurationService.configuration.buildsSortFieldStorageKey, sortField)
  localStorage.setItem(websiteConfigurationService.configuration.buildsSortOrderStorageKey, sortOrder.toString())
}

/**
 * Displays the shopping list for the specified build.
 * @param buildSummary - Summary of the build.
 */
function displayShoppingList(shoppingList: IShoppingListItem[]) {
  Services.get(GlobalSidebarService).display({
    displayedComponentType: 'ShoppingListSidebar',
    displayedComponentParameters: shoppingList,
    position: 'left'
  })
}
</script>












<template>
  <div class="builds-list">
    <Card
      v-for="(buildSummary, index) of buildSummaries"
      :key="buildSummary.id"
      class="builds-list-card"
    >
      <template #title>
        <div class="builds-list-card-title">
          <div>{{ buildSummary.name }}</div>
          <Tooltip
            v-if="showNotExported && !buildSummary.exported"
            :tooltip="getNotExportedTooltip(buildSummary)"
          >
            <font-awesome-icon
              class="builds-list-not-exported"
              icon="exclamation-triangle"
            />
          </Tooltip>
        </div>
      </template>
      <template #content>
        <div class="builds-list-card-items">
          <div
            v-for="buildItemInInventorySlot of buildsItemsInInventorySlot[index]"
            :key="buildItemInInventorySlot.inventorySlotId"
          >
            <div>
              <Tooltip :tooltip="buildItemInInventorySlot.item.name">
                <ItemIcon
                  :item="buildItemInInventorySlot.item"
                  :quantity="buildItemInInventorySlot.quantity"
                />
              </Tooltip>
            </div>
          </div>
        </div>
        <div
          v-if="buildSummary.price.priceInMainCurrency > 0 || buildSummary.weight != 0"
          class="builds-list-card-stats"
        >
          <div v-if="buildSummary.weight != 0">
            <Tooltip :tooltip="$t('caption.weight')">
              <font-awesome-icon
                icon="weight-hanging"
                class="icon-before-text"
              />
              <span :class="StatsUtils.getWeightColorClass(buildSummary.weight)">
                {{ StatsUtils.getStandardDisplayValue(DisplayValueType.weight, buildSummary.weight) }}
              </span>
            </Tooltip>
          </div>
          <div
            v-if="buildSummary.price.priceInMainCurrency > 0"
            class="builds-list-card-price"
          >
            <InventoryPrice
              :inventory-price="buildSummary.price"
              :is-build="true"
            />
          </div>
        </div>
        <div
          v-if="buildSummary.recoil.verticalRecoil !== 0 || buildSummary.recoil.horizontalRecoil !== 0 || buildSummary.ergonomics !== 0 || buildSummary.wearableModifiers.ergonomicsModifierPercentage !== 0"
          class="builds-list-card-stats"
        >
          <div v-if="buildSummary.recoil.verticalRecoil !== 0">
            <Tooltip :tooltip="$t('caption.verticalRecoil')">
              <font-awesome-icon
                icon="arrows-alt-v"
                class="icon-before-text"
              />
              <span>{{ StatsUtils.getStandardDisplayValue(DisplayValueType.recoil, buildSummary.recoil.verticalRecoil) }}</span>
            </tooltip>
          </div>
          <div v-if="buildSummary.recoil.horizontalRecoil !== 0">
            <Tooltip :tooltip="$t('caption.horizontalRecoil')">
              <font-awesome-icon
                icon="arrows-alt-h"
                class="icon-before-text"
              />
              <span>{{ StatsUtils.getStandardDisplayValue(DisplayValueType.recoil, buildSummary.recoil.horizontalRecoil) }}</span>
            </Tooltip>
          </div>
          <div v-if="buildSummary.ergonomics !== 0">
            <Tooltip :tooltip="$t('caption.ergonomics')">
              <font-awesome-icon
                icon="hand-paper"
                class="icon-before-text"
              />
              <span>{{ StatsUtils.getStandardDisplayValue(DisplayValueType.ergonomics, buildSummary.ergonomics) }}</span>
              <span v-if="buildSummary.wearableModifiers.ergonomicsModifierPercentage !== 0">
                (<span :class="StatsUtils.getValueColorClass(buildSummary.wearableModifiers.ergonomicsModifierPercentage)">
                  {{ StatsUtils.getStandardDisplayValue(DisplayValueType.ergonomicsModifierPercentage, buildSummary.wearableModifiers.ergonomicsModifierPercentage) }}
                </span>)
              </span>
            </Tooltip>
          </div>
          <div v-else-if="buildSummary.wearableModifiers.ergonomicsModifierPercentage !== 0">
            <font-awesome-icon
              icon="hand-paper"
              class="icon-before-text"
            />
            <span :class="StatsUtils.getValueColorClass(buildSummary.wearableModifiers.ergonomicsModifierPercentage)">
              {{ StatsUtils.getStandardDisplayValue(DisplayValueType.ergonomicsModifierPercentage, buildSummary.wearableModifiers.ergonomicsModifierPercentage) }}
            </span>
          </div>
        </div>
        <div
          v-if="buildSummary.armorModifiers.armorClass > 0 || buildSummary.wearableModifiers.movementSpeedModifierPercentage !== 0 || buildSummary.wearableModifiers.turningSpeedModifierPercentage !== 0"
          class="builds-list-card-stats"
        >
          <div v-if="buildSummary.armorModifiers.armorClass > 0">
            <Tooltip :tooltip="$t('caption.armorClass')">
              <font-awesome-icon
                icon="award"
                class="icon-before-text"
              />
              <span>{{ StatsUtils.getStandardDisplayValue(DisplayValueType.armorClass, buildSummary.armorModifiers.armorClass) }}</span>
            </Tooltip>
          </div>
          <div v-if="buildSummary.wearableModifiers.movementSpeedModifierPercentage !== 0">
            <Tooltip :tooltip="$t('caption.movementSpeed')">
              <font-awesome-icon
                icon="walking"
                class="icon-before-text"
              />
              <span :class="StatsUtils.getValueColorClass(buildSummary.wearableModifiers.movementSpeedModifierPercentage)">
                {{ StatsUtils.getStandardDisplayValue(DisplayValueType.movementSpeedModifierPercentage, buildSummary.wearableModifiers.movementSpeedModifierPercentage) }}
              </span>
            </Tooltip>
          </div>
          <div v-if="buildSummary.wearableModifiers.turningSpeedModifierPercentage !== 0">
            <Tooltip :tooltip="$t('caption.turningSpeed')">
              <font-awesome-icon
                icon="undo"
                class="icon-before-text"
              />
              <span :class="StatsUtils.getValueColorClass(buildSummary.wearableModifiers.turningSpeedModifierPercentage)">
                {{ StatsUtils.getStandardDisplayValue(DisplayValueType.turningSpeedModifierPercentage, buildSummary.wearableModifiers.turningSpeedModifierPercentage) }}
              </span>
            </Tooltip>
          </div>
        </div>
        <div class="builds-list-card-buttons">
          <Button @click="modelSelectedBuildSummaries = [buildSummary]">
            <font-awesome-icon
              icon="edit"
              class="icon-before-text"
            />
            <span>{{ $t('caption.edit') }}</span>
          </Button>
          <Button
            v-tooltip.top="$t('caption.shoppingList')"
            :disabled="buildSummary.shoppingList.length === 0"
            class="shopping-list-button"
            @click="displayShoppingList(buildSummary.shoppingList)"
          >
            <font-awesome-icon
              class="icon-before-text"
              icon="shopping-cart"
            />
            <span>{{ $t('caption.shoppingList') }}</span>
          </button>
        </div>
      </template>
    </Card>
  </div>
</template>












<style scoped>
@import '../css/icon.css';
@import '../css/stats.css';

.builds-list {
  display: grid;
  grid-gap: 1rem;
  grid-template-columns: repeat(3, 1fr);
}

.builds-list-card {
  overflow: hidden;
  width: 100%;
}

.builds-list-card-buttons {
  display: flex;
  gap: 2rem;
  justify-content: center;
  margin-bottom: 1rem;
  margin-top: auto;
}

.builds-list-card-buttons > button {
  align-items: center;
  display: flex;
  justify-content: center;
  width: 50%;
}

.builds-list-card-buttons-edit {
  align-items: center;
  display: flex;
  justify-content: center;
}

.builds-list-card-items {
  display: flex;
  flex-direction: row;
  gap: 0.25rem;
  overflow-x: auto;
  width: 100%;
}

.builds-list-card-stats {
  align-items: center;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  margin-top: 1rem;
}

.builds-list-card-price {
  grid-column: span 2;
}

.builds-list-card-title {
  display: flex;
  font-size: 1.25rem;
}

.builds-list-card-title > div {
  margin-right: auto;
}

.builds-list-not-exported {
  color: var(--warning-color);
  margin-left: 0.5rem;
}

/* Smartphone in portrait */
@media only screen and (min-width: 320px) and (max-width: 480px) {
  .builds-list {
    grid-template-columns: 1fr;
  }
}

/* Smartphone in landscape */
@media only screen and (min-width: 481px) and (max-width: 767px) {
  .builds-list {
    grid-template-columns: 1fr;
  }
}

/* Tablet in portrait */
@media only screen and (min-width: 768px) and (max-width: 991px) {
  .builds-list {
    grid-template-columns: repeat(2, 1fr);
  }
}

/* Tablet in landscape */
@media only screen and (min-width: 992px) and (max-width: 1199px) {}

/* PC */
@media only screen and (min-width: 1200px) {}
</style>



<style>
.builds-list-card > .p-card-body {
  height: 100%;
}

.builds-list-card > .p-card-body > .p-card-content {
  display: flex;
  flex-direction: column;
  height: 100%;
}
</style>