import { defineComponent, onMounted, ref, watch } from 'vue'
import { IItem } from '../../../models/item/IItem'
import { ItemPropertiesService } from '../../../services/ItemPropertiesService'
import { ItemService } from '../../../services/ItemService'
import Services from '../../../services/repository/Services'
import AmmunitionStat from '../ammunition/AmmunitionStatsComponent.vue'
import ArmorModStat from '../armor-mod/ArmorModStatsComponent.vue'
import ArmorStat from '../armor/ArmorStatsComponent.vue'
import BackpackStat from '../backpack/BackpackStatsComponent.vue'
import ContainerStat from '../container/ContainerStatsComponent.vue'
import EyewearStat from '../eyewear/EyewearStatsComponent.vue'
import GrenadeStat from '../grenade/GrenadeStatsComponent.vue'
import HeadwearStat from '../headwear/HeadwearStatsComponent.vue'
import ItemStat from '../item/ItemStatsComponent.vue'
import MagazineStat from '../magazine/MagazineStatsComponent.vue'
import MeleeWeaponStat from '../melee-weapon/MeleeWeaponStatsComponent.vue'
import ModStat from '../mod/ModStatsComponent.vue'
import RangedWeaponModStat from '../ranged-weapon-mod/RangedWeaponModStatsComponent.vue'
import RangedWeaponStat from '../ranged-weapon/RangedWeaponStatsComponent.vue'
import VestStat from '../vest/VestStatsComponent.vue'

export default defineComponent({
  components: {
    AmmunitionStat,
    ArmorModStat,
    ArmorStat,
    BackpackStat,
    ContainerStat,
    EyewearStat,
    GrenadeStat,
    HeadwearStat,
    ItemStat,
    MagazineStat,
    MeleeWeaponStat,
    ModStat,
    RangedWeaponModStat,
    RangedWeaponStat,
    VestStat
  },
  props: {
    itemId: {
      type: String,
      required: true
    }
  },
  setup: (props) => {
    const item = ref<IItem>()
    const specializedComponent = ref<string>()

    watch(() => props.itemId, () => setItem())

    onMounted(() => setItem())

    /**
     * Sets the item based on the item ID passed to the component.
     */
    async function setItem() {
      const service = Services.get(ItemService)
      const itemResult = await service.getItem(props.itemId)

      if (itemResult.success) {
        item.value = itemResult.value
        selectSpecializeComponent(item.value)
      } else {
        item.value = undefined
        specializedComponent.value = undefined
      }
    }

    /**
     * Sets the type of specialized options header component to display.
     */
    function selectSpecializeComponent(item: IItem) {
      if (item.categoryId == null || item.categoryId === 'other') {
        specializedComponent.value = undefined

        return
      }

      const itemPropertiesService = Services.get(ItemPropertiesService)

      if (itemPropertiesService.isAmmunition(item.categoryId)) {
        specializedComponent.value = 'AmmunitionStat'
      }
      else if (itemPropertiesService.isArmor(item.categoryId)) {
        specializedComponent.value = 'ArmorStat'
      }
      else if (itemPropertiesService.isArmorMod(item.categoryId)) {
        specializedComponent.value = 'ArmorModStat'
      }
      else if (itemPropertiesService.isBackpack(item.categoryId)) {
        specializedComponent.value = 'BackpackStat'
      }
      else if (itemPropertiesService.isContainer(item.categoryId)) {
        specializedComponent.value = 'ContainerStat'
      }
      else if (itemPropertiesService.isEyewear(item.categoryId)) {
        specializedComponent.value = 'EyewearStat'
      }
      else if (itemPropertiesService.isGrenade(item.categoryId)) {
        specializedComponent.value = 'GrenadeStat'
      }
      else if (itemPropertiesService.isHeadwear(item.categoryId)) {
        specializedComponent.value = 'HeadwearStat'
      }
      else if (itemPropertiesService.isMagazine(item.categoryId)) {
        specializedComponent.value = 'MagazineStat'
      }
      else if (itemPropertiesService.isMeleeWeapon(item.categoryId)) {
        specializedComponent.value = 'MeleeWeaponStat'
      }
      else if (itemPropertiesService.isMod(item.categoryId)) {
        specializedComponent.value = 'ModStat'
      }
      else if (itemPropertiesService.isRangedWeapon(item.categoryId)) {
        specializedComponent.value = 'RangedWeaponStat'
      }
      else if (itemPropertiesService.isRangedWeaponMod(item.categoryId)) {
        specializedComponent.value = 'RangedWeaponModStat'
      }
      else if (itemPropertiesService.isVest(item.categoryId)) {
        specializedComponent.value = 'VestStat'
      }
    }

    return {
      item,
      specializedComponent
    }
  }
})