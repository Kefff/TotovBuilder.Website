<template>
  <Dialog
    v-if="item != null"
    v-model:visible="modelShowStats"
    :closable="true"
    :close-on-escape="true"
    :dismissable-mask="true"
    :draggable="false"
    :header="item.name"
    :modal="true"
  >
    <template #header>
      <div class="stats-selector-modal-title">
        <ItemIcon :item="item" />
        <span>{{ item.name }}</span>
      </div>
    </template>
    <ItemStats :item="item">
      <component
        :is="specializedComponent"
        v-if="specializedComponent != null"
        :item="item"
      />
    </ItemStats>
  </Dialog>
</template>










<script setup lang="ts">
import { computed } from 'vue'
import { IItem } from '../../models/item/IItem'
import { ItemPropertiesService } from '../../services/ItemPropertiesService'
import Services from '../../services/repository/Services'
import ItemIcon from '../ItemIconComponent.vue'
import AmmunitionStats from './AmmunitionStatsComponent.vue'
import ArmorModStats from './ArmorModStatsComponent.vue'
import ArmorStats from './ArmorStatsComponent.vue'
import BackpackStats from './BackpackStatsComponent.vue'
import ContainerStats from './ContainerStatsComponent.vue'
import EyewearStats from './EyewearStatsComponent.vue'
import GrenadeStats from './GrenadeStatsComponent.vue'
import HeadwearStats from './HeadwearStatsComponent.vue'
import ItemStats from './ItemStatsComponent.vue'
import MagazineStats from './MagazineStatsComponent.vue'
import MeleeWeaponStats from './MeleeWeaponStatsComponent.vue'
import ModStats from './ModStatsComponent.vue'
import RangedWeaponModStats from './RangedWeaponModStatsComponent.vue'
import RangedWeaponStats from './RangedWeaponStatsComponent.vue'
import VestStats from './VestStatsComponent.vue'

const modelShowStats = defineModel<boolean>('showStats', { required: true })

const props = defineProps<{
  item: IItem
}>()

const specializedComponent = computed(() => getSpecializedComponent(props.item.categoryId))

/**
 * Sets the type of specialized options header component to display.
 */
function getSpecializedComponent(itemCategoryId?: string) {
  if (itemCategoryId == null || itemCategoryId === 'other') {
    return undefined
  }

  const itemPropertiesService = Services.get(ItemPropertiesService)

  if (itemPropertiesService.isAmmunition(itemCategoryId)) {
    return AmmunitionStats
  }
  else if (itemPropertiesService.isArmor(itemCategoryId)) {
    return ArmorStats
  }
  else if (itemPropertiesService.isArmorMod(itemCategoryId)) {
    return ArmorModStats
  }
  else if (itemPropertiesService.isBackpack(itemCategoryId)) {
    return BackpackStats
  }
  else if (itemPropertiesService.isContainer(itemCategoryId)) {
    return ContainerStats
  }
  else if (itemPropertiesService.isEyewear(itemCategoryId)) {
    return EyewearStats
  }
  else if (itemPropertiesService.isGrenade(itemCategoryId)) {
    return GrenadeStats
  }
  else if (itemPropertiesService.isHeadwear(itemCategoryId)) {
    return HeadwearStats
  }
  else if (itemPropertiesService.isMagazine(itemCategoryId)) {
    return MagazineStats
  }
  else if (itemPropertiesService.isMeleeWeapon(itemCategoryId)) {
    return MeleeWeaponStats
  }
  else if (itemPropertiesService.isMod(itemCategoryId)) {
    return ModStats
  }
  else if (itemPropertiesService.isRangedWeapon(itemCategoryId)) {
    return RangedWeaponStats
  }
  else if (itemPropertiesService.isRangedWeaponMod(itemCategoryId)) {
    return RangedWeaponModStats
  }
  else if (itemPropertiesService.isVest(itemCategoryId)) {
    return VestStats
  }
}
</script>










<style scoped>
.stats-selector-modal-title {
  align-items: center;
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
}

.stats-selector-modal-title > div {
  margin-right: 1rem;
}

.stats-selector-modal-title > span {
  font-weight: bold;
}
</style>