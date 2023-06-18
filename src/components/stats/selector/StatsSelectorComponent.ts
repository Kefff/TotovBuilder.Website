import { defineComponent, onMounted, ref, watch } from 'vue'
import { IItem } from '../../../models/item/IItem'
import { ItemService } from '../../../services/ItemService'
import { NotificationService, NotificationType } from '../../../services/NotificationService'
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
import { ItemPropertiesService } from '../../../services/ItemPropertiesService'

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
    const itemPropertiesService = Services.get(ItemPropertiesService)

    const item = ref<IItem>()
    watch(() => props.itemId, () => setItem())

    onMounted(() => setItem())

    /**
     * Sets the item based on the item ID passed to the component.
     */
    async function setItem() {
      const service = Services.get(ItemService)
      const itemResult = await service.getItem(props.itemId)

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