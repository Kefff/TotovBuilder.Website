<script setup lang="ts">
import { computed } from 'vue'
import { ItemCategoryId } from '../../models/item/IItem'
import { StatsSidebarParameters } from '../../models/utils/IGlobalSidebarOptions'
import { ItemPropertiesService } from '../../services/ItemPropertiesService'
import Services from '../../services/repository/Services'
import WebBrowserUtils from '../../utils/WebBrowserUtils'
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
import Tooltip from '../TooltipComponent.vue'

type SpecializedComponent = typeof AmmunitionStats | typeof ArmorModStats | typeof ArmorStats | typeof BackpackStats | typeof ContainerStats | typeof EyewearStats | typeof GrenadeStats | typeof HeadwearStats | typeof ItemStats | typeof MagazineStats | typeof MeleeWeaponStats | typeof ModStats | typeof RangedWeaponModStats | typeof RangedWeaponStats | typeof VestStats | undefined

const props = defineProps<{ parameters: StatsSidebarParameters }>()

const specializedComponent = computed(() => getSpecializedComponent(props.parameters.categoryId))

/**
 * Copies the name of the item to clipboard.
 */
function copyName(): void {
  WebBrowserUtils.copyToClipboardAsync(props.parameters.name)
}

/**
 * Sets the type of specialized options header component to display.
 */
function getSpecializedComponent(itemCategoryId?: ItemCategoryId): SpecializedComponent {
  if (itemCategoryId == null || itemCategoryId === ItemCategoryId.other) {
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










<template>
  <div class="stats-sidebar">
    <div>
      <div class="stats-sidebar-image">
        <img
          v-if="parameters.imageLink != null"
          :src="parameters.imageLink"
        >
      </div>
      <div class="stats-sidebar-name">
        <div
          v-if="specializedComponent != null"
          style="font-size: 1.25rem;"
        >
          {{ parameters.name }}
        </div>
        <Tooltip
          :apply-hover-style="false"
          :disabled-on-mobile="true"
          :tooltip="$t('caption.copyElement')"
        >
          <Button
            class="p-button-sm"
            outlined
            @click="copyName()"
          >
            <font-awesome-icon icon="copy" />
          </Button>
        </Tooltip>
      </div>
      <!-- Specialized stats -->
      <component
        :is="specializedComponent"
        :item="parameters"
      />
      <ItemStats :item="parameters" />
    </div>
  </div>
</template>










<style scoped>
.stats-sidebar {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.stats-sidebar-image {
  align-items: center;
  display: flex;
  justify-content: center;
}

.stats-sidebar-image > img {
  border-radius: 9px;
  margin-top: 0.25rem;
  max-width: 36rem;
  width: 100%;
}

.stats-sidebar-name {
  align-items: center;
  display: flex;
  gap: 0.5rem;
  margin-top: 0.25rem;
}
</style>