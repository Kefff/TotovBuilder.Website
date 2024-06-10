<template>
  <div class="item-content-indent">
    <Item
      v-for="(containedItem, index) of modelInventoryItems"
      :key="`${path}/${index}_${modelInventoryItems.length}`"
      v-model:inventory-item="modelInventoryItems[index]"
      :accepted-items="acceptedItems"
      :accepted-items-category-id="categoryId"
      :force-quantity-to-max-selectable-amount="isMagazine"
      :max-stackable-amount="maximumQuantity"
      :path="`${path}/${contentPathPrefix}${index}_${modelInventoryItems.length}/${itemPathPrefix}${containedItem.itemId}`"
      @update:inventory-item="onItemChanged(index, $event)"
    />
    <Item
      v-show="editing && canAddItem"
      v-model:inventory-item="itemToAdd"
      :accepted-items="acceptedItems"
      :accepted-items-category-id="categoryId"
      :max-stackable-amount="maximumQuantity"
      :path="`${path}/new`"
      @update:inventory-item="onItemAdded($event)"
    />
  </div>
</template>










<script setup lang="ts">
import { Ref, computed, inject, nextTick, onMounted, onUnmounted, ref, watch } from 'vue'
import { IInventoryItem } from '../models/build/IInventoryItem'
import { IContainer } from '../models/item/IContainer'
import { IItem } from '../models/item/IItem'
import { GlobalFilterService } from '../services/GlobalFilterService'
import { ItemPropertiesService } from '../services/ItemPropertiesService'
import { ItemContentComponentService } from '../services/components/ItemContentComponentService'
import Services from '../services/repository/Services'
import { PathUtils } from '../utils/PathUtils'
import Item from './item/ItemComponent.vue'

const itemPropertiesService = Services.get(ItemPropertiesService)
const globalFilterService = Services.get(GlobalFilterService)

const modelInventoryItems = defineModel<IInventoryItem[]>('inventoryItems', { required: true })

const props = defineProps<{
  containerItem: IContainer,
  path: string
}>()

const editing = inject<Ref<boolean>>('editing')

const canAddItem = computed(() => !isMagazine.value || modelInventoryItems.value.length === 0)
const isMagazine = computed(() => itemPropertiesService.isMagazine(props.containerItem))
const maximumQuantity = computed(() => isMagazine.value ? props.containerItem.capacity : undefined)

const acceptedItems = ref<IItem[]>([])
const categoryId = ref<string | undefined>(undefined)
const itemPathPrefix = PathUtils.itemPrefix
const itemToAdd = ref<IInventoryItem>()

const contentPathPrefix = PathUtils.contentPrefix

watch(() => props.containerItem.id, () => initialize())

onMounted(() => {
  globalFilterService.emitter.on(GlobalFilterService.changeEvent, onMerchantFilterChanged)

  initialize()
})

onUnmounted(() => {
  globalFilterService.emitter.off(GlobalFilterService.changeEvent, onMerchantFilterChanged)
})

/**
 * Gets the accepted items for the item to add.
 */
async function getAcceptedItems() {
  acceptedItems.value = await Services.get(ItemContentComponentService).getAcceptedItems(props.containerItem.id)
}

/**
 * Gets the category IDs used for determining the available sort buttons in the item selection dropdown.
 */
function getCategoryIds() {
  categoryId.value = Services.get(ItemContentComponentService).getAcceptedItemsCategoryId(props.containerItem.categoryId)
}

/**
 * Initializes the component.
 */
async function initialize() {
  await getAcceptedItems()
  getCategoryIds()
}

/**
 * Adds an item to the content of the inventory item and emits the change to the parent component.
 */
function onItemAdded(newInventoryItem: IInventoryItem) {
  modelInventoryItems.value = [
    ...modelInventoryItems.value,
    newInventoryItem
  ]

  nextTick(() => {
    // nextTick required for the reset of itemToAdd to take effect in the Item component
    itemToAdd.value = undefined
  })
}

/**
 * Emits to the parent component the updated inventory item.
 * @param index - Index of the changed contained item in the inventory item content list.
 * @param newInventoryItem - Updated contained item.
 */
function onItemChanged(index: number, newInventoryItem: IInventoryItem | undefined) {
  const newInventoryItems = [...modelInventoryItems.value]

  if (newInventoryItem == null) {
    newInventoryItems.splice(index, 1)
  } else {
    newInventoryItems[index]
  }

  modelInventoryItems.value = newInventoryItems
}

/**
 * Updates the accepted items to reflect the change in merchant filters.
 */
function onMerchantFilterChanged() {
  getAcceptedItems()
}
</script>










<style scoped>
.item-content-indent {
  margin-left: 3.125rem;
  margin-top: 0.5rem;
}
</style>