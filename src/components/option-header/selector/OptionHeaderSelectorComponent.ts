import { computed, defineComponent, PropType } from 'vue'
import SortingData from '../../../models/utils/SortingData'
import AmmunitionOptionHeader from '../ammunition/AmmunitionOptionHeaderComponent.vue'
import ArmorModOptionHeader from '../armor-mod/ArmorModOptionHeaderComponent.vue'
import ArmorOptionHeader from '../armor/ArmorOptionHeaderComponent.vue'
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
      required: true
    },
    filter: {
      type: String,
      required: true
    },
    sortingData: {
      type: Object as PropType<SortingData>,
      required: true
    }
  },
  emits: [
    'update:filter',
    'update:sortingData'
  ],
  setup: (props, { emit }) => {
    const updatableFilter = computed({
      get: () => props.filter,
      set: (value: string) => emit('update:filter', value)
    })
    const updatableSortingData = computed({
      get: () => props.sortingData,
      set: (value: SortingData) => emit('update:sortingData', value)
    })

    return { updatableFilter, updatableSortingData }
  }
})