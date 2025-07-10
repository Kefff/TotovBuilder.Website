<script setup lang="ts">
import { useScroll } from '@vueuse/core'
import { computed, ref } from 'vue'
import { IItem } from '../models/item/IItem'
import BuildFilterAndSortingData from '../models/utils/BuildFilterAndSortingData'
import { IBuildSummary } from '../models/utils/IBuildSummary'
import { IListSelectionOptions } from '../models/utils/IListSelectionOptions'
import { BuildPropertiesService } from '../services/BuildPropertiesService'
import { BuildService } from '../services/BuildService'
import { GlobalSidebarService } from '../services/GlobalSidebarService'
import Services from '../services/repository/Services'
import StatsUtils, { DisplayValueType } from '../utils/StatsUtils'
import InventoryPrice from './InventoryPriceComponent.vue'
import ItemIcon from './ItemIconComponent.vue'
import ShoppingListMerchantsList from './ShoppingListMerchantsListComponent.vue'
import Tooltip from './TooltipComponent.vue'

const modelIsSelected = defineModel<boolean>('isSelected', { required: true })

const props = withDefaults(
  defineProps<{
    buildSummary: IBuildSummary,
    filterAndSortingData?: BuildFilterAndSortingData,
    selectionOptions: IListSelectionOptions,
    showActionsButton?: boolean,
    showNotExported: boolean,
    showShoppingList?: boolean
  }>(),
  {
    filterAndSortingData: undefined,
    showActionsButton: true,
    showShoppingList: true
  })

const _buildService = Services.get(BuildService)
const _globalSidebarService = Services.get(GlobalSidebarService)

const hasItemListElementScroll = computed(() => (itemsListElement.value?.scrollWidth ?? 0) > (itemsListElement.value?.clientWidth ?? 0))
const itemsInInventorySlots = computed(() => props.buildSummary.shoppingList.filter(sli => sli.inventorySlotId != null))
const notExportedTooltip = computed(() => {
  if (props.buildSummary.exported) {
    return ''
  }

  const tooltip = Services.get(BuildPropertiesService).getNotExportedTooltip(props.buildSummary.lastUpdated, props.buildSummary.lastExported)

  return tooltip
})
const selectionButtonCaptionInternal = computed(() => {
  if (props.selectionOptions.selectionButtonCaption != null) {
    return props.selectionOptions.selectionButtonCaption
  } else if (modelIsSelected.value) {
    return 'caption.deselect'
  } else {
    return 'caption.select'
  }
})
const selectionButtonIconInternal = computed(() => {
  if (props.selectionOptions.selectionButtonIcon != null) {
    return props.selectionOptions.selectionButtonIcon
  } else if (modelIsSelected.value) {
    return 'times'
  } else {
    return 'check'
  }
})

const itemsListElement = ref<HTMLDivElement>()
const itemListElementScroll = useScroll(itemsListElement)

/**
 * Displays the actions for the specified build.
 */
function displayActions(): void {
  const build = _buildService.get(props.buildSummary.id)

  if (build != null) {
    _globalSidebarService.display({
      displayedComponentType: 'BuildSidebar',
      displayedComponentParameters: build
    })
  }
}

/**
 * Displays the shopping list for the specified build.
 */
function displayShoppingList(): void {
  _globalSidebarService.display({
    displayedComponentType: 'ShoppingListSidebar',
    displayedComponentParameters: {
      buildName: props.buildSummary.name,
      shoppingList: props.buildSummary.shoppingList
    }
  })
}

/**
 * Displays the stats of an item.
 * @param item - Item.
 */
function displayStats(item: IItem): void {
  _globalSidebarService.display({
    displayedComponentType: 'StatsSidebar',
    displayedComponentParameters: item
  })
}

</script>











