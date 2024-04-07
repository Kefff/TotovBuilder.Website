import { defineComponent, onMounted, PropType, ref, watch } from 'vue'
import { IItem } from '../../../models/item/IItem'
import { ItemPropertiesService } from '../../../services/ItemPropertiesService'
import Services from '../../../services/repository/Services'
import AmmunitionSummary from '../ammunition/AmmunitionSummaryComponent.vue'
import ArmorModSummary from '../armor-mod/ArmorModSummaryComponent.vue'
import ArmorSummary from '../armor/ArmorSummaryComponent.vue'
import BackpackSummary from '../backpack/BackpackSummaryComponent.vue'
import ContainerSummary from '../container/ContainerSummaryComponent.vue'
import EyewearSummary from '../eyewear/EyewearSummaryComponent.vue'
import GrenadeSummary from '../grenade/GrenadeSummaryComponent.vue'
import HeadwearSummary from '../headwear/HeadwearSummaryComponent.vue'
import ItemSummary from '../item/ItemSummaryComponent.vue'
import MagazineSummary from '../magazine/MagazineSummaryComponent.vue'
import MeleeWeaponSummary from '../melee-weapon/MeleeWeaponSummaryComponent.vue'
import ModSummary from '../mod/ModSummaryComponent.vue'
import RangedWeaponModSummary from '../ranged-weapon-mod/RangedWeaponModSummaryComponent.vue'
import RangedWeaponSummary from '../ranged-weapon/RangedWeaponSummaryComponent.vue'
import VestSummary from '../vest/VestSummaryComponent.vue'

export default defineComponent({
  components: {
    AmmunitionSummary,
    ArmorModSummary,
    ArmorSummary,
    BackpackSummary,
    ContainerSummary,
    EyewearSummary,
    GrenadeSummary,
    HeadwearSummary,
    ItemSummary,
    MagazineSummary,
    MeleeWeaponSummary,
    ModSummary,
    RangedWeaponModSummary,
    RangedWeaponSummary,
    VestSummary
  },
  props: {
    item: {
      type: Object as PropType<IItem>,
      required: true
    }
  },
  setup(props) {
    const specializedComponent = ref<string>()

    watch(() => props.item.categoryId, () => selectSpecializeComponent())

    onMounted(() => selectSpecializeComponent())

    /**
     * Sets the type of specialized options header component to display.
     */
    function selectSpecializeComponent() {
      if (props.item.categoryId == null || props.item.categoryId === 'other') {
        specializedComponent.value = undefined

        return
      }

      const itemPropertiesService = Services.get(ItemPropertiesService)

      if (itemPropertiesService.isAmmunition(props.item.categoryId)) {
        specializedComponent.value = 'AmmunitionSummary'
      }
      else if (itemPropertiesService.isArmor(props.item.categoryId)) {
        specializedComponent.value = 'ArmorSummary'
      }
      else if (itemPropertiesService.isArmorMod(props.item.categoryId)) {
        specializedComponent.value = 'ArmorModSummary'
      }
      else if (itemPropertiesService.isBackpack(props.item.categoryId)) {
        specializedComponent.value = 'BackpackSummary'
      }
      else if (itemPropertiesService.isContainer(props.item.categoryId)) {
        specializedComponent.value = 'ContainerSummary'
      }
      else if (itemPropertiesService.isEyewear(props.item.categoryId)) {
        specializedComponent.value = 'EyewearSummary'
      }
      else if (itemPropertiesService.isGrenade(props.item.categoryId)) {
        specializedComponent.value = 'GrenadeSummary'
      }
      else if (itemPropertiesService.isHeadwear(props.item.categoryId)) {
        specializedComponent.value = 'HeadwearSummary'
      }
      else if (itemPropertiesService.isMagazine(props.item.categoryId)) {
        specializedComponent.value = 'MagazineSummary'
      }
      else if (itemPropertiesService.isMeleeWeapon(props.item.categoryId)) {
        specializedComponent.value = 'MeleeWeaponSummary'
      }
      else if (itemPropertiesService.isMod(props.item.categoryId)) {
        specializedComponent.value = 'ModSummary'
      }
      else if (itemPropertiesService.isRangedWeapon(props.item.categoryId)) {
        specializedComponent.value = 'RangedWeaponSummary'
      }
      else if (itemPropertiesService.isRangedWeaponMod(props.item.categoryId)) {
        specializedComponent.value = 'RangedWeaponModSummary'
      }
      else if (itemPropertiesService.isVest(props.item.categoryId)) {
        specializedComponent.value = 'VestSummary'
      }
    }

    return {
      specializedComponent
    }
  }
})