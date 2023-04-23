import { defineComponent, ref } from 'vue'
import MerchantFilter from '../merchant-filter/MerchantFilterComponent.vue'

export default defineComponent({
  components: {
    MerchantFilter
  },
  setup: () => {
    const sidebarVisible = ref(false)

    return {
      sidebarVisible
    }
  }
})