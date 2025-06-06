<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import { IItem } from '../../models/item/IItem'
import { IModdable } from '../../models/item/IModdable'
import { IPrice } from '../../models/item/IPrice'
import { IListSelectionOptions } from '../../models/utils/IListSelectionOptions'
import ItemFilterAndSortingData from '../../models/utils/ItemFilterAndSortingData'
import { GlobalFilterService } from '../../services/GlobalFilterService'
import { GlobalSidebarService } from '../../services/GlobalSidebarService'
import { InventoryItemService } from '../../services/InventoryItemService'
import { ItemPropertiesService } from '../../services/ItemPropertiesService'
import Services from '../../services/repository/Services'
import StatsUtils, { DisplayValueType } from '../../utils/StatsUtils'
import WebBrowserUtils from '../../utils/WebBrowserUtils'
import ItemIcon from '../ItemIconComponent.vue'
import Price from '../PriceComponent.vue'
import Tooltip from '../TooltipComponent.vue'
import ValueComparison from '../ValueComparisonComponent.vue'
import ItemCardSelector from './ItemCardSelectorComponent.vue'

const modelIsSelected = defineModel<boolean>('isSelected', { required: true })

const props = withDefaults(
  defineProps<{
    comparisonItem?: IItem,
    filterAndSortingData?: ItemFilterAndSortingData,
    item: IItem,
    selectionOptions: IListSelectionOptions
  }>(),
  {
    comparisonItem: undefined,
    filterAndSortingData: undefined
  })

const _globalFilterService = Services.get(GlobalFilterService)
const _globalSidebarService = Services.get(GlobalSidebarService)
const _inventoryItemService = Services.get(InventoryItemService)
const _itemPropertiesService = Services.get(ItemPropertiesService)

const height = computed(() => {
  let h = 12 // Base height with one weight / price line and 2 stats lines

  if (props.selectionOptions.isEnabled) {
    h += 3.5 // For the select button
  }

  if (isSmartphonePortrait.value) {
    h += 2 // Because when in smartphone portrait, one less stats columns but one more stats line
  }

  return `${h}rem`
})
const itemIsModdable = computed(() => _itemPropertiesService.isModdable(props.item))
const modSlotsCount = computed(() => itemIsModdable.value ? (props.item as IModdable).modSlots.length : 0)
const priceColSpan = computed(() => isSmartphonePortrait.value ? 'span 3' : 'span 2')
const weightColSpan = computed(() => isSmartphonePortrait.value ? 'span 1' : 'span 2')
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
const showStatsComparison = computed(() =>
  props.selectionOptions.showStatsComparison
  && props.comparisonItem != null
  && props.comparisonItem.id !== props.item.id)
const weight = computed(() => props.item.presetWeight ?? props.item.weight)

const comparisonItemUnitPriceInMainCurrency = ref<number>(0)
const { isSmartphonePortrait } = WebBrowserUtils.getScreenSize()
const itemUnitPrice = ref<IPrice>()

onMounted(() => {
  _globalFilterService.emitter.on(GlobalFilterService.changeEvent, onMerchantFilterChanged)

  getItemPriceAsync()
})

onUnmounted(() => {
  _globalFilterService.emitter.off(GlobalFilterService.changeEvent, onMerchantFilterChanged)
})

watch(() => props.item.id, () => getItemPriceAsync())
watch(() => props.comparisonItem?.id, () => getComparisonItemPriceAsync())

/**
 * Gets the price of an item.
 */
async function getComparisonItemPriceAsync(): Promise<void> {
  if (!showStatsComparison.value) {
    comparisonItemUnitPriceInMainCurrency.value = 0

    return
  }

  const comparisonItemPrice = await _inventoryItemService.getPriceAsync({
    content: [],
    ignorePrice: false,
    itemId: props.comparisonItem!.id,
    modSlots: [],
    quantity: 1
  })
  comparisonItemUnitPriceInMainCurrency.value = comparisonItemPrice.unitPrice.valueInMainCurrency
}

/**
 * Gets the price of an item.
 */
async function getItemPriceAsync(): Promise<void> {
  const itemPrice = await _inventoryItemService.getPriceAsync({
    content: [],
    ignorePrice: false,
    itemId: props.item.id,
    modSlots: [],
    quantity: 1
  })
  itemUnitPrice.value = itemPrice.unitPrice

  getComparisonItemPriceAsync()
}

/**
 * Reacts to the merchant filter being changed.
 *
 * Updates the item price to reflect the change in merchant filters.
 */
