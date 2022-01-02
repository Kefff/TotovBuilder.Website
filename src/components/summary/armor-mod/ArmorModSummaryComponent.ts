import { computed, defineComponent, PropType } from 'vue'
import { IArmorMod } from '../../../models/item/IArmorMod'
import ItemIcon from '../../item-icon/ItemIconComponent.vue'
import ArmorSummary from '../armor/ArmorSummaryComponent.vue'
import Price from '../../price/PriceComponent.vue'

export default defineComponent({
  components: {
    ArmorSummary,
    ItemIcon,
    Price
  },
  props: {
    item: {
      type: Object as PropType<IArmorMod>,
      required: true
    },
    showEmptyEntries: {
      type: Boolean,
      required: false,
      default: true
    }
  },
  setup: (props) => {
    const hasArmor = computed(() => props.item.armorClass > 0)

    return { hasArmor }
  }
})