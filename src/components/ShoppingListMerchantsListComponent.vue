<template>
  <div class="shopping-list-merchants-list-container">
    <div
      class="shopping-list-merchants-list-left-indicator"
      :style="listElementHasLeftScroll ? 'display: initial' : 'display: none'"
    />
    <div
      v-if="merchants.length > 0"
      ref="listElement"
      class="shopping-list-merchants-list"
      @scroll="onMerchantListScroll"
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
      class="shopping-list-merchants-list-right-indicator"
      :style="listElementHasRightScroll ? 'display: initial' : 'display: none'"
    />
  </div>
</template>










<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import { IShoppingListItem } from '../models/build/IShoppingListItem'
import { IShoppingListMerchant } from '../models/utils/IShoppingListMerchant'
import { BuildPropertiesService } from '../services/BuildPropertiesService'
import Services from '../services/repository/Services'
import MerchantIcon from './MerchantIconComponent.vue'

const buildPropertiesService = Services.get(BuildPropertiesService)

const props = defineProps<{ shoppingList: IShoppingListItem[] }>()

const merchants = ref<IShoppingListMerchant[]>([])
const listElement = ref<HTMLDivElement>()
const listElementHasLeftScroll = ref(false)
const listElementHasRightScroll = ref(false)

onMounted(() => setRequiredMerchants())

watch(() => listElement.value, () => {
  setListElementHasScroll()
})

watch(() => props.shoppingList, () => setRequiredMerchants())

/**
 * Sets the required merchants from the shopping list.
 */
function setRequiredMerchants() {
  merchants.value = buildPropertiesService.getShoppingListMerchants(props.shoppingList)
}

function onMerchantListScroll() {
  setListElementHasScroll()
}

/**
 * Checks whether the list element has left and right scroll and sets a value indicating it.
 */
function setListElementHasScroll() {
  if (listElement.value != null) {
    listElementHasLeftScroll.value = listElement.value.scrollLeft !== 0
    listElementHasRightScroll.value = listElement.value.scrollLeft + listElement.value.clientWidth < listElement.value.scrollWidth
  } else {
    listElementHasLeftScroll.value = false
    listElementHasRightScroll.value = false
  }
}
</script>










<style scoped>
.shopping-list-merchants-list-container {
  max-width: calc(100vw - 1rem - 1rem);
  padding-top: 0.5rem;
  position: relative;
}

.shopping-list-merchants-list {
  overflow-x: auto;
  padding-bottom: 0.5rem;
}

.shopping-list-merchants-list > div {
  display: flex;
  gap: 1rem;
  margin-bottom: 0.25rem;
}

.shopping-list-merchants-list-left-indicator {
  border-bottom-left-radius: 3px;
  border-left-color: var(--primary-color);
  border-left-style: solid;
  border-left-width: 3px;
  border-top-left-radius: 3px;
  height: calc(100% - 0.15rem);
  left: 0;
  position: absolute;
  top: 0;
  z-index: 1;
}

.shopping-list-merchants-list-right-indicator {
  border-bottom-right-radius: 3px;
  border-right-color: var(--primary-color);
  border-right-style: solid;
  border-right-width: 3px;
  border-top-right-radius: 3px;
  height: calc(100% - 0.15rem);
  position: absolute;
  right: 0;
  top: 0;
  z-index: 1;
}
</style>