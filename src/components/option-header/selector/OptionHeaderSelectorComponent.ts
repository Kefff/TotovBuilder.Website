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
import { IItem } from '../../../models/item/IItem'
import BackpackOptionHeader from '../backpack/BackpackOptionHeaderComponent.vue'
import Services from '../../../services/repository/Services'
import { ItemPropertiesService } from '../../../services/ItemPropertiesService'

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
    const itemPropertiesService = Services.get(ItemPropertiesService)

    const itemsCategoryId = computed(() => props.categoryId != null ? props.categoryId : 'other')
    const useLongestHeaderWidth = computed(() => props.categoryId == null)
    const updatableFilter = computed({
      get: () => props.filter,
      set: (value: string) => emit('update:filter', value)
    })
    const updatableSortingData = computed({
      get: () => props.sortingData,
      set: (value: SortingData<IItem>) => emit('update:sortingData', value)
    })

    return {
      itemPropertiesService,
      itemsCategoryId,
      updatableFilter,
      updatableSortingData,
      useLongestHeaderWidth
    }
  }
})