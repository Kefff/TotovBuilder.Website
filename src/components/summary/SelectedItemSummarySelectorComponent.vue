<template>
  <SelectedItemSummary
    v-if="selectedItem != null"
    :can-be-looted="canBeLooted"
    :inventory-item-in-same-slot-in-preset="inventoryItemInSameSlotInPreset"
    :inventory-item="inventoryItem"
  >
    <component
      :is="specializedComponent"
      v-if="specializedComponent != null && selectedItemArmorModifiers != null"
      :armor-modifiers-override="selectedItemArmorModifiers"
      :item="selectedItem"
      :show-empty-entries="false"
    />
    <component
      :is="specializedComponent"
      v-else-if="specializedComponent != null"
      :item="selectedItem"
      :show-empty-entries="false"
    />
  </SelectedItemSummary>
</template>










<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { IInventoryItem } from '../../models/build/IInventoryItem'
import { IItem } from '../../models/item/IItem'
import { IArmorModifiers } from '../../models/utils/IArmorModifiers'
import { InventoryItemService } from '../../services/InventoryItemService'
import { ItemPropertiesService } from '../../services/ItemPropertiesService'
import { ItemService } from '../../services/ItemService'
import Services from '../../services/repository/Services'
import AmmunitionSummary from '../summary/AmmunitionSummaryComponent.vue'
import ArmorModSummary from '../summary/ArmorModSummaryComponent.vue'
import ArmorSummary from '../summary/ArmorSummaryComponent.vue'
import BackpackSummary from '../summary/BackpackSummaryComponent.vue'
import ContainerSummary from '../summary/ContainerSummaryComponent.vue'
import EyewearSummary from '../summary/EyewearSummaryComponent.vue'
import GrenadeSummary from '../summary/GrenadeSummaryComponent.vue'
import HeadwearSummary from '../summary/HeadwearSummaryComponent.vue'
import MagazineSummary from '../summary/MagazineSummaryComponent.vue'
import MeleeWeaponSummary from '../summary/MeleeWeaponSummaryComponent.vue'
import ModSummary from '../summary/ModSummaryComponent.vue'
import RangedWeaponModSummary from '../summary/RangedWeaponModSummaryComponent.vue'
import RangedWeaponSummary from '../summary/RangedWeaponSummaryComponent.vue'
import SelectedItemSummary from '../summary/SelectedItemSummaryComponent.vue'
import VestSummary from '../summary/VestSummaryComponent.vue'

const props = withDefaults(
  defineProps<{
    canBeLooted?: boolean,
    inventoryItem: IInventoryItem,
    inventoryItemInSameSlotInPreset?: IInventoryItem
  }>(),
  {
    canBeLooted: true,
    inventoryItemInSameSlotInPreset: undefined
  })

const selectedItem = ref<IItem>()
const selectedItemArmorModifiers = ref<IArmorModifiers>()

onMounted(() => getSelectedItem())

watch(() => props.inventoryItem.itemId, () => getSelectedItem())

/**
 * Gets the item based on the inventory item passed to the component and determines which summary component to display.
 */
async function getSelectedItem() {
  selectedItem.value = await Services.get(ItemService).getItem(props.inventoryItem.itemId)
}

const specializedComponent = computed(() => getSpecializedComponent(selectedItem.value?.categoryId))

/**
 * Sets the type of specialized options header component to display.
 */
function getSpecializedComponent(itemCategoryId?: string) {
  if (itemCategoryId == null || itemCategoryId === 'other') {
    return undefined
  }

  const itemPropertiesService = Services.get(ItemPropertiesService)

  if (itemPropertiesService.isAmmunition(itemCategoryId)) {
    return AmmunitionSummary
  }
  else if (itemPropertiesService.isArmor(itemCategoryId)) {
    setArmorModifiers()
    return ArmorSummary
  }
  else if (itemPropertiesService.isArmorMod(itemCategoryId)) {
    return ArmorModSummary
  }
  else if (itemPropertiesService.isBackpack(itemCategoryId)) {
    return BackpackSummary
  }
  else if (itemPropertiesService.isContainer(itemCategoryId)) {
    return ContainerSummary
  }
  else if (itemPropertiesService.isEyewear(itemCategoryId)) {
    return EyewearSummary
  }
  else if (itemPropertiesService.isGrenade(itemCategoryId)) {
    return GrenadeSummary
  }
  else if (itemPropertiesService.isHeadwear(itemCategoryId)) {
    return HeadwearSummary
  }
  else if (itemPropertiesService.isMagazine(itemCategoryId)) {
    return MagazineSummary
  }
  else if (itemPropertiesService.isMeleeWeapon(itemCategoryId)) {
    return MeleeWeaponSummary
  }
  else if (itemPropertiesService.isMod(itemCategoryId)) {
    return ModSummary
  }
  else if (itemPropertiesService.isRangedWeapon(itemCategoryId)) {
    return RangedWeaponSummary
  }
  else if (itemPropertiesService.isRangedWeaponMod(itemCategoryId)) {
    return RangedWeaponModSummary
  }
  else if (itemPropertiesService.isVest(itemCategoryId)) {
    setArmorModifiers()
    return VestSummary
  }
}

/**
 * Sets the armor modifiers for items with armor.
 */
async function setArmorModifiers() {
  const frontPlateModSlot = props.inventoryItem.modSlots.find(ms => ms.modSlotName === 'front_plate')

  if (frontPlateModSlot != null) {
    // When the item has an armor plate slot, no armor modifier is displayed because
    // it is the armor plate that defines the armor value
    selectedItemArmorModifiers.value = {
      armorClass: 0,
      durability: 0
    }
  } else {
    selectedItemArmorModifiers.value = await Services.get(InventoryItemService).getArmorModifiers(props.inventoryItem)
  }
}
</script>










<style>
.selected-item-summary .option-value {
  width: unset !important;
}

.selected-item-summary .option-value-long {
  width: unset !important;
}
</style>