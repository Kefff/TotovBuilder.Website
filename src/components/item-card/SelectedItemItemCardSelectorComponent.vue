<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import { IInventoryItem } from '../../models/build/IInventoryItem'
import { IItem, ItemCategoryId } from '../../models/item/IItem'
import { IArmorModifiers } from '../../models/utils/IArmorModifiers'
import { IRangedWeaponModifiers } from '../../models/utils/IRangedWeaponModifiers'
import { IWearableModifiers } from '../../models/utils/IWearableModifiers'
import { InventoryItemService } from '../../services/InventoryItemService'
import { ItemPropertiesService } from '../../services/ItemPropertiesService'
import Services from '../../services/repository/Services'
import AmmunitionItemCard from './AmmunitionItemCardComponent.vue'
import ArmorItemCard from './ArmorItemCardComponent.vue'
import ArmorModItemCard from './ArmorModItemCardComponent.vue'
import BackpackItemCard from './BackpackItemCardComponent.vue'
import ContainerItemCard from './ContainerItemCardComponent.vue'
import EyewearItemCard from './EyewearItemCardComponent.vue'
import GrenadeItemCard from './GrenadeItemCardComponent.vue'
import HeadwearItemCard from './HeadwearItemCardComponent.vue'
import MagazineItemCard from './MagazineItemCardComponent.vue'
import MeleeWeaponItemCard from './MeleeWeaponItemCardComponent.vue'
import ModItemCard from './ModItemCardComponent.vue'
import RangedWeaponItemCard from './RangedWeaponItemCardComponent.vue'
import RangedWeaponModItemCard from './RangedWeaponModItemCardComponent.vue'
import SelectedItemItemCard from './SelectedItemItemCardComponent.vue'
import VestItemCard from './VestItemCardComponent.vue'

const modelIgnorePrice = defineModel<boolean>('ignorePrice')

const props = defineProps<{
  canBeLooted: boolean,
  canIgnorePrice: boolean,
  includeModsAndContent: boolean
  inventoryItem: IInventoryItem,
  inventoryItemInSameSlotInPreset: IInventoryItem | undefined
  isBaseItem: boolean,
  selectedItem: IItem,
  showPrice: boolean,
  showWeight: boolean
}>()

const _inventoryItemService = Services.get(InventoryItemService)

const selectedItemArmorModifiers = ref<IArmorModifiers>()
const selectedItemRangedWeaponModifiers = ref<IRangedWeaponModifiers>()
const selectedItemWearableModifiers = ref<IWearableModifiers>()

const specializedComponent = ref<string>()

onMounted(() => setSpecializedComponent(props.selectedItem.categoryId))

watch(() => props.inventoryItem.itemId, () => setSpecializedComponent(props.selectedItem.categoryId))

/**
 * Sets the type of specialized options header component to display.
 */
function setSpecializedComponent(itemCategoryId?: ItemCategoryId): void {
  if (itemCategoryId == null || itemCategoryId === ItemCategoryId.other) {
    specializedComponent.value = undefined
    return
  }

  const itemPropertiesService = Services.get(ItemPropertiesService)

  if (itemPropertiesService.isAmmunition(itemCategoryId)) {
    specializedComponent.value = 'AmmunitionItemCard'
  }
  else if (itemPropertiesService.isArmor(itemCategoryId)) {
    setArmorModifiersAsync()
    setWearableModifiersAsync()

    specializedComponent.value = 'ArmorItemCard'
  }
  else if (itemPropertiesService.isArmorMod(itemCategoryId)) {
    setArmorModifiersAsync()
    setWearableModifiersAsync()

    specializedComponent.value = 'ArmorModItemCard'
  }
  else if (itemPropertiesService.isBackpack(itemCategoryId)) {
    setWearableModifiersAsync()

    specializedComponent.value = 'BackpackItemCard'
  }
  else if (itemPropertiesService.isContainer(itemCategoryId)) {
    specializedComponent.value = 'ContainerItemCard'
  }
  else if (itemPropertiesService.isEyewear(itemCategoryId)) {
    specializedComponent.value = 'EyewearItemCard'
  }
  else if (itemPropertiesService.isGrenade(itemCategoryId)) {
    specializedComponent.value = 'GrenadeItemCard'
  }
  else if (itemPropertiesService.isHeadwear(itemCategoryId)) {
    setArmorModifiersAsync()
    setWearableModifiersAsync()

    specializedComponent.value = 'HeadwearItemCard'
  }
  else if (itemPropertiesService.isMagazine(itemCategoryId)) {
    specializedComponent.value = 'MagazineItemCard'
  }
  else if (itemPropertiesService.isMeleeWeapon(itemCategoryId)) {
    specializedComponent.value = 'MeleeWeaponItemCard'
  }
  else if (itemPropertiesService.isMod(itemCategoryId)) {
    specializedComponent.value = 'ModItemCard'
  }
  else if (itemPropertiesService.isRangedWeapon(itemCategoryId)) {
    setRangedWeaponModifiersAsync()

    specializedComponent.value = 'RangedWeaponItemCard'
  }
  else if (itemPropertiesService.isRangedWeaponMod(itemCategoryId)) {
    specializedComponent.value = 'RangedWeaponModItemCard'
  }
  else if (itemPropertiesService.isVest(itemCategoryId)) {
    setArmorModifiersAsync()
    setWearableModifiersAsync()

    specializedComponent.value = 'VestItemCard'
  }
}

