<script setup lang="ts">
import { computed } from 'vue'
import { IItem, ItemCategoryId } from '../../models/item/IItem'
import SortingData from '../../models/utils/SortingData'
import { ItemPropertiesService } from '../../services/ItemPropertiesService'
import Services from '../../services/repository/Services'
import AmmunitionOptionHeader from './AmmunitionOptionHeaderComponent.vue'
import ArmorModOptionHeader from './ArmorModOptionHeaderComponent.vue'
import ArmorOptionHeader from './ArmorOptionHeaderComponent.vue'
import BackpackOptionHeader from './BackpackOptionHeaderComponent.vue'
import ContainerOptionHeader from './ContainerOptionHeaderComponent.vue'
import EyewearOptionHeader from './EyewearOptionHeaderComponent.vue'
import GrenadeOptionHeader from './GrenadeOptionHeaderComponent.vue'
import HeadwearOptionHeader from './HeadwearOptionHeaderComponent.vue'
import ItemOptionHeader from './ItemOptionHeaderComponent.vue'
import MagazineOptionHeader from './MagazineOptionHeaderComponent.vue'
import MeleeWeaponOptionHeader from './MeleeWeaponOptionHeaderComponent.vue'
import ModOptionHeader from './ModOptionHeaderComponent.vue'
import RangedWeaponModOptionHeader from './RangedWeaponModOptionHeaderComponent.vue'
import RangedWeaponOptionHeader from './RangedWeaponOptionHeaderComponent.vue'
import VestOptionHeader from './VestOptionHeaderComponent.vue'

type SpecializedComponent = typeof AmmunitionOptionHeader | typeof ArmorModOptionHeader | typeof ArmorOptionHeader | typeof BackpackOptionHeader | typeof ContainerOptionHeader | typeof EyewearOptionHeader | typeof GrenadeOptionHeader | typeof HeadwearOptionHeader | typeof ItemOptionHeader | typeof MagazineOptionHeader | typeof MeleeWeaponOptionHeader | typeof ModOptionHeader | typeof RangedWeaponModOptionHeader | typeof RangedWeaponOptionHeader | typeof VestOptionHeader | undefined

const modelFilter = defineModel<string>('filter', { required: true })
const modelSortingData = defineModel<SortingData<IItem>>('sortingData', { required: true })

const props = withDefaults(
  defineProps<{
    categoryId?: ItemCategoryId
  }>(),
  {
    categoryId: undefined
  })

const specializedComponent = computed(() => getSpecializedComponent(props.categoryId))
const useLongestHeaderWidth = computed(() => props.categoryId == null)

/**
 * Sets the type of specialized options header component to display.
 */
function getSpecializedComponent(categoryId?: ItemCategoryId): SpecializedComponent {
  if (categoryId == null || categoryId === ItemCategoryId.other) {
    return undefined
  }

  const itemPropertiesService = Services.get(ItemPropertiesService)

  if (itemPropertiesService.isAmmunition(categoryId)) {
    return AmmunitionOptionHeader
  }
  else if (itemPropertiesService.isArmor(categoryId)) {
    return ArmorOptionHeader
  }
  else if (itemPropertiesService.isArmorMod(categoryId)) {
    return ArmorModOptionHeader
  }
  else if (itemPropertiesService.isBackpack(categoryId)) {
    return BackpackOptionHeader
  }
  else if (itemPropertiesService.isContainer(categoryId)) {
    return ContainerOptionHeader
  }
  else if (itemPropertiesService.isEyewear(categoryId)) {
    return EyewearOptionHeader
  }
  else if (itemPropertiesService.isGrenade(categoryId)) {
    return GrenadeOptionHeader
  }
  else if (itemPropertiesService.isHeadwear(categoryId)) {
    return HeadwearOptionHeader
  }
  else if (itemPropertiesService.isMagazine(categoryId)) {
    return MagazineOptionHeader
  }
  else if (itemPropertiesService.isMeleeWeapon(categoryId)) {
    return MeleeWeaponOptionHeader
  }
  else if (itemPropertiesService.isMod(categoryId)) {
    return ModOptionHeader
  }
  else if (itemPropertiesService.isRangedWeapon(categoryId)) {
    return RangedWeaponOptionHeader
  }
  else if (itemPropertiesService.isRangedWeaponMod(categoryId)) {
    return RangedWeaponModOptionHeader
  }
  else if (itemPropertiesService.isVest(categoryId)) {
    return VestOptionHeader
  }
}
</script>










<template>
  <ItemOptionHeader
    v-model:sorting-data="modelSortingData"
    v-model:filter="modelFilter"
    :use-longest-header-width="useLongestHeaderWidth"
  >
    <component
      :is="specializedComponent"
      v-if="specializedComponent != null"
      v-model:sorting-data="modelSortingData"
    />
  </ItemOptionHeader>
</template>