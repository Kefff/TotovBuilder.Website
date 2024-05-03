import { computed, defineComponent, onMounted, PropType, ref, watch } from 'vue'
import { IItem } from '../../../models/item/IItem'
import SortingData from '../../../models/utils/SortingData'
import { ItemPropertiesService } from '../../../services/ItemPropertiesService'
import Services from '../../../services/repository/Services'
import AmmunitionOptionHeader from '../ammunition/AmmunitionOptionHeaderComponent.vue'
import ArmorModOptionHeader from '../armor-mod/ArmorModOptionHeaderComponent.vue'
import ArmorOptionHeader from '../armor/ArmorOptionHeaderComponent.vue'
import BackpackOptionHeader from '../backpack/BackpackOptionHeaderComponent.vue'
import ContainerOptionHeader from '../container/ContainerOptionHeaderComponent.vue'
import EyewearOptionHeader from '../eyewear/EyewearOptionHeaderComponent.vue'
import GrenadeOptionHeader from '../grenade/GrenadeOptionHeaderComponent.vue'
import HeadwearOptionHeader from '../headwear/HeadwearOptionHeaderComponent.vue'
import ItemOptionHeader from '../item/ItemOptionHeaderComponent.vue'
import MagazineOptionHeader from '../magazine/MagazineOptionHeaderComponent.vue'
import MeleeWeaponOptionHeader from '../melee-weapon/MeleeWeaponOptionHeaderComponent.vue'
import ModOptionHeader from '../mod/ModOptionHeaderComponent.vue'
import RangedWeaponModOptionHeader from '../ranged-weapon-mod/RangedWeaponModOptionHeaderComponent.vue'
import RangedWeaponOptionHeader from '../ranged-weapon/RangedWeaponOptionHeaderComponent.vue'
import VestOptionHeader from '../vest/VestOptionHeaderComponent.vue'

export default defineComponent({
  components: {
    AmmunitionOptionHeader,
    ArmorModOptionHeader,
    ArmorOptionHeader,
    BackpackOptionHeader,
    ContainerOptionHeader,
    EyewearOptionHeader,
    GrenadeOptionHeader,
    HeadwearOptionHeader,
    ItemOptionHeader,
    MagazineOptionHeader,
    MeleeWeaponOptionHeader,
    ModOptionHeader,
    RangedWeaponModOptionHeader,
    RangedWeaponOptionHeader,
    VestOptionHeader
  },
  props: {
    categoryId: {
      type: String,
      required: false,
      default: undefined
    },
    filter: {
      type: String,
      required: true
    },
    sortingData: {
      type: Object as PropType<SortingData<IItem>>,
      required: true
    }
  },
  emits: [
    'update:filter',
    'update:sortingData'
  ],
  setup: (props, { emit }) => {
    const specializedComponent = ref<string>()

    const useLongestHeaderWidth = computed(() => props.categoryId == null)
    const updatableFilter = computed({
      get: () => props.filter,
      set: (value: string) => emit('update:filter', value)
    })
    const updatableSortingData = computed({
      get: () => props.sortingData,
      set: (value: SortingData<IItem>) => emit('update:sortingData', value)
    })

    watch(() => props.categoryId, () => selectSpecializeComponent())

    onMounted(() => selectSpecializeComponent())

    /**
     * Sets the type of specialized options header component to display.
     */
    function selectSpecializeComponent() {
      if (props.categoryId == null || props.categoryId === 'other') {
        specializedComponent.value = undefined

        return
      }

      const itemPropertiesService = Services.get(ItemPropertiesService)

      if (itemPropertiesService.isAmmunition(props.categoryId)) {
        specializedComponent.value = 'AmmunitionOptionHeader'
      }
      else if (itemPropertiesService.isArmor(props.categoryId)) {
        specializedComponent.value = 'ArmorOptionHeader'
      }
      else if (itemPropertiesService.isArmorMod(props.categoryId)) {
        specializedComponent.value = 'ArmorModOptionHeader'
      }
      else if (itemPropertiesService.isBackpack(props.categoryId)) {
        specializedComponent.value = 'BackpackOptionHeader'
      }
      else if (itemPropertiesService.isContainer(props.categoryId)) {
        specializedComponent.value = 'ContainerOptionHeader'
      }
      else if (itemPropertiesService.isEyewear(props.categoryId)) {
        specializedComponent.value = 'EyewearOptionHeader'
      }
      else if (itemPropertiesService.isGrenade(props.categoryId)) {
        specializedComponent.value = 'GrenadeOptionHeader'
      }
      else if (itemPropertiesService.isHeadwear(props.categoryId)) {
        specializedComponent.value = 'HeadwearOptionHeader'
      }
      else if (itemPropertiesService.isMagazine(props.categoryId)) {
        specializedComponent.value = 'MagazineOptionHeader'
      }
      else if (itemPropertiesService.isMeleeWeapon(props.categoryId)) {
        specializedComponent.value = 'MeleeWeaponOptionHeader'
      }
      else if (itemPropertiesService.isMod(props.categoryId)) {
        specializedComponent.value = 'ModOptionHeader'
      }
      else if (itemPropertiesService.isRangedWeapon(props.categoryId)) {
        specializedComponent.value = 'RangedWeaponOptionHeader'
      }
      else if (itemPropertiesService.isRangedWeaponMod(props.categoryId)) {
        specializedComponent.value = 'RangedWeaponModOptionHeader'
      }
      else if (itemPropertiesService.isVest(props.categoryId)) {
        specializedComponent.value = 'VestOptionHeader'
      }
    }

    return {
      specializedComponent,
      updatableFilter,
      updatableSortingData,
      useLongestHeaderWidth
    }
  }
})