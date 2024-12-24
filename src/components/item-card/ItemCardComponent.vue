<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import { IItem } from '../../models/item/IItem'
import { IPrice } from '../../models/item/IPrice'
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

const props = withDefaults(
  defineProps<{
    isSelectable?: boolean,
    item: IItem,
    selectionButtonIcon?: string
  }>(),
  {
    isSelectable: false,
    selectionButtonIcon: undefined
  })

const _inventoryItemService = Services.get(InventoryItemService)
const _globalFilterService = Services.get(GlobalFilterService)
const _globalSidebarService = Services.get(GlobalSidebarService)


const height = computed(() => `${props.isSelectable ? 15 : 11.5}rem`)
const selectionButtonIconInternal = computed(() => {
  if (props.selectionButtonIcon != null) {
    return props.selectionButtonIcon
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
        <!-- Specialized stats -->
        <ItemCardSelector :item="item" />
        <!-- Price and weight -->
        <div class="card-line card-line4 item-card-price-line">
          <div
            v-if="itemUnitPrice != null && itemUnitPrice.valueInMainCurrency > 0"
            class="item-card-long"
          >
            <Price :price="itemUnitPrice" />
          </div>
          <Tooltip
            v-if="item.weight != 0"
            :tooltip="$t('caption.weight')"
            class="item-card-long card-value"
          >
            <font-awesome-icon
              icon="weight-hanging"
              class="icon-before-text"
            />
            <span>
              {{ StatsUtils.getStandardDisplayValue(DisplayValueType.weight, weight) }}
            </span>
          </Tooltip>
        </div>
        <div
          v-if="isSelectable"
          class="card-buttons"
        >
          <Button @click="modelIsSelected = !modelIsSelected">
            <font-awesome-icon
              :icon="selectionButtonIconInternal"
              class="icon-before-text"
            />
            <span>{{ $t('caption.select') }}</span>
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

.item-card-long {
  display: flex;
  grid-column: span 2;
}

.item-card-price-line {
  height: 2rem;
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
</style>