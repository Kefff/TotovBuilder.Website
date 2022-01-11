import { computed, defineComponent, inject, nextTick, onMounted, PropType, Ref, ref, watch } from 'vue'
import { SelectableTab } from '../../models/utils/SelectableTab'

export default defineComponent({
  props: {
    selectedTab: {
      type: String as PropType<SelectableTab>,
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
    ignorePrice: {
      type: Boolean,
      required: true
    }
  },
  emits: [
    'update:selectedTab',
    'update:ignorePrice'
  ],
  setup: (props, { emit }) => {
    const editing = inject<Ref<boolean>>('editing')

    const functionalitiesPanel = ref()
    const tabButtons = ref<{
      label: string,
      command: () => void,
      icon: string
    }[]>([])

    const selectedTabValue = computed({
      get: () => props.selectedTab,
      set: (value: SelectableTab) => emit('update:selectedTab', value)
    })

    const ignorePriceValue = computed({
      get: () => props.ignorePrice,
      set: (value: boolean) => emit('update:ignorePrice', value)
    })

    watch(() => props.canHaveContent, () => {
      if ((!props.canHaveContent && selectedTabValue.value === SelectableTab.content)) {
        if (props.canHaveMods) {
          selectTab(SelectableTab.mods)
        } else {
          selectTab(SelectableTab.hidden)
        }
      } else {
        setTabButtons()
      }
    })

    watch(() => props.canHaveMods, () => {
      if ((!props.canHaveMods && selectedTabValue.value === SelectableTab.mods)) {
        if (props.canHaveContent) {
          selectTab(SelectableTab.content)
        } else {
          selectTab(SelectableTab.hidden)
        }
      } else {
        setTabButtons()
      }
    })

    onMounted(() => setTabButtons())

    /**
     * Sets the buttons for changing tab.
     */
    function setTabButtons() {
      tabButtons.value = []

      if (props.canHaveMods && selectedTabValue.value !== SelectableTab.mods) {
        tabButtons.value.push({
          label: 'caption.showMods',
          command: () => {
            selectTab(SelectableTab.mods)
            toggleFunctionalitiesPanel(undefined)
          },
          icon: 'puzzle-piece'
        })
      }

      if (props.canHaveContent && selectedTabValue.value !== SelectableTab.content) {
        tabButtons.value.push({
          label: 'caption.showContent',
          command: () => {
            selectTab(SelectableTab.content)
            toggleFunctionalitiesPanel(undefined)
          },
          icon: 'box-open'
        })
      }

      if (selectedTabValue.value !== SelectableTab.stats) {
        tabButtons.value.push({
          label: 'caption.showStatistics',
          command: () => {
            selectTab(SelectableTab.stats)
            toggleFunctionalitiesPanel(undefined)
          },
          icon: 'clipboard-list'
        })
      }

      if (selectedTabValue.value !== SelectableTab.hidden) {
        tabButtons.value.push({
          label: 'caption.hideDetails',
          command: () => {
            selectTab(SelectableTab.hidden)
            toggleFunctionalitiesPanel(undefined)
          },
          icon: 'eye-slash'
        })
      }
    }

    /**
     * Selects a tab.
     * @param value - Tab to select.
     */
    function selectTab(value: SelectableTab) {
      selectedTabValue.value = value
      nextTick(() => setTabButtons())
    }

    /**
     * Toggles the functionalities panel.
     * @param event - Event.
     */
    function toggleFunctionalitiesPanel(event: unknown) {
      functionalitiesPanel.value.toggle(event)
    }

    return {
      editing,
      functionalitiesPanel,
      ignorePriceValue,
      selectedTabValue,
      selectTab,
      tabButtons,
      toggleFunctionalitiesPanel
    }
  }
})