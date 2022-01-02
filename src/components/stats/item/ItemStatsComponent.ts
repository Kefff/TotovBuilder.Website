import { computed, defineComponent, PropType } from 'vue'
import { IItem } from '../../../models/item/IItem'
import Price from '../../price/PriceComponent.vue'

export default defineComponent({
  components: {
    Price
  },
  props: {
    item: {
      type: Object as PropType<IItem>,
      required: true
    }
  },
  setup: (props) => {
    const prices = computed(() => {
      const result = [...props.item.prices]
      result.sort((i1, i2) => i1.valueInMainCurrency - i2.valueInMainCurrency)

      return result
    })

    /**
     * Opens a new tab displaying the item in Tarkov Tools.
     */
    function openMarket() {
      window.open(props.item.marketLink, '_blank')
    }

    /**
     * Opens a new tab displaying the item in the Wiki.
     */
    function openWiki() {
      window.open(props.item.wikiLink, '_blank')
    }

    return {
      openMarket,
      openWiki,
      prices
    }
  }
})