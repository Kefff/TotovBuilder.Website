import { defineComponent, PropType } from 'vue'
import { IVest } from '../../../models/item/IVest'
import ArmorStats from '../armor/ArmorStatsComponent.vue'
import ContainerStats from '../container/ContainerStatsComponent.vue'
import ItemStats from '../item/ItemStatsComponent.vue'

export default defineComponent({
  components: {
    ArmorStats,
    ContainerStats,
    ItemStats
  },
  props: {
    item: {
      type: Object as PropType<IVest>,
      required: true
    }
  }
})