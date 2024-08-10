<template>
  <div class="shopping-list-merchants-list-container">
    <div
      class="shopping-list-merchants-list-left-scroll-indicator"
      :style="merchantsListElementHasLeftScroll ? 'display: initial' : 'display: none'"
    />
    <div
      v-if="merchants.length > 0"
      ref="merchantsListElement"
      class="shopping-list-merchants-list"
      @scroll="onMerchantsListScroll"
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
      :style="merchantsListElementHasRightScroll ? 'display: initial' : 'display: none'"
    />
  </div>
</template>










<script setup lang="ts">
import { onMounted, onUnmounted, ref, watch } from 'vue'
import { IShoppingListItem } from '../models/build/IShoppingListItem'
import { IShoppingListMerchant } from '../models/utils/IShoppingListMerchant'
import { BuildPropertiesService } from '../services/BuildPropertiesService'
import Services from '../services/repository/Services'
import MerchantIcon from './MerchantIconComponent.vue'

const buildPropertiesService = Services.get(BuildPropertiesService)

const props = defineProps<{ shoppingList: IShoppingListItem[] }>()

const merchants = ref<IShoppingListMerchant[]>([])
const merchantsListElement = ref<HTMLDivElement>()
const merchantsListElementHasLeftScroll = ref(false)
const merchantsListElementHasRightScroll = ref(false)

onMounted(() => {
  window.addEventListener('resize', () => {
    setMerchantsListElementHasScroll()
  })

  setRequiredMerchants()
})

onUnmounted(() => {
  window.removeEventListener('resize', () => {
    setMerchantsListElementHasScroll()
  })
})

watch(() => merchantsListElement.value?.scrollWidth, () => {
  setMerchantsListElementHasScroll()
})

watch(() => props.shoppingList, () => setRequiredMerchants())

/**
 * Sets the required merchants from the shopping list.
 */
function setRequiredMerchants() {
  merchants.value = buildPropertiesService.getShoppingListMerchants(props.shoppingList)
}

/**
 * React to the horizontal scroll in the merchants list.
 *
 * Updates the values indicating whether left or right scroll are possible.
 */
function onMerchantsListScroll() {
  setMerchantsListElementHasScroll()
}

/**
 * Checks whether the merchants list element has left and right scroll and sets a value indicating it.
 */
function setMerchantsListElementHasScroll() {
  if (merchantsListElement.value != null) {
    merchantsListElementHasLeftScroll.value = merchantsListElement.value.scrollLeft !== 0
    merchantsListElementHasRightScroll.value = merchantsListElement.value.scrollLeft + merchantsListElement.value.clientWidth < merchantsListElement.value.scrollWidth
  } else {
    merchantsListElementHasLeftScroll.value = false
    merchantsListElementHasRightScroll.value = false
  }
}
</script>










<style scoped>
.shopping-list-merchants-list {
  overflow-x: auto;
  padding-bottom: 0.5rem;
}

.shopping-list-merchants-list > div {
  display: flex;
  gap: 1rem;
  margin-bottom: 0.25rem;
}

.shopping-list-merchants-list-container {
  padding-top: 0.5rem;
  position: relative;
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
  z-index: 1;
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
  z-index: 1;
}
</style>