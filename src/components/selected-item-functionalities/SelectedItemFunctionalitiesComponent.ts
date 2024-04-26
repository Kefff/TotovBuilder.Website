import { computed, defineComponent, inject, PropType, Ref, ref, watch } from 'vue'
import { SelectableTab } from '../../models/utils/SelectableTab'

export default defineComponent({
  props: {
    canBeLooted: {
      type: Boolean,
      required: true
    },
    canHaveContent: {
      type: Boolean,
      required: true
    },
    canHaveMods: {
      type: Boolean,
      required: true
    },
    contentCount: {
      type: Number,
      required: false,
      default: undefined
    },
    ignorePrice: {
      type: Boolean,
      required: false,
      default: false
    },
    modsCount: {
      type: Number,
      required: false,
      default: undefined
    },
    selectedTab: {
      type: String as PropType<SelectableTab>,
      required: true
    },
    showStats: {
      type: Boolean,
      required: true
    }
  },
  emits: [
    'update:selectedTab',
    'update:ignorePrice',
    'update:selectedTab',
    'update:showStats'
  ],
  setup: (props, { emit }) => {
    const editing = inject<Ref<boolean>>('editing')

    const functionalitiesPanel = ref()
    const buttons = ref<{
      tooltip: string,
      command: () => void,
      icon: string
    }[]>([])

    const ignorePriceValue = computed({
      get: () => props.ignorePrice,
      set: (value: boolean) => emit('update:ignorePrice', value)
    })
    const selectedTabValue = computed({
      get: () => props.selectedTab,
      set: (value: SelectableTab) => emit('update:selectedTab', value)
    })

    watch(() => props.canHaveContent, () => {
      if (!props.canHaveContent && selectedTabValue.value === SelectableTab.content) {
        selectedTabValue.value = props.canHaveMods ? SelectableTab.mods : SelectableTab.hidden
      }
    })

    watch(() => props.canHaveMods, () => {
      if (!props.canHaveMods && selectedTabValue.value === SelectableTab.mods) {
        selectedTabValue.value = props.canHaveContent ? SelectableTab.content : SelectableTab.hidden
      }
    })

    /**
     * Sets the selected tab.
     * If the same tab as the current selected tab, tabs are hidden.
     * @param newValue - New selected tab.
     */
    function setSelectedTab(newValue: SelectableTab) {
      selectedTabValue.value = selectedTabValue.value !== newValue ? newValue : SelectableTab.hidden
    }

    /**
     * Toogles the stats popup.
     */
    function toggleStats() {
      emit('update:showStats', !props.showStats)
    }

    return {
      buttons,
      editing,
      functionalitiesPanel,
      ignorePriceValue,
      SelectableTab,
      selectedTabValue,
      setSelectedTab,
      toggleStats
    }
  }
})