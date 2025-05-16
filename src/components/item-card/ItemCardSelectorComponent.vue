<script setup lang="ts">
import { computed } from 'vue'
import { IItem, ItemCategoryId } from '../../models/item/IItem'
import ItemFilterAndSortingData from '../../models/utils/ItemFilterAndSortingData'
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
import ItemCard from './ItemCardComponent.vue'
import MagazineItemCard from './MagazineItemCardComponent.vue'
import MeleeWeaponItemCard from './MeleeWeaponItemCardComponent.vue'
import ModItemCard from './ModItemCardComponent.vue'
import RangedWeaponItemCard from './RangedWeaponItemCardComponent.vue'
import RangedWeaponModItemCard from './RangedWeaponModItemCardComponent.vue'
import VestItemCard from './VestItemCardComponent.vue'

type SpecializedComponent = typeof AmmunitionItemCard | typeof ArmorItemCard | typeof ArmorModItemCard | typeof BackpackItemCard | typeof ContainerItemCard | typeof EyewearItemCard | typeof GrenadeItemCard | typeof HeadwearItemCard | typeof ItemCard | typeof MagazineItemCard | typeof MeleeWeaponItemCard | typeof ModItemCard | typeof RangedWeaponItemCard | typeof RangedWeaponModItemCard | typeof VestItemCard | undefined

const props = withDefaults(
  defineProps<{
    comparisonItem?: IItem,
    filterAndSortingData?: ItemFilterAndSortingData,
    item: IItem,
    isSelectable?: boolean
  }>(),
  {
    comparisonItem: undefined,
    filterAndSortingData: undefined,
    isSelectable: false
  })

const specializedComponent = computed(() => getSpecializedComponent(props.item.categoryId))

/**
 * Sets the type of specialized options header component to display.
 */
function getSpecializedComponent(itemCategoryId: ItemCategoryId): SpecializedComponent {
  if (itemCategoryId === ItemCategoryId.other) {
    return undefined
  }

  const itemPropertiesService = Services.get(ItemPropertiesService)

  if (itemPropertiesService.isAmmunition(itemCategoryId)) {
    return AmmunitionItemCard
  }
  else if (itemPropertiesService.isArmor(itemCategoryId)) {
    return ArmorItemCard
  }
  else if (itemPropertiesService.isArmorMod(itemCategoryId)) {
    return ArmorModItemCard
  }
  else if (itemPropertiesService.isBackpack(itemCategoryId)) {
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
    return RangedWeaponItemCard
  }
  else if (itemPropertiesService.isRangedWeaponMod(itemCategoryId)) {
    return RangedWeaponModItemCard
  }
  else if (itemPropertiesService.isVest(itemCategoryId)) {
    return VestItemCard
  }
}
</script>










<template>
  <component
    :is="specializedComponent"
    v-if="specializedComponent != null"
    :comparison-item="comparisonItem"
    :filter-and-sorting-data="filterAndSortingData"
    :item="item"
  />
</template>