<script setup lang="ts">
import { useScroll } from '@vueuse/core'
import { computed, onMounted, ref, useTemplateRef, watch } from 'vue'
import { IShoppingListItem } from '../models/build/IShoppingListItem'
import { IShoppingListMerchant } from '../models/utils/IShoppingListMerchant'
import { BuildPropertiesService } from '../services/BuildPropertiesService'
import Services from '../services/repository/Services'
import MerchantIcon from './MerchantIconComponent.vue'
import Tooltip from './TooltipComponent.vue'

const props = defineProps<{ shoppingList: IShoppingListItem[] }>()

const _buildPropertiesService = Services.get(BuildPropertiesService)

const hasMerchantsListElementScroll = computed(() => (merchantsListElement.value?.scrollWidth ?? 0) > (merchantsListElement.value?.clientWidth ?? 0))

const merchants = ref<IShoppingListMerchant[]>([])
const merchantsListElement = useTemplateRef('merchantsListElement')
const merchantsListElementScroll = useScroll(merchantsListElement)

onMounted(() => setRequiredMerchants())

watch(() => props.shoppingList, () => setRequiredMerchants())

/**
 * Sets the required merchants from the shopping list.
 */
function setRequiredMerchants(): void {
  merchants.value = _buildPropertiesService.getShoppingListMerchants(props.shoppingList)
}
</script>










<template>
  <div
    v-if="merchants.length > 0"
    class="shopping-list-merchants-list-container"
  >
    <div
      class="shopping-list-merchants-list-left-scroll-indicator"
      :style="hasMerchantsListElementScroll && !merchantsListElementScroll.arrivedState.left ? 'display: initial' : 'display: none'"
    />
    <div
      ref="merchantsListElement"
      class="shopping-list-merchants-list"
    >
      <div>
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
    </div>
    <div
      class="shopping-list-merchants-list-right-scroll-indicator"
      :style="hasMerchantsListElementScroll && !merchantsListElementScroll.arrivedState.right ? 'display: initial' : 'display: none'"
    />
  </div>
</template>










<style scoped>
.shopping-list-merchants-list {
  overflow-x: auto;
}

.shopping-list-merchants-list > div {
  display: flex;
  gap: 1rem;
  margin-bottom: 0.5rem;
}

.shopping-list-merchants-list-container {
  flex-shrink: 0;
  height: 3.125rem;
  margin-top: auto;
  position: relative;
  width: 100%;
}

.shopping-list-merchants-list-left-scroll-indicator {
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

.shopping-list-merchants-list-right-scroll-indicator {
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
</style>