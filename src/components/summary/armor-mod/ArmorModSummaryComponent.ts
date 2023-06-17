import { defineComponent, PropType } from 'vue'
import { IArmorMod } from '../../../models/item/IArmorMod'
import ArmorSummary from '../armor/ArmorSummaryComponent.vue'

export default defineComponent({
  components: {
    ArmorSummary
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
  }
})