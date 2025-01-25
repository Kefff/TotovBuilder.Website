<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import { IItem } from '../../models/item/IItem'
import { IPrice } from '../../models/item/IPrice'
import { IListSelectionOptions } from '../../models/utils/IListSelectionOptions'
import { GlobalFilterService } from '../../services/GlobalFilterService'
import { GlobalSidebarService } from '../../services/GlobalSidebarService'
import { InventoryItemService } from '../../services/InventoryItemService'
import Services from '../../services/repository/Services'
import StatsUtils, { DisplayValueType } from '../../utils/StatsUtils'
import ItemIcon from '../ItemIconComponent.vue'
import Price from '../PriceComponent.vue'
import Tooltip from '../TooltipComponent.vue'
import ItemCardSelector from './ItemCardSelectorComponent.vue'

const modelIsSelected = defineModel<boolean>('isSelected', { required: true })

const props = defineProps<{
  item: IItem,
  selectionOptions: IListSelectionOptions
}>()

const _inventoryItemService = Services.get(InventoryItemService)
const _globalFilterService = Services.get(GlobalFilterService)
const _globalSidebarService = Services.get(GlobalSidebarService)

const height = computed(() => `${props.selectionOptions.isEnabled ? 14.75 : 11.25}rem`)
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
const weight = computed(() => props.item.presetWeight ?? props.item.weight)

const itemUnitPrice = ref<IPrice>()

onMounted(() => {
  _globalFilterService.emitter.on(GlobalFilterService.changeEvent, onMerchantFilterChanged)

  getPriceAsync()
})

onUnmounted(() => {
  _globalFilterService.emitter.off(GlobalFilterService.changeEvent, onMerchantFilterChanged)
})

watch(() => props.item, () => getPriceAsync())

/**
 * Gets the price of the item.
 */
async function getPriceAsync(): Promise<void> {
  const itemPrice = await _inventoryItemService.getPriceAsync({
    content: [],
    ignorePrice: false,
    itemId: props.item.id,
    modSlots: [],
    quantity: 1
  })
  itemUnitPrice.value = itemPrice.unitPrice
}

/**
 * Reacts to the merchant filter being changed.
 *
 * Updates the item price to reflect the change in merchant filters.
 */
function onMerchantFilterChanged(): void {
  getPriceAsync()
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
          :tooltip="$t('caption.showDetails')"
          :apply-hover-style="false"
        >
          <Button
            class="p-button-sm"
            outlined
            @click="showDetails()"
          >
            <font-awesome-icon icon="clipboard-list" />
          </Button>
        </Tooltip>
      </div>
    </template>
    <template #content>
      <div class="card-lines">
        <!-- Weight and price -->
        <div class="card-line card-line4 item-card-weight-and-price-line">
          <Tooltip
            v-if="item.weight != 0"
            :tooltip="$t('caption.weight')"
            class="card-value"
          >
            <font-awesome-icon
              icon="weight-hanging"
              class="icon-before-text"
            />
            <span>
              {{ StatsUtils.getStandardDisplayValue(DisplayValueType.weight, weight) }}
            </span>
          </Tooltip>
          <div
            v-if="(itemUnitPrice != null && itemUnitPrice.valueInMainCurrency > 0) || itemUnitPrice?.currencyName === 'barter'"
            class="item-card-price"
          >
            <Price :price="itemUnitPrice" />
          </div>
        </div>
        <!-- Specialized stats -->
        <ItemCardSelector :item="item" />
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

.item-card-price {
  display: flex;
  grid-column: span 3;
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

.item-card-weight-and-price-line {
  height: 2rem;
}
</style>