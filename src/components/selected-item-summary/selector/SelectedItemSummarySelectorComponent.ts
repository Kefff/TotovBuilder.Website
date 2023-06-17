import { defineComponent, onMounted, PropType, ref, watch } from 'vue'
import { IItem } from '../../../models/item/IItem'
import AmmunitionSummary from '../../summary/ammunition/AmmunitionSummaryComponent.vue'
import ArmorModSummary from '../../summary/armor-mod/ArmorModSummaryComponent.vue'
import ArmorSummary from '../../summary/armor/ArmorSummaryComponent.vue'
import BackpackSummary from '../../summary/backpack/BackpackSummaryComponent.vue'
import ContainerSummary from '../../summary/container/ContainerSummaryComponent.vue'
import EyewearSummary from '../../summary/eyewear/EyewearSummaryComponent.vue'
import GrenadeSummary from '../../summary/grenade/GrenadeSummaryComponent.vue'
import HeadwearSummary from '../../summary/headwear/HeadwearSummaryComponent.vue'
import MagazineSummary from '../../summary/magazine/MagazineSummaryComponent.vue'
import MeleeWeaponSummary from '../../summary/melee-weapon/MeleeWeaponSummaryComponent.vue'
import ModSummary from '../../summary/mod/ModSummaryComponent.vue'
import RangedWeaponModSummary from '../../summary/ranged-weapon-mod/RangedWeaponModSummaryComponent.vue'
import RangedWeaponSummary from '../../summary/ranged-weapon/RangedWeaponSummaryComponent.vue'
import SelectedItemSummary from '../item/SelectedItemSummaryComponent.vue'
import VestSummary from '../../summary/vest/VestSummaryComponent.vue'
import { IInventoryItem } from '../../../models/build/IInventoryItem'
import Services from '../../../services/repository/Services'
import { ItemService } from '../../../services/ItemService'
import { NotificationService, NotificationType } from '../../../services/NotificationService'
import { IInventoryModSlot } from '../../../models/build/IInventoryModSlot'
import { ItemPropertiesService } from '../../../services/ItemPropertiesService'

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
    MagazineSummary,
    MeleeWeaponSummary,
    ModSummary,
    RangedWeaponModSummary,
    RangedWeaponSummary,
    SelectedItemSummary,
    VestSummary
  },
  props: {
    modelValue: {
      type: Object as PropType<IInventoryItem>,
      required: true
    },
    canBeLooted: {
      type: Boolean,
      required: false,
      default: true
    },
    preset: {
      type: Object as PropType<IInventoryModSlot>,
      required: false,
      default: undefined
    }
  },
  setup: (props) => {
    const itemPropertiesService = Services.get(ItemPropertiesService)

    const item = ref<IItem>()
    watch(() => props.modelValue, () => setItem())

    onMounted(() => setItem())

    /**
     * Sets the item based on the inventory item passed to the component.
     */
    async function setItem() {
      const itemResult = await Services.get(ItemService).getItem(props.modelValue.itemId)

      if (!itemResult.success) {
        Services.get(NotificationService).notify(NotificationType.error, itemResult.failureMessage)

        return
      }

      item.value = itemResult.value
    }

    return {
      item,
      itemPropertiesService
    }
  }
})