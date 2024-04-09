import { computed, defineComponent, PropType } from 'vue'
import { IArmor } from '../../../models/item/IArmor'
import { IArmorModifiers } from '../../../models/utils/IArmorModifiers'
import { IWearableModifiers } from '../../../models/utils/IWearableModifiers'
import StatsUtils from '../../../utils/StatsUtils'
import WearableSummary from '../wearable/WearableSummaryComponent.vue'

export default defineComponent({
  components: {
    WearableSummary
  }, props: {
    item: {
      type: Object as PropType<IArmor>,
      required: true
    },
    armorModifiersOverride: {
      type: Object as PropType<IArmorModifiers>,
      required: false,
      default: undefined
    },
    wearableModifiersOverride: {
      type: Object as PropType<IWearableModifiers>,
      required: false,
      default: undefined
    },
    showEmptyEntries: {
      type: Boolean,
      required: false,
      default: true
    }
  },
  setup: (props) => {
    const armorClass = computed(() => props.armorModifiersOverride?.armorClass ?? props.item.armorClass)
    const durability = computed(() => props.armorModifiersOverride?.durability ?? props.item.durability)

    return {
      armorClass,
      durability,
      StatsUtils
    }
  }
})