<template>
  <Card
    class="card build-card"
    :class="{ 'card-selected': modelIsSelected }"
  >
    <template #title>
      <div class="build-card-header">
        <div class="build-card-title">
          <Tooltip :tooltip="buildSummary.name">
            <span>{{ buildSummary.name }}</span>
          </Tooltip>
        </div>
        <Tooltip
          v-if="showNotExported && !buildSummary.exported"
          :tooltip="notExportedTooltip"
        >
          <font-awesome-icon
            class="build-card-not-exported"
            icon="exclamation-triangle"
          />
        </Tooltip>
        <Tooltip
          v-if="showActionsButton"
          :apply-hover-style="false"
          :disabled-on-mobile="true"
          :tooltip="$t('caption.actions')"
        >
          <Button
            class="p-button-sm"
            outlined
            @click="displayActions()"
          >
            <font-awesome-icon icon="ellipsis-h" />
          </Button>
        </Tooltip>
      </div>
    </template>
    <template #content>
      <div class="build-card-items-container">
        <div
          class="build-card-items-left-scroll-indicator"
          :style="hasItemListElementScroll && !itemListElementScroll.arrivedState.left ? 'display: initial' : 'display: none'"
        />
        <div
          v-if="itemsInInventorySlots.length > 0"
          ref="itemsListElement"
          class="build-card-items"
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
          :style="hasItemListElementScroll && !itemListElementScroll.arrivedState.right ? 'display: initial' : 'display: none'"
        />
      </div>
      <div class="card-lines">
        <div
          v-if="buildSummary.price.priceByCurrency.length > 0
            || buildSummary.weight !== 0"
          class="card-line card-line3"
        >
          <Tooltip
            v-if="buildSummary.weight !== 0"
            :tooltip="$t('caption.weight')"
          >
            <div
              class="card-value"
              :class="StatsUtils.getSortedPropertyColorClass('weight', filterAndSortingData)"
            >
              <font-awesome-icon
                icon="weight-hanging"
                class="icon-before-text"
              />
              <span :class="StatsUtils.getWeightColorClass(buildSummary.weight)">
                {{ StatsUtils.getStandardDisplayValue(DisplayValueType.weight, buildSummary.weight) }}
              </span>
            </div>
          </Tooltip>
          <div
            v-if="buildSummary.price.priceByCurrency.length > 0"
            class="build-card-price"
            :class="StatsUtils.getSortedPropertyColorClass('price', filterAndSortingData)"
          >
            <InventoryPrice
              :inventory-price="buildSummary.price"
              :is-build="true"
            />
          </div>
        </div>
        <div
          v-if="buildSummary.recoil.verticalRecoil !== 0
            && buildSummary.recoil.horizontalRecoil !== 0
            && (buildSummary.ergonomics !== 0
              || buildSummary.wearableModifiers.ergonomicsModifierPercentage !== 0)"
          class="card-line card-line3"
        >
          <Tooltip
            v-if="buildSummary.recoil.verticalRecoil !== 0"
            :tooltip="$t('caption.verticalRecoil')"
          >
            <div
              class="card-value"
              :class="StatsUtils.getSortedPropertyColorClass('recoil', filterAndSortingData)"
            >
              <font-awesome-icon
                icon="arrows-alt-v"
                class="icon-before-text"
              />
              <span>{{ StatsUtils.getStandardDisplayValue(DisplayValueType.recoil, buildSummary.recoil.verticalRecoil) }}</span>
            </div>
          </Tooltip>
          <Tooltip
            v-if="buildSummary.recoil.horizontalRecoil !== 0"
            :tooltip="$t('caption.horizontalRecoil')"
          >
            <div class="card-value">
              <font-awesome-icon
                icon="arrows-alt-h"
                class="icon-before-text"
              />
              <span>{{ StatsUtils.getStandardDisplayValue(DisplayValueType.recoil, buildSummary.recoil.horizontalRecoil) }}</span>
            </div>
          </Tooltip>
          <Tooltip
            v-if="buildSummary.ergonomics !== 0"
            :tooltip="$t('caption.ergonomicsModifierPercentage')"
          >
            <div
              class="card-value"
              :class="StatsUtils.getSortedPropertyColorClass('ergonomics', filterAndSortingData)"
            >
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
            </div>
          </Tooltip>
          <Tooltip
            v-else-if="buildSummary.wearableModifiers.ergonomicsModifierPercentage !== 0"
            :tooltip="$t('caption.ergonomicsModifierPercentage')"
          >
            <div class="card-value">
              <font-awesome-icon
                icon="hand-paper"
                class="icon-before-text"
              />
              <span :class="StatsUtils.getValueColorClass(buildSummary.wearableModifiers.ergonomicsModifierPercentage)">
                {{ StatsUtils.getStandardDisplayValue(DisplayValueType.ergonomicsModifierPercentage, buildSummary.wearableModifiers.ergonomicsModifierPercentage) }}
              </span>
            </div>
          </Tooltip>
        </div>
        <div
          v-if="buildSummary.armorModifiers.armorClass > 0
            && buildSummary.wearableModifiers.movementSpeedModifierPercentage !== 0
            && buildSummary.wearableModifiers.turningSpeedModifierPercentage !== 0"
          class="card-line card-line3"
        >
          <Tooltip
            v-if="buildSummary.armorModifiers.armorClass > 0"
            :tooltip="$t('caption.armorClass')"
          >
            <div
              class="card-value"
              :class="StatsUtils.getSortedPropertyColorClass('armorClass', filterAndSortingData)"
            >
              <font-awesome-icon
                icon="award"
                class="icon-before-text"
              />
              <span>{{ StatsUtils.getStandardDisplayValue(DisplayValueType.armorClass, buildSummary.armorModifiers.armorClass) }}</span>
            </div>
          </Tooltip>
          <Tooltip
            v-if="buildSummary.wearableModifiers.movementSpeedModifierPercentage !== 0"
            :tooltip="$t('caption.movementSpeedModifierPercentage')"
          >
            <div class="card-value">
              <font-awesome-icon
                icon="walking"
                class="icon-before-text"
              />
              <span :class="StatsUtils.getValueColorClass(buildSummary.wearableModifiers.movementSpeedModifierPercentage)">
                {{ StatsUtils.getStandardDisplayValue(DisplayValueType.movementSpeedModifierPercentage, buildSummary.wearableModifiers.movementSpeedModifierPercentage) }}
              </span>
            </div>
          </Tooltip>
          <Tooltip
            v-if="buildSummary.wearableModifiers.turningSpeedModifierPercentage !== 0"
            :tooltip="$t('caption.turningSpeedModifierPercentage')"
          >
            <div class="card-value">
              <font-awesome-icon
                icon="undo"
                class="icon-before-text"
              />
              <span :class="StatsUtils.getValueColorClass(buildSummary.wearableModifiers.turningSpeedModifierPercentage)">
                {{ StatsUtils.getStandardDisplayValue(DisplayValueType.turningSpeedModifierPercentage, buildSummary.wearableModifiers.turningSpeedModifierPercentage) }}
              </span>
            </div>
          </Tooltip>
        </div>
        <ShoppingListMerchantsList :shopping-list="buildSummary.shoppingList" />
      </div>
      <div
        v-if="!modelIsSelected
          || selectionOptions.canUnselect
          || showShoppingList"
        class="card-buttons"
      >
        <Button
          v-if="!modelIsSelected || selectionOptions.canUnselect"
          :outlined="modelIsSelected"
          @click="modelIsSelected = !modelIsSelected"
        >
          <font-awesome-icon
            :icon="selectionButtonIconInternal"
            class="icon-before-text"
          />
          <span>{{ $t(selectionButtonCaptionInternal) }}</span>
        </Button>
        <Button
          v-if="showShoppingList"
          :disabled="buildSummary.shoppingList.length === 0"
          class="shopping-list-button"
          outlined
          @click="displayShoppingList()"
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










