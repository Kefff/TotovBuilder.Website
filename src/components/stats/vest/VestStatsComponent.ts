import { defineComponent, PropType } from 'vue'
import { IVest } from '../../../models/item/IVest'
import ArmorStats from '../ArmorStatsComponent.vue'
import ContainerStats from '../ContainerStatsComponent.vue'

export default defineComponent({
  components: {
    ArmorStats,
    ContainerStats
  },
  props: {
    item: {
      type: Object as PropType<IVest>,
      required: true
    }
  }
})