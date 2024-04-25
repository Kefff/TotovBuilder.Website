import { PropType, computed, defineComponent, onMounted, ref, watch } from 'vue'
import { IItem } from '../../../models/item/IItem'
import { ItemPropertiesService } from '../../../services/ItemPropertiesService'
import Services from '../../../services/repository/Services'
import ItemIcon from '../../item-icon/ItemIconComponent.vue'
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
    ItemIcon,
    ItemStat,
    MagazineStat,
    MeleeWeaponStat,
    ModStat,
    RangedWeaponModStat,
    RangedWeaponStat,
    VestStat
  },
  props: {
    item: {
      type: Object as PropType<IItem>,
      required: true
    },
    showStats: {
      type: Boolean,
      required: true
    }
  },
  emits: ['update:showStats'],
  setup: (props, { emit }) => {
    const specializedComponent = ref<string>()

    const showStatsInternal = computed({
      get: () => props.showStats,
      set: (value: boolean) => emit('update:showStats', value)
    })

    watch(() => props.item.id, () => selectSpecializeComponent())

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
        specializedComponent.value = 'AmmunitionStat'
      }
      else if (itemPropertiesService.isArmor(props.item.categoryId)) {
        specializedComponent.value = 'ArmorStat'
      }
      else if (itemPropertiesService.isArmorMod(props.item.categoryId)) {
        specializedComponent.value = 'ArmorModStat'
      }
      else if (itemPropertiesService.isBackpack(props.item.categoryId)) {
        specializedComponent.value = 'BackpackStat'
      }
      else if (itemPropertiesService.isContainer(props.item.categoryId)) {
        specializedComponent.value = 'ContainerStat'
      }
      else if (itemPropertiesService.isEyewear(props.item.categoryId)) {
        specializedComponent.value = 'EyewearStat'
      }
      else if (itemPropertiesService.isGrenade(props.item.categoryId)) {
        specializedComponent.value = 'GrenadeStat'
      }
      else if (itemPropertiesService.isHeadwear(props.item.categoryId)) {
        specializedComponent.value = 'HeadwearStat'
      }
      else if (itemPropertiesService.isMagazine(props.item.categoryId)) {
        specializedComponent.value = 'MagazineStat'
      }
      else if (itemPropertiesService.isMeleeWeapon(props.item.categoryId)) {
        specializedComponent.value = 'MeleeWeaponStat'
      }
      else if (itemPropertiesService.isMod(props.item.categoryId)) {
        specializedComponent.value = 'ModStat'
      }
      else if (itemPropertiesService.isRangedWeapon(props.item.categoryId)) {
        specializedComponent.value = 'RangedWeaponStat'
      }
      else if (itemPropertiesService.isRangedWeaponMod(props.item.categoryId)) {
        specializedComponent.value = 'RangedWeaponModStat'
      }
      else if (itemPropertiesService.isVest(props.item.categoryId)) {
        specializedComponent.value = 'VestStat'
      }
    }

    return {
      showStatsInternal,
      specializedComponent
    }
  }
})