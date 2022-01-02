import { computed, defineComponent, nextTick, onMounted, PropType, ref, watch } from 'vue'
import { SelectableTab } from '../../models/utils/SelectableTab'

export default defineComponent({
  props: {
    modelValue: {
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
    }
  },
  emits: ['update:modelValue'],
  setup: (props, { emit }) => {
    const tabsPanel = ref()
    const tabsPanelItems = ref<{
      label: string,
      command: () => void,
      icon: string
    }[]>([])

    const selectedTab = computed({
      get: () => props.modelValue,
      set: (value: SelectableTab) => emit('update:modelValue', value)
    })
    const selectedTabIcon = computed(() => getSelectedTabIcon(selectedTab.value))

    watch(() => props.canHaveContent, () => {
      if ((!props.canHaveContent && selectedTab.value === SelectableTab.content)) {
        if (props.canHaveMods) {
          selectTab(SelectableTab.mods)
        } else {
          selectTab(SelectableTab.hidden)
        }
      } else {
        setTabPanelItems()
      }
    })

    watch(() => props.canHaveMods, () => {
      if ((!props.canHaveMods && selectedTab.value === SelectableTab.mods)) {
        if (props.canHaveContent) {
          selectTab(SelectableTab.content)
        } else {
          selectTab(SelectableTab.hidden)
        }
      } else {
        setTabPanelItems()
      }
    })

    onMounted(() => setTabPanelItems())

    /**
     * Gets the icon for the selected tab.
     * @param tab - Selected tab.
     * @returns Icon for the selected tab.
     */
    function getSelectedTabIcon(tab: SelectableTab) {
      switch (tab) {
        case SelectableTab.mods: {
          return 'puzzle-piece'
        }
        case SelectableTab.content: {
          return 'box-open'
        }
        case SelectableTab.stats: {
          return 'clipboard-list'
        }
        default: {
          return 'eye-slash'
        }
      }
    }

    /**
     * Sets the tabs buttons.
     */
    function setTabPanelItems() {
      tabsPanelItems.value = []

      if (props.canHaveMods && selectedTab.value !== SelectableTab.mods) {
        tabsPanelItems.value.push({
          label: 'caption.' + SelectableTab.mods,
          command: () => {
            selectTab(SelectableTab.mods)
            toggleTabsPanel(undefined)
          },
          icon: 'puzzle-piece'
        })
      }

      if (props.canHaveContent && selectedTab.value !== SelectableTab.content) {
        tabsPanelItems.value.push({
          label: 'caption.' + SelectableTab.content,
          command: () => {
            selectTab(SelectableTab.content)
            toggleTabsPanel(undefined)
          },
          icon: 'box-open'
        })
      }

      if (selectedTab.value !== SelectableTab.stats) {
        tabsPanelItems.value.push({
          label: 'caption.' + SelectableTab.stats,
          command: () => {
            selectTab(SelectableTab.stats)
            toggleTabsPanel(undefined)
          },
          icon: 'clipboard-list'
        })
      }

      if (selectedTab.value !== SelectableTab.hidden) {
        tabsPanelItems.value.push({
          label: 'caption.' + SelectableTab.hidden,
          command: () => {
            selectTab(SelectableTab.hidden)
            toggleTabsPanel(undefined)
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
      selectedTab.value = value
      nextTick(() => setTabPanelItems())
    }

    /**
     * Toggles the tabs panel.
     * @param event - Event.
     */
    function toggleTabsPanel(event: unknown) {
      tabsPanel.value.toggle(event)
    }

    return {
      selectedTab,
      selectedTabIcon,
      selectTab,
      tabsPanel,
      tabsPanelItems,
      toggleTabsPanel
    }
  }
})