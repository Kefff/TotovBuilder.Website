import { computed, defineComponent } from 'vue'
import vueI18n from '../../plugins/vueI18n'

export default defineComponent({
  props: {
    isBarter: {
      type: Boolean,
      required: false,
      default: false
    },
    merchant: {
      type: String,
      required: true
    },
    merchantLevel: {
      type: Number,
      required: true
    },
    requiresQuest: {
      type: Boolean,
      required: false,
      default: false
    },
    showTooltip: {
      type: Boolean,
      required: false,
      default: true
    }
  },
  setup: (props) => {
    const merchantTooltip = computed(() => props.showTooltip
      ? (props.merchant !== ''
        ? (vueI18n.t('caption.merchant_' + props.merchant)
          + (props.merchantLevel !== 0
            ? (' ' + vueI18n.t('caption.level').toLowerCase() + ' ' + props.merchantLevel)
            : '')
          + (props.isBarter ? '\n' + vueI18n.t('caption.barter') : '')
          + (props.requiresQuest ? '\n' + vueI18n.t('caption.questRequired') : ''))
        : '')
      : '')

    return { merchantTooltip }
  }
})