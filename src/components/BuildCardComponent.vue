<template>
  <Card class="build-card">
    <template #title>
      <div class="build-card-title">
        <div>{{ buildSummary.name }}</div>
        <Tooltip
          v-if="showNotExported && !buildSummary.exported"
          :tooltip="notExportedTooltip"
        >
          <font-awesome-icon
            class="buil-card-not-exported"
            icon="exclamation-triangle"
          />
        </Tooltip>
      </div>
    </template>
    <template #content>
      <div class="build-card-items-container">
        <div
          class="build-card-items-left-scroll-indicator"
          :style="itemsListElementHasLeftScroll ? 'display: initial' : 'display: none'"
        />
        <div
          v-if="itemsInInventorySlots.length > 0"
          ref="itemsListElement"
          class="build-card-items"
          @scroll="onItemsListScroll"
        >
          <div
            v-for="itemInInventorySlot of itemsInInventorySlots"
            :key="itemInInventorySlot.inventorySlotId"
          >
            <div
              class="build-card-items-icon"
              @click="displayStats(itemInInventorySlot.item)"
            >
              <Tooltip :tooltip="itemInInventorySlot.item.name">
                <ItemIcon
                  :item="itemInInventorySlot.item"
                  :quantity="itemInInventorySlot.quantity"
                />
              </Tooltip>
            </div>
          </div>
        </div>
        <div
          class="build-card-items-right-scroll-indicator"
          :style="itemsListElementHasRightScroll ? 'display: initial' : 'display: none'"
        />
      </div>
      <div
        v-if="buildSummary.recoil.verticalRecoil !== 0 || buildSummary.recoil.horizontalRecoil !== 0 || buildSummary.ergonomics !== 0 || buildSummary.wearableModifiers.ergonomicsModifierPercentage !== 0"
        class="build-card-stats"
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
        class="build-card-stats"
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
      <div
        v-if="buildSummary.price.priceInMainCurrency > 0 || buildSummary.weight != 0"
        class="build-card-stats"
      >
        <div
          v-if="buildSummary.price.priceInMainCurrency > 0"
          class="build-card-price"
        >
          <InventoryPrice
            :inventory-price="buildSummary.price"
            :is-build="true"
          />
        </div>
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
      </div>
      <div class="build-card-merchants">
        <ShoppingListMerchantsList :shopping-list="buildSummary.shoppingList" />
      </div>
      <div class="build-card-buttons">
        <Button @click="modelIsSelected = !modelIsSelected">
          <font-awesome-icon
            icon="edit"
            class="icon-before-text"
          />
          <span>{{ $t('caption.edit') }}</span>
        </Button>
        <Button
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
</template>










<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { IShoppingListItem } from '../models/build/IShoppingListItem'
import { IItem } from '../models/item/IItem'
import { IBuildSummary } from '../models/utils/IBuildSummary'
import { BuildPropertiesService } from '../services/BuildPropertiesService'
import { GlobalSidebarService } from '../services/GlobalSidebarService'
import Services from '../services/repository/Services'
import StatsUtils, { DisplayValueType } from '../utils/StatsUtils'
import InventoryPrice from './InventoryPriceComponent.vue'
import ItemIcon from './ItemIconComponent.vue'
import ShoppingListMerchantsList from './ShoppingListMerchantsListComponent.vue'

const modelIsSelected = defineModel<boolean>('isSelected', { required: true })

const props = defineProps<{
  buildSummary: IBuildSummary,
  showNotExported: boolean
}>()

const itemsListElement = ref<HTMLDivElement>()
const itemsListElementHasLeftScroll = ref(false)
const itemsListElementHasRightScroll = ref(false)

const itemsInInventorySlots = computed(() => props.buildSummary.shoppingList.filter(sli => sli.inventorySlotId != null))
const notExportedTooltip = computed(() => {
  if (props.buildSummary.exported) {
    return ''
  }

  const tooltip = Services.get(BuildPropertiesService).getNotExportedTooltip(props.buildSummary.lastUpdated, props.buildSummary.lastExported)

  return tooltip
})

watch(() => itemsListElement.value?.scrollWidth, () => {
  setItemsListElementHasScroll()
})

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

/**
 * Displays the stats of an item.
 * @param item - Item.
 */
function displayStats(item: IItem) {
  Services.get(GlobalSidebarService).display({
    displayedComponentType: 'StatsSidebar',
    position: 'right',
    displayedComponentParameters: item
  })
}

/**
 * React to the horizontal scroll in the merchants list.
 *
 * Updates the values indicating whether left or right scroll are possible.
 */
function onItemsListScroll() {
  setItemsListElementHasScroll()
}

/**
 * Checks whether the items list element has left and right scroll and sets a value indicating it.
 */
function setItemsListElementHasScroll() {
  if (itemsListElement.value != null) {
    itemsListElementHasLeftScroll.value = itemsListElement.value.scrollLeft !== 0
    itemsListElementHasRightScroll.value = itemsListElement.value.scrollLeft + itemsListElement.value.clientWidth < itemsListElement.value.scrollWidth
  } else {
    itemsListElementHasLeftScroll.value = false
    itemsListElementHasRightScroll.value = false
  }
}
</script>










<style scoped>
@import '../css/icon.css';
@import '../css/stats.css';

.builds-list {
  display: grid;
  grid-gap: 1rem;
  grid-template-columns: repeat(3, 1fr);
}

.build-card {
  overflow: hidden;
  width: 100%;
}

.build-card-buttons {
  display: flex;
  gap: 2rem;
  justify-content: center;
  margin-top: auto;
  padding-top: 1rem;
}

.build-card-buttons > button {
  align-items: center;
  display: flex;
  justify-content: center;
  width: 50%;
}

.build-card-buttons-edit {
  align-items: center;
  display: flex;
  justify-content: center;
}

.build-card-items {
  display: flex;
  flex-direction: row;
  gap: 0.25rem;
  overflow-x: auto;
  padding-bottom: 0.5rem;
  width: 100%;
}

.build-card-items-container {
  padding-top: 0.5rem;
  position: relative;
}

.build-card-items-icon {
  cursor: pointer;
}

.build-card-items-left-scroll-indicator {
  border-bottom-left-radius: 3px;
  border-left-color: var(--primary-color);
  border-left-style: solid;
  border-left-width: 3px;
  border-top-left-radius: 3px;
  height: calc(100% - 0.15rem);
  left: -0.5rem;
  position: absolute;
  top: 0;
  z-index: 1;
}

.build-card-items-right-scroll-indicator {
  border-bottom-right-radius: 3px;
  border-right-color: var(--primary-color);
  border-right-style: solid;
  border-right-width: 3px;
  border-top-right-radius: 3px;
  height: calc(100% - 0.15rem);
  position: absolute;
  right: -0.5rem;
  top: 0;
  z-index: 1;
}

.build-card-merchants {
  margin-top: 0.5rem;
}

.build-card-price {
  display: flex;
  grid-column: span 2;
}

.build-card-stats {
  align-items: center;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  margin-top: 0.5rem;
}

.build-card-title {
  display: flex;
  font-size: 1.25rem;
}

.build-card-title > div {
  margin-right: auto;
}

.buil-card-not-exported {
  color: var(--warning-color);
  margin-left: 0.5rem;
}
</style>



<style>
.build-card > .p-card-body {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.build-card > .p-card-body > .p-card-content {
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: 0;
}
</style>