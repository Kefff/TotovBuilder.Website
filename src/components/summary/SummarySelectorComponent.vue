<script setup lang="ts">
import { computed } from 'vue'
import { IItem, ItemCategoryId } from '../../models/item/IItem'
import { ItemPropertiesService } from '../../services/ItemPropertiesService'
import Services from '../../services/repository/Services'
import AmmunitionSummary from './AmmunitionSummaryComponent.vue'
import ArmorModSummary from './ArmorModSummaryComponent.vue'
import ArmorSummary from './ArmorSummaryComponent.vue'
import BackpackSummary from './BackpackSummaryComponent.vue'
import ContainerSummary from './ContainerSummaryComponent.vue'
import EyewearSummary from './EyewearSummaryComponent.vue'
import GrenadeSummary from './GrenadeSummaryComponent.vue'
import HeadwearSummary from './HeadwearSummaryComponent.vue'
import ItemSummary from './ItemSummaryComponent.vue'
import MagazineSummary from './MagazineSummaryComponent.vue'
import MeleeWeaponSummary from './MeleeWeaponSummaryComponent.vue'
import ModSummary from './ModSummaryComponent.vue'
import RangedWeaponModSummary from './RangedWeaponModSummaryComponent.vue'
import RangedWeaponSummary from './RangedWeaponSummaryComponent.vue'
import VestSummary from './VestSummaryComponent.vue'

type SpecializedComponent = typeof AmmunitionSummary | typeof ArmorModSummary | typeof ArmorSummary | typeof BackpackSummary | typeof ContainerSummary | typeof EyewearSummary | typeof GrenadeSummary | typeof HeadwearSummary | typeof ItemSummary | typeof MagazineSummary | typeof MeleeWeaponSummary | typeof ModSummary | typeof RangedWeaponModSummary | typeof RangedWeaponSummary | typeof VestSummary | undefined

const props = withDefaults(
  defineProps<{
    item: IItem,
    showEmptyEntries?: boolean
  }>(),
  {
    showEmptyEntries: true
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
    return AmmunitionSummary
  }
  else if (itemPropertiesService.isArmor(itemCategoryId)) {
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
    return VestSummary
  }
}
</script>










<template>
  <ItemSummary
    v-if="item != null"
    :item="item"
  >
    <component
      :is="specializedComponent"
      v-if="specializedComponent != null"
      :item="item"
    />
  </ItemSummary>
</template>