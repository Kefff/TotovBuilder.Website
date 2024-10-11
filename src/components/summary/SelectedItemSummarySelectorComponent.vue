<script setup lang="ts">
import { computed, ref } from 'vue'
import { IInventoryItem } from '../../models/build/IInventoryItem'
import { IItem } from '../../models/item/IItem'
import { IArmorModifiers } from '../../models/utils/IArmorModifiers'
import { IRangedWeaponModifiers } from '../../models/utils/IRangedWeaponModifiers'
import { IWearableModifiers } from '../../models/utils/IWearableModifiers'
import { InventoryItemService } from '../../services/InventoryItemService'
import { ItemPropertiesService } from '../../services/ItemPropertiesService'
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
    includeModsAndContent?: boolean
    inventoryItem: IInventoryItem,
    inventoryItemInSameSlotInPreset?: IInventoryItem
    isBaseItem?: boolean,
    selectedItem: IItem,
    showPrice?: boolean,
    showWeight?: boolean
  }>(),
  {
    canBeLooted: true,
    includeModsAndContent: false,
    inventoryItemInSameSlotInPreset: undefined,
    isBaseItem: false,
    showPrice: true,
    showWeight: true
  })

const _inventoryItemService = Services.get(InventoryItemService)

const selectedItemArmorModifiers = ref<IArmorModifiers>()
const selectedItemRangedWeaponModifiers = ref<IRangedWeaponModifiers>()
const selectedItemWearableModifiers = ref<IWearableModifiers>()

const specializedComponent = computed(() => getSpecializedComponent(props.selectedItem.categoryId))

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
    setWearableModifiers()

    return ArmorSummary
  }
  else if (itemPropertiesService.isArmorMod(itemCategoryId)) {
    setArmorModifiers()
    setWearableModifiers()

    return ArmorModSummary
  }
  else if (itemPropertiesService.isBackpack(itemCategoryId)) {
    setWearableModifiers()

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
    setArmorModifiers()
    setWearableModifiers()

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
    setRangedWeaponModifiers()

    return RangedWeaponSummary
  }
  else if (itemPropertiesService.isRangedWeaponMod(itemCategoryId)) {
    return RangedWeaponModSummary
  }
  else if (itemPropertiesService.isVest(itemCategoryId)) {
    setArmorModifiers()
    setWearableModifiers()

    return VestSummary
  }
}

/**
 * Sets the modifiers for armors.
 * We display the base stats of presets because the full stats are displayed in the inventory slot.
 */
async function setArmorModifiers() {
  selectedItemArmorModifiers.value = await _inventoryItemService.getArmorModifiers(props.inventoryItem)
}

/**
 * Sets the modifiers for ranged weapons.
 * We display the base stats of presets because the full stats are displayed in the inventory slot.
 */
async function setRangedWeaponModifiers() {
  const ergonomics = await _inventoryItemService.getErgonomics(props.inventoryItem)
  const recoil = await _inventoryItemService.getRecoil(props.inventoryItem)

  selectedItemRangedWeaponModifiers.value = {
    ergonomics: ergonomics.ergonomicsWithMods,
    horizontalRecoil: recoil.horizontalRecoilWithMods,
    verticalRecoil: recoil.verticalRecoilWithMods
  }
}

/**
 * Sets the modifiers for wearable items.
 * We display the base stats of presets because the full stats are displayed in the inventory slot.
 */
async function setWearableModifiers() {
  const wearableModifiers = await _inventoryItemService.getWearableModifiers(props.inventoryItem)

  selectedItemWearableModifiers.value = {
    ergonomicsModifierPercentage: wearableModifiers.ergonomicsModifierPercentage,
    movementSpeedModifierPercentage: wearableModifiers.movementSpeedModifierPercentage,
    turningSpeedModifierPercentage: wearableModifiers.turningSpeedModifierPercentage
  }
}
</script>










<template>
  <SelectedItemSummary
    v-if="selectedItem != null"
    :can-be-looted="canBeLooted"
    :include-mods-and-content="includeModsAndContent"
    :inventory-item-in-same-slot-in-preset="inventoryItemInSameSlotInPreset"
    :inventory-item="inventoryItem"
    :is-base-item="isBaseItem"
    :show-price="showPrice"
    :show-weight="showWeight"
  >
    <AmmunitionSummary
      v-if="specializedComponent === AmmunitionSummary"
      :item="selectedItem"
      :show-empty-entries="false"
    />
    <ArmorModSummary
      v-if="specializedComponent === ArmorModSummary"
      :armor-modifiers-override="selectedItemArmorModifiers"
      :item="selectedItem"
      :show-empty-entries="false"
      :wearable-modifiers-override="selectedItemWearableModifiers"
    />
    <ArmorSummary
      v-if="specializedComponent === ArmorSummary"
      :armor-modifiers-override="selectedItemArmorModifiers"
      :include-mods-and-content="includeModsAndContent"
      :item="selectedItem"
      :show-empty-entries="false"
      :wearable-modifiers-override="selectedItemWearableModifiers"
    />
    <BackpackSummary
      v-if="specializedComponent === BackpackSummary"
      :item="selectedItem"
      :show-empty-entries="false"
      :wearable-modifiers-override="selectedItemWearableModifiers"
    />
    <ContainerSummary
      v-if="specializedComponent === ContainerSummary"
      :item="selectedItem"
      :show-empty-entries="false"
    />
    <EyewearSummary
      v-if="specializedComponent === EyewearSummary"
      :item="selectedItem"
      :show-empty-entries="false"
    />
    <GrenadeSummary
      v-if="specializedComponent === GrenadeSummary"
      :item="selectedItem"
      :show-empty-entries="false"
    />
    <HeadwearSummary
      v-if="specializedComponent === HeadwearSummary"
      :armor-modifiers-override="selectedItemArmorModifiers"
      :include-mods-and-content="includeModsAndContent"
      :is-base-item="isBaseItem"
      :item="selectedItem"
      :show-empty-entries="false"
      :wearable-modifiers-override="selectedItemWearableModifiers"
    />
    <MagazineSummary
      v-if="specializedComponent === MagazineSummary"
      :item="selectedItem"
      :show-empty-entries="false"
    />
    <MeleeWeaponSummary
      v-if="specializedComponent === MeleeWeaponSummary"
      :item="selectedItem"
      :show-empty-entries="false"
    />
    <ModSummary
      v-if="specializedComponent === ModSummary"
      :item="selectedItem"
      :show-empty-entries="false"
    />
    <RangedWeaponModSummary
      v-if="specializedComponent === RangedWeaponModSummary"
      :item="selectedItem"
      :show-empty-entries="false"
    />
    <RangedWeaponSummary
      v-if="specializedComponent === RangedWeaponSummary"
      :include-mods-and-content="includeModsAndContent"
      :is-base-item="isBaseItem"
      :item="selectedItem"
      :ranged-weapons-modifiers-override="selectedItemRangedWeaponModifiers"
      :show-empty-entries="false"
    />
    <VestSummary
      v-if="specializedComponent === VestSummary"
      :armor-modifiers-override="selectedItemArmorModifiers"
      :include-mods-and-content="includeModsAndContent"
      :is-base-item="isBaseItem"
      :item="selectedItem"
      :show-empty-entries="false"
      :wearable-modifiers-override="selectedItemWearableModifiers"
    />
  </SelectedItemSummary>
</template>










<style>
.selected-item-summary .option-value {
  width: unset !important;
}

.selected-item-summary .option-value-long {
  width: unset !important;
}
</style>