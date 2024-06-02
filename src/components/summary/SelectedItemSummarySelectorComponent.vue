<template>
  <SelectedItemSummary
    v-if="selectedItem != null"
    :can-be-looted="canBeLooted"
    :inventory-item-in-same-slot-in-preset="inventoryItemInSameSlotInPreset"
    :inventory-item="inventoryItem"
  >
    <AmmunitionSummary
      v-if="isAmmunition"
      :item="selectedItem"
      :show-empty-entries="false"
    />
    <ArmorSummary
      v-else-if="isArmor"
      :armor-modifiers-override="selectedItemArmorModifiers"
      :item="selectedItem"
      :show-empty-entries="false"
    />
    <ArmorModSummary
      v-else-if="isArmorMod"
      :item="selectedItem"
      :show-empty-entries="false"
    />
    <BackpackSummary
      v-else-if="isBackpack"
      :item="selectedItem"
    />
    <ContainerSummary
      v-else-if="isContainer"
      :item="selectedItem"
    />
    <EyewearSummary
      v-else-if="isEyewear"
      :item="selectedItem"
      :show-empty-entries="false"
    />
    <GrenadeSummary
      v-else-if="isGrenade"
      :item="selectedItem"
      :show-empty-entries="false"
    />
    <HeadwearSummary
      v-else-if="isHeadwear"
      :item="selectedItem"
      :show-empty-entries="false"
    />
    <MagazineSummary
      v-else-if="isMagazine"
      :item="selectedItem"
      :show-empty-entries="false"
    />
    <MeleeWeaponSummary
      v-else-if="isMeleeWeapon"
      :item="selectedItem"
    />
    <ModSummary
      v-else-if="isMod"
      :item="selectedItem"
      :show-empty-entries="false"
    />
    <RangedWeaponSummary
      v-else-if="isRangedWeapon"
      :item="selectedItem"
    />
    <RangedWeaponModSummary
      v-else-if="isRangedWeaponMod"
      :item="selectedItem"
      :show-empty-entries="false"
    />
    <VestSummary
      v-else-if="isVest"
      :armor-modifiers-override="selectedItemArmorModifiers"
      :item="selectedItem"
      :show-empty-entries="false"
    />
  </SelectedItemSummary>
</template>










<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
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

const isAmmunition = ref(false)
const isArmor = ref(false)
const isArmorMod = ref(false)
const isBackpack = ref(false)
const isContainer = ref(false)
const isEyewear = ref(false)
const isGrenade = ref(false)
const isHeadwear = ref(false)
const isMagazine = ref(false)
const isMeleeWeapon = ref(false)
const isMod = ref(false)
const isRangedWeapon = ref(false)
const isRangedWeaponMod = ref(false)
const isVest = ref(false)
const selectedItem = ref<IItem>()
const selectedItemArmorModifiers = ref<IArmorModifiers>()

onMounted(() => initialize())

watch(() => props.inventoryItem.itemId, () => initialize())

/**
 * Sets the item based on the inventory item passed to the component and determines which summary component to display.
 */
async function initialize() {
  selectedItem.value = await Services.get(ItemService).getItem(props.inventoryItem.itemId)
  setItemType(selectedItem.value)
}

/**
 * Sets the type of specialized summary component to display.
 * @param item - Item.
 */
function setItemType(item: IItem) {
  isAmmunition.value = false
  isArmor.value = false
  isArmorMod.value = false
  isBackpack.value = false
  isContainer.value = false
  isEyewear.value = false
  isGrenade.value = false
  isHeadwear.value = false
  isMagazine.value = false
  isMeleeWeapon.value = false
  isMod.value = false
  isRangedWeapon.value = false
  isRangedWeaponMod.value = false
  isVest.value = false

  if (item.categoryId === 'other') {
    return
  }

  const itemPropertiesService = Services.get(ItemPropertiesService)

  if (itemPropertiesService.isAmmunition(item)) {
    isAmmunition.value = true
  }
  else if (itemPropertiesService.isArmor(item)) {
    isArmor.value = true
    setArmorModifiers()
  }
  else if (itemPropertiesService.isArmorMod(item)) {
    isArmorMod.value = true
  }
  else if (itemPropertiesService.isBackpack(item)) {
    isBackpack.value = true
  }
  else if (itemPropertiesService.isContainer(item)) {
    isContainer.value = true
  }
  else if (itemPropertiesService.isEyewear(item)) {
    isEyewear.value = true
  }
  else if (itemPropertiesService.isGrenade(item)) {
    isGrenade.value = true
  }
  else if (itemPropertiesService.isHeadwear(item)) {
    isHeadwear.value = true
  }
  else if (itemPropertiesService.isMagazine(item)) {
    isMagazine.value = true
  }
  else if (itemPropertiesService.isMeleeWeapon(item)) {
    isMeleeWeapon.value = true
  }
  else if (itemPropertiesService.isMod(item)) {
    isMod.value = true
  }
  else if (itemPropertiesService.isRangedWeapon(item)) {
    isRangedWeapon.value = true
  }
  else if (itemPropertiesService.isRangedWeaponMod(item)) {
    isRangedWeaponMod.value = true
  }
  else if (itemPropertiesService.isVest(item)) {
    isVest.value = true
    setArmorModifiers()
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