<style scoped>
.build-card {
  height: 22rem;
}

.build-card-header {
  align-items: center;
  display: flex;
  gap: 0.75rem;
  height: 2rem;
}

.build-card-items {
  display: flex;
  flex-direction: row;
  gap: 0.25rem;
  height: 4.125rem;
  overflow-x: auto;
  width: 100%;
}

.build-card-items > div {
  padding-bottom: 0.25rem;
}

.build-card-items-container {
  position: relative;
}

.build-card-items-icon {
  cursor: pointer;
}

.build-card-items-left-scroll-indicator {
  border-bottom-left-radius: 3px;
  border-left-color: var(--primary-color3);
  border-left-style: solid;
  border-left-width: 3px;
  border-top-left-radius: 3px;
  height: calc(100% - 0.15rem);
  left: -0.5rem;
  position: absolute;
  top: 0;
}

.build-card-items-right-scroll-indicator {
  border-bottom-right-radius: 3px;
  border-right-color: var(--primary-color3);
  border-right-style: solid;
  border-right-width: 3px;
  border-top-right-radius: 3px;
  height: calc(100% - 0.15rem);
  position: absolute;
  right: -0.5rem;
  top: 0;
}

.build-card-not-exported {
  color: var(--warning-color);
  margin-left: 0.5rem;
}

.build-card-price {
  display: flex;
  grid-column: span 2;
}

.build-card-title {
  font-size: 1rem;
  overflow: hidden;
  width: 100%;
  max-height: 2.25rem;
}
</style>