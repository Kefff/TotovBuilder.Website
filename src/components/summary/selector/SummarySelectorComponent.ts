import { defineComponent, PropType } from 'vue'
import { IItem } from '../../../models/item/IItem'
import AmmunitionSummary from '../ammunition/AmmunitionSummaryComponent.vue'
import ArmorModSummary from '../armor-mod/ArmorModSummaryComponent.vue'
import ArmorSummary from '../armor/ArmorSummaryComponent.vue'
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
import Services from '../../../services/repository/Services'
import { ItemPropertiesService } from '../../../services/ItemPropertiesService'

export default defineComponent({
  components: {
    AmmunitionSummary,
    ArmorModSummary,
    ArmorSummary,
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
  setup() {
    const itemPropertiesService = Services.get(ItemPropertiesService)

    return {
      itemPropertiesService
    }
  }
})