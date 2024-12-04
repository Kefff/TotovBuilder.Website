<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { IItem } from '../../models/item/IItem'
import { IPrice } from '../../models/item/IPrice'
import { GlobalSidebarService } from '../../services/GlobalSidebarService'
import { InventoryItemService } from '../../services/InventoryItemService'
import Services from '../../services/repository/Services'
import StatsUtils, { DisplayValueType } from '../../utils/StatsUtils'
import ItemIcon from '../ItemIconComponent.vue'
import Price from '../PriceComponent.vue'
import Tooltip from '../TooltipComponent.vue'

const modelIsSelected = defineModel<boolean>('isSelected', { required: true })

const props = withDefaults(
  defineProps<{
    item: IItem,
    selectable?: boolean,
    selectionButtonIcon?: string
  }>(),
  {
    selectable: false,
    selectionButtonIcon: undefined
  })

const _inventoryItemService = Services.get(InventoryItemService)
const _globalSidebarService = Services.get(GlobalSidebarService)

const height = computed(() => `${props.selectable ? 13.5 : 11.5}rem`)
const selectionButtonIconInternal = computed(() => {
  if (props.selectionButtonIcon != null) {
    return props.selectionButtonIcon
  } else if (modelIsSelected.value) {
    return 'times'
  } else {
    return 'check'
  }
})

const itemUnitPrice = ref<IPrice>()

onMounted(() => getItemPriceAsync())

watch(() => props.item, () => getItemPriceAsync())

/**
 * Gets the price of the item.
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
}

/**
 * Displays the statistics of the item.
 */
function displayStats(): void {
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
      <div>
        <div
          class="item-card-title"
          @click="displayStats"
        >
          <ItemIcon :item="item" />
          <div>{{ item.name }}</div>
        </div>
      </div>
    </template>
    <template #content>
      <div class="card-line item-card-price-line">
        <div
          v-if="itemUnitPrice != null && itemUnitPrice.valueInMainCurrency > 0"
          class="item-card-long"
        >
          <Price :price="itemUnitPrice" />
        </div>
        <div
          v-if="item.weight != 0"
          class="item-card-long"
        >
          <Tooltip :tooltip="$t('caption.weight')">
            <font-awesome-icon
              icon="weight-hanging"
              class="icon-before-text"
            />
            <span>
              {{ StatsUtils.getStandardDisplayValue(DisplayValueType.weight, item.weight) }}
            </span>
          </Tooltip>
        </div>
      </div>
      <slot />
      <div
        v-if="selectable"
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
  margin-top: 0.15rem;
}

.item-card-title {
  align-items: center;
  cursor: pointer;
  display: flex;
  font-size: 1rem;
  font-weight: normal;
  gap: 0.5rem;
  white-space: preserve;
}
</style>