<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import { IItem } from '../../models/item/IItem'
import { IPrice } from '../../models/item/IPrice'
import { InventoryItemService } from '../../services/InventoryItemService'
import Services from '../../services/repository/Services'
import StatsUtils, { DisplayValueType } from '../../utils/StatsUtils'
import ItemIcon from '../ItemIconComponent.vue'
import Price from '../PriceComponent.vue'

const props = defineProps<{
  item: IItem,
}>()

const itemUnitPrice = ref<IPrice>()

onMounted(() => initialize())

watch(() => props.item, () => initialize())

async function initialize(): Promise<void> {
  const itemPrice = await Services.get(InventoryItemService).getPrice({
    content: [],
    ignorePrice: false,
    itemId: props.item.id,
    modSlots: [],
    quantity: 1
  })
  itemUnitPrice.value = itemPrice.unitPrice
}
</script>










<template>
  <div class="option-line">
    <div class="option-entry">
      <div class="option-caption">
        {{ item.name }}
      </div>
    </div>
    <div class="option-entry">
      <div class="option-value-long">
        <Price
          v-if="itemUnitPrice != null"
          :price="itemUnitPrice"
        />
      </div>
    </div>
    <div class="option-entry">
      <div class="option-value">
        {{ StatsUtils.getStandardDisplayValue(DisplayValueType.weight, item.weight) }}
      </div>
    </div>
    <slot />
    <div class="option-entry item-summary-icon">
      <ItemIcon :item="item" />
    </div>
  </div>
</template>










<style scoped>
@import '../../css/option.css';

.item-summary-icon {
  display: flex;
  width: 100%;
}
</style>