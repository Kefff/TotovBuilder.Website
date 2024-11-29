<script setup lang="ts">
import { useScroll } from '@vueuse/core'
import { computed, ref } from 'vue'
import { IItem } from '../models/item/IItem'
import { IBuildSummary } from '../models/utils/IBuildSummary'
import { BuildPropertiesService } from '../services/BuildPropertiesService'
import { BuildService } from '../services/BuildService'
import { GlobalSidebarService } from '../services/GlobalSidebarService'
import Services from '../services/repository/Services'
import StatsUtils, { DisplayValueType } from '../utils/StatsUtils'
import InventoryPrice from './InventoryPriceComponent.vue'
import ItemIcon from './ItemIconComponent.vue'
import Tooltip from './TooltipComponent.vue'

const modelIsSelected = defineModel<boolean>('isSelected', { required: true })

const props = withDefaults(
  defineProps<{
    buildSummary: IBuildSummary,
    selectionButtonCaption?: string,
    selectionButtonIcon?: string,
    showActionsButton?: boolean,
    showNotExported: boolean,
    showShoppingList?: boolean
  }>(),
  {
    selectionButtonCaption: undefined,
    selectionButtonIcon: undefined,
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
  if (props.selectionButtonCaption != null) {
    return props.selectionButtonCaption
  } else if (modelIsSelected.value) {
    return 'caption.deselect'
  } else {
    return 'caption.select'
  }
})
const selectionButtonIconInternal = computed(() => {
  if (props.selectionButtonIcon != null) {
    return props.selectionButtonIcon
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
    class="build-card"
    :class="modelIsSelected ? 'build-card-selected ' : ''"
  >
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
        <Tooltip
          v-if="showActionsButton"
          :tooltip="$t('caption.actions')"
          :apply-hover-style="false"
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
      <div class="build-card-stats">
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
      <div class="build-card-stats">
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
      <div class="build-card-stats">
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
      <div class="build-card-buttons">
        <Button
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
@import '../css/icon.css';
@import '../css/stats.css';

.builds-list {
  display: grid;
  grid-gap: 1rem;
  grid-template-columns: repeat(3, 1fr);
}

.build-card {
  background-color: var(--surface-transparent-0);
  border-color: var(--primary-color6);
  border-radius: 6px;
  border-style: solid;
  border-width: 1px;
  height: 20rem;
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

.build-card-merchants {
  margin-top: 0.5rem;
}

.build-card-price {
  display: flex;
  grid-column: span 2;
}

.build-card-selected {
  background-color: var(--primary-color6)
}

.build-card-stats {
  align-items: center;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  margin-top: 0.5rem;
  min-height: 1.25rem;
}

.build-card-title {
  align-items: center;
  display: flex;
  font-size: 1.25rem;
  gap: 0.5rem;
  white-space: preserve;
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