function onMerchantFilterChanged(): void {
  getItemPriceAsync()
}

/**
 * Displays the statistics of the item.
 */
function showDetails(): void {
  _globalSidebarService.display({
    displayedComponentType: 'StatsSidebar',
    displayedComponentParameters: props.item
  })
}
</script>










<template>
  <Card
    class="card item-card"
    :class="{ 'card-selected': modelIsSelected }"
  >
    <template #title>
      <div class="item-card-header">
        <ItemIcon :item="item" />
        <div class="item-card-title">
          <span>{{ item.name }}</span>
        </div>
        <Tooltip
          :apply-hover-style="false"
          :disabled-on-mobile="true"
          :tooltip="modSlotsCount > 0 ? $t('caption.showDetailsWithModSlotsCount', { modSlotsCount }) : $t('caption.showDetails')"
        >
          <Button
            class="p-button-sm"
            outlined
            @click="showDetails()"
          >
            <div class="item-card-details-button-content">
              <font-awesome-icon icon="clipboard-list" />
              <span v-if="modSlotsCount > 0">{{ modSlotsCount }}</span>
              <font-awesome-icon
                v-if="modSlotsCount > 0"
                icon="puzzle-piece"
              />
            </div>
          </Button>
        </Tooltip>
      </div>
    </template>
    <template #content>
      <div class="card-lines">
        <!-- Weight and price -->
        <div class="card-line card-line4 item-card-weight-and-price">
          <Tooltip
            :tooltip="$t('caption.weight')"
            class="item-card-weight"
          >
            <div
              class="card-value"
              :class="StatsUtils.getSortedPropertyColorClass('weight', filterAndSortingData)"
            >
              <div>
                <font-awesome-icon
                  icon="weight-hanging"
                  class="icon-before-text"
                />
                <span>
                  {{ StatsUtils.getStandardDisplayValue(DisplayValueType.weight, weight) }}
                </span>
              </div>
            </div>
            <ValueComparison
              v-if="showStatsComparison"
              :compare-to-value="props.comparisonItem?.presetWeight ?? props.comparisonItem?.weight"
              :current-value="weight"
              :fixed-decimal-count="3"
              :invert="true"
              :round-decimal-count="3"
              suffix=" kg"
            />
          </Tooltip>
          <div
            v-if="(itemUnitPrice != null && itemUnitPrice.valueInMainCurrency > 0) || itemUnitPrice?.currencyName === 'barter'"
            class="item-card-price"
            :class="StatsUtils.getSortedPropertyColorClass('price', filterAndSortingData)"
          >
            <Price :price="itemUnitPrice" />
            <ValueComparison
              v-if="showStatsComparison && itemUnitPrice.valueInMainCurrency > 0"
              :compare-to-value="comparisonItemUnitPriceInMainCurrency"
              :current-value="itemUnitPrice.valueInMainCurrency"
              :invert="true"
            >
              <template #prefix>
                <font-awesome-icon
                  icon="ruble-sign"
                  class="currency-RUB"
                />
              </template>
            </ValueComparison>
          </div>
        </div>
        <!-- Specialized stats -->
        <ItemCardSelector
          :comparison-item="comparisonItem"
          :filter-and-sorting-data="filterAndSortingData"
          :item="item"
        />
        <div
          v-if="selectionOptions.isEnabled"
          class="card-buttons"
        >
          <Button
            :outlined="modelIsSelected || selectionOptions.canUnselect"
            @click="modelIsSelected = !modelIsSelected"
          >
            <font-awesome-icon
              :icon="selectionButtonIconInternal"
              class="icon-before-text"
            />
            <span>{{ $t(selectionButtonCaptionInternal) }}</span>
          </Button>
        </div>
      </div>
    </template>
  </Card>
</template>










<style scoped>
.item-card {
  height: v-bind(height);
}

.item-card-details-button-content {
  display: flex;
  gap: 0.25rem
}

.item-card-header {
  align-items: center;
  display: flex;
  font-size: 1rem;
  font-weight: normal;
  gap: 0.5rem;
  height: 3.75rem;
  white-space: preserve;
}

.item-card-price {
  align-items: center;
  display: flex;
  grid-column: v-bind(priceColSpan);
}

.item-card-title {
  align-items: center;
  display: flex;
  height: 100%;
  width: 100%;
  overflow: auto;
}

.item-card-title > span {
  max-height: 100%;
}

.item-card-weight {
  grid-column: v-bind(weightColSpan);
}
</style>