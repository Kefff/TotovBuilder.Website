<script setup lang="ts">
import { computed, ref } from 'vue'
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

type SpecializedComponent = typeof AmmunitionItemCard | typeof ArmorItemCard | typeof ArmorModItemCard | typeof BackpackItemCard | typeof ContainerItemCard | typeof EyewearItemCard | typeof GrenadeItemCard | typeof HeadwearItemCard | typeof MagazineItemCard | typeof MeleeWeaponItemCard | typeof ModItemCard | typeof RangedWeaponItemCard | typeof RangedWeaponModItemCard | typeof SelectedItemItemCard | typeof VestItemCard | undefined

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

const specializedComponent = computed(() => getSpecializedComponent(props.selectedItem.categoryId))

/**
 * Sets the type of specialized options header component to display.
 */
function getSpecializedComponent(itemCategoryId?: ItemCategoryId): SpecializedComponent {
  if (itemCategoryId == null || itemCategoryId === ItemCategoryId.other) {
    return undefined
  }

  const itemPropertiesService = Services.get(ItemPropertiesService)

  if (itemPropertiesService.isAmmunition(itemCategoryId)) {
    return AmmunitionItemCard
  }
  else if (itemPropertiesService.isArmor(itemCategoryId)) {
    setArmorModifiersAsync()
    setWearableModifiersAsync()

    return ArmorItemCard
  }
  else if (itemPropertiesService.isArmorMod(itemCategoryId)) {
    setArmorModifiersAsync()
    setWearableModifiersAsync()

    return ArmorModItemCard
  }
  else if (itemPropertiesService.isBackpack(itemCategoryId)) {
    setWearableModifiersAsync()

    return BackpackItemCard
  }
  else if (itemPropertiesService.isContainer(itemCategoryId)) {
    return ContainerItemCard
  }
  else if (itemPropertiesService.isEyewear(itemCategoryId)) {
    return EyewearItemCard
  }
  else if (itemPropertiesService.isGrenade(itemCategoryId)) {
    return GrenadeItemCard
  }
  else if (itemPropertiesService.isHeadwear(itemCategoryId)) {
    setArmorModifiersAsync()
    setWearableModifiersAsync()

    return HeadwearItemCard
  }
  else if (itemPropertiesService.isMagazine(itemCategoryId)) {
    return MagazineItemCard
  }
  else if (itemPropertiesService.isMeleeWeapon(itemCategoryId)) {
    return MeleeWeaponItemCard
  }
  else if (itemPropertiesService.isMod(itemCategoryId)) {
    return ModItemCard
  }
  else if (itemPropertiesService.isRangedWeapon(itemCategoryId)) {
    setRangedWeaponModifiersAsync()

    return RangedWeaponItemCard
  }
  else if (itemPropertiesService.isRangedWeaponMod(itemCategoryId)) {
    return RangedWeaponModItemCard
  }
  else if (itemPropertiesService.isVest(itemCategoryId)) {
    setArmorModifiersAsync()
    setWearableModifiersAsync()

    return VestItemCard
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
      v-if="specializedComponent === AmmunitionItemCard"
      :display-empty-lines="false"
      :item="selectedItem"
    />
    <ArmorModItemCard
      v-if="specializedComponent === ArmorModItemCard"
      :armor-modifiers-override="selectedItemArmorModifiers"
      :display-empty-lines="false"
      :item="selectedItem"
      :wearable-modifiers-override="selectedItemWearableModifiers"
    />
    <ArmorItemCard
      v-if="specializedComponent === ArmorItemCard"
      :armor-modifiers-override="selectedItemArmorModifiers"
      :display-empty-lines="false"
      :include-mods-and-content="includeModsAndContent"
      :item="selectedItem"
      :wearable-modifiers-override="selectedItemWearableModifiers"
    />
    <BackpackItemCard
      v-if="specializedComponent === BackpackItemCard"
      :display-empty-lines="false"
      :item="selectedItem"
      :wearable-modifiers-override="selectedItemWearableModifiers"
    />
    <ContainerItemCard
      v-if="specializedComponent === ContainerItemCard"
      :display-empty-lines="false"
      :item="selectedItem"
    />
    <EyewearItemCard
      v-if="specializedComponent === EyewearItemCard"
      :display-empty-lines="false"
      :item="selectedItem"
    />
    <GrenadeItemCard
      v-if="specializedComponent === GrenadeItemCard"
      :item="selectedItem"
    />
    <HeadwearItemCard
      v-if="specializedComponent === HeadwearItemCard"
      :armor-modifiers-override="selectedItemArmorModifiers"
      :display-empty-lines="false"
      :include-mods-and-content="includeModsAndContent"
      :is-base-item="isBaseItem"
      :item="selectedItem"
      :wearable-modifiers-override="selectedItemWearableModifiers"
    />
    <MagazineItemCard
      v-if="specializedComponent === MagazineItemCard"
      :display-empty-lines="false"
      :item="selectedItem"
    />
    <MeleeWeaponItemCard
      v-if="specializedComponent === MeleeWeaponItemCard"
      :display-empty-lines="false"
      :item="selectedItem"
    />
    <ModItemCard
      v-if="specializedComponent === ModItemCard"
      :display-empty-lines="false"
      :item="selectedItem"
    />
    <RangedWeaponModItemCard
      v-if="specializedComponent === RangedWeaponModItemCard"
      :display-empty-lines="false"
      :item="selectedItem"
    />
    <RangedWeaponItemCard
      v-if="specializedComponent === RangedWeaponItemCard"
      :include-mods-and-content="includeModsAndContent"
      :is-base-item="isBaseItem"
      :item="selectedItem"
      :ranged-weapons-modifiers-override="selectedItemRangedWeaponModifiers"
    />
    <VestItemCard
      v-if="specializedComponent === VestItemCard"
      :armor-modifiers-override="selectedItemArmorModifiers"
      :display-empty-lines="false"
      :include-mods-and-content="includeModsAndContent"
      :is-base-item="isBaseItem"
      :item="selectedItem"
      :wearable-modifiers-override="selectedItemWearableModifiers"
    />
  </SelectedItemItemCard>
</template>