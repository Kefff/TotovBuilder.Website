<template>
  <div
    v-if="merchants.length > 0"
    class="shopping-list-merchants-list"
  >
    <div
      v-for="merchant of merchants"
      :key="merchant.name"
    >
      <Tooltip :tooltip="$t('caption.merchant_' + merchant.name) + (merchant.level !== 0 ? ` ${$t('caption.level').toLowerCase()} ${merchant.level}` : '')">
        <MerchantIcon
          :merchant="merchant.name"
          :merchant-level="merchant.level"
          :show-tooltip="true"
        />
      </Tooltip>
    </div>
  </div>
</template>










<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import { IShoppingListItem } from '../models/build/IShoppingListItem'
import { IShoppingListMerchant } from '../models/utils/IShoppingListMerchant'
import { BuildPropertiesService } from '../services/BuildPropertiesService'
import Services from '../services/repository/Services'
import MerchantIcon from './MerchantIconComponent.vue'

const props = defineProps<{ shoppingList: IShoppingListItem[] }>()

const buildPropertiesService = Services.get(BuildPropertiesService)

const merchants = ref<IShoppingListMerchant[]>([])

onMounted(() => setRequiredMerchants())

watch(() => props.shoppingList, () => setRequiredMerchants())

/**
 * Sets the required merchants from the shopping list.
 */
function setRequiredMerchants() {
  merchants.value = buildPropertiesService.getShoppingListMerchants(props.shoppingList)
}
</script>










<style scoped>
.shopping-list-merchants-list {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin-top: 0.5rem;
  /* Margins needed to avoid having merchant levels trucated */
  margin-bottom: 0.5rem;
  margin-right: 0.5rem;
}
</style>