/**
 * Sets the modifiers for armors.
 * We display the base stats of presets because the full stats are displayed in the inventory slot.
 */
async function setArmorModifiersAsync(): Promise<void> {
  selectedItemArmorModifiers.value = await _inventoryItemService.getArmorModifiersAsync(props.inventoryItem)
}

/**
 * Sets the modifiers for ranged weapons.
 * We display the base stats of presets because the full stats are displayed in the inventory slot.
 */
async function setRangedWeaponModifiersAsync(): Promise<void> {
  const ergonomics = await _inventoryItemService.getErgonomicsAsync(props.inventoryItem)
  const recoil = await _inventoryItemService.getRecoilAsync(props.inventoryItem)

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
async function setWearableModifiersAsync(): Promise<void> {
  const wearableModifiers = await _inventoryItemService.getWearableModifiersAsync(props.inventoryItem)

  selectedItemWearableModifiers.value = {
    ergonomicsModifierPercentage: wearableModifiers.ergonomicsModifierPercentage,
    movementSpeedModifierPercentage: wearableModifiers.movementSpeedModifierPercentage,
    turningSpeedModifierPercentage: wearableModifiers.turningSpeedModifierPercentage
  }
}
</script>










<template>
  <SelectedItemItemCard
    v-if="selectedItem != null"
    v-model:ignore-price="modelIgnorePrice"
    :can-be-looted="canBeLooted"
    :can-ignore-price="canIgnorePrice"
    :include-mods-and-content="includeModsAndContent"
    :inventory-item-in-same-slot-in-preset="inventoryItemInSameSlotInPreset"
    :inventory-item="inventoryItem"
    :is-base-item="isBaseItem"
    :show-price="showPrice"
    :show-weight="showWeight"
  >
    <AmmunitionItemCard
      v-if="specializedComponent === 'AmmunitionItemCard'"
      :item="selectedItem"
    />
    <ArmorModItemCard
      v-else-if="specializedComponent === 'ArmorModItemCard'"
      :armor-modifiers-override="selectedItemArmorModifiers"
      :item="selectedItem"
      :wearable-modifiers-override="selectedItemWearableModifiers"
    />
    <ArmorItemCard
      v-else-if="specializedComponent === 'ArmorItemCard'"
      :armor-modifiers-override="selectedItemArmorModifiers"
      :include-mods-and-content="includeModsAndContent"
      :item="selectedItem"
      :wearable-modifiers-override="selectedItemWearableModifiers"
    />
    <BackpackItemCard
      v-else-if="specializedComponent === 'BackpackItemCard'"
      :item="selectedItem"
      :wearable-modifiers-override="selectedItemWearableModifiers"
    />
    <ContainerItemCard
      v-else-if="specializedComponent === 'ContainerItemCard'"
      :item="selectedItem"
    />
    <EyewearItemCard
      v-else-if="specializedComponent === 'EyewearItemCard'"
      :item="selectedItem"
    />
    <GrenadeItemCard
      v-else-if="specializedComponent === 'GrenadeItemCard'"
      :item="selectedItem"
    />
    <HeadwearItemCard
      v-else-if="specializedComponent === 'HeadwearItemCard'"
      :armor-modifiers-override="selectedItemArmorModifiers"
      :include-mods-and-content="includeModsAndContent"
      :is-base-item="isBaseItem"
      :item="selectedItem"
      :wearable-modifiers-override="selectedItemWearableModifiers"
    />
    <MagazineItemCard
      v-else-if="specializedComponent === 'MagazineItemCard'"
      :item="selectedItem"
    />
    <MeleeWeaponItemCard
      v-else-if="specializedComponent === 'MeleeWeaponItemCard'"
      :item="selectedItem"
    />
    <ModItemCard
      v-else-if="specializedComponent === 'ModItemCard'"
      :item="selectedItem"
    />
    <RangedWeaponModItemCard
      v-else-if="specializedComponent === 'RangedWeaponModItemCard'"
      :item="selectedItem"
    />
    <RangedWeaponItemCard
      v-else-if="specializedComponent === 'RangedWeaponItemCard'"
      :include-mods-and-content="includeModsAndContent"
      :is-base-item="isBaseItem"
      :item="selectedItem"
      :ranged-weapons-modifiers-override="selectedItemRangedWeaponModifiers"
    />
    <VestItemCard
      v-else-if="specializedComponent === 'VestItemCard'"
      :armor-modifiers-override="selectedItemArmorModifiers"
      :include-mods-and-content="includeModsAndContent"
      :is-base-item="isBaseItem"
      :item="selectedItem"
      :wearable-modifiers-override="selectedItemWearableModifiers"
    />
  </SelectedItemItemCard>
</template>