<template>
  <div class="sidebar-title">
    <div class="sidebar-title-icon">
      <font-awesome-icon icon="clipboard-list" />
    </div>
    <span>{{ $t('caption.itemDetails') }}</span>
  </div>
  <div class="sidebar-option">
    <div class="stats-sidebar">
      <span class="stats-category">{{ parameters.name }}</span>
      <img
        v-if="parameters.imageLink != null"
        class="stats-sidebar-image"
        :src="parameters.imageLink"
      >
      <ItemStats :item="parameters">
        <component
          :is="specializedComponent"
          v-if="specializedComponent != null"
          :item="parameters"
        />
      </ItemStats>
    </div>
  </div>
</template>










<script setup lang="ts">
import { computed } from 'vue'
import { IItem } from '../../models/item/IItem'
import { ItemPropertiesService } from '../../services/ItemPropertiesService'
import Services from '../../services/repository/Services'
import AmmunitionStats from '../stats/AmmunitionStatsComponent.vue'
import ArmorModStats from '../stats/ArmorModStatsComponent.vue'
import ArmorStats from '../stats/ArmorStatsComponent.vue'
import BackpackStats from '../stats/BackpackStatsComponent.vue'
import ContainerStats from '../stats/ContainerStatsComponent.vue'
import EyewearStats from '../stats/EyewearStatsComponent.vue'
import GrenadeStats from '../stats/GrenadeStatsComponent.vue'
import HeadwearStats from '../stats/HeadwearStatsComponent.vue'
import ItemStats from '../stats/ItemStatsComponent.vue'
import MagazineStats from '../stats/MagazineStatsComponent.vue'
import MeleeWeaponStats from '../stats/MeleeWeaponStatsComponent.vue'
import ModStats from '../stats/ModStatsComponent.vue'
import RangedWeaponModStats from '../stats/RangedWeaponModStatsComponent.vue'
import RangedWeaponStats from '../stats/RangedWeaponStatsComponent.vue'
import VestStats from '../stats/VestStatsComponent.vue'

const props = defineProps<{ parameters: IItem }>()

const specializedComponent = computed(() => getSpecializedComponent(props.parameters.categoryId))

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
@import '../../css/sidebar.css';
@import '../../css/stats.css';

.stats-sidebar {
  display: flex;
  flex-direction: column;
}

.stats-sidebar-image {
  border-color: var(--util-color5);
  border-radius: 3px;
  border-style: solid;
  border-width: 1px;
  margin-top: 1rem;
  max-width: 36rem;
  width: 100%;
}
</style>