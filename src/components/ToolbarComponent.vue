<script setup lang="ts">
import { computed, ref, useTemplateRef, watch } from 'vue'
import { IToolbarButton } from '../models/utils/IToolbarButton'
import vueI18n from '../plugins/vueI18n'
import { GlobalSidebarService } from '../services/GlobalSidebarService'
import Services from '../services/repository/Services'
import WebBrowserUtils from '../utils/WebBrowserUtils'
import Sticky from './StickyComponent.vue'
import ToolbarButton from './ToolbarButtonComponent.vue'

const props = defineProps<{ buttons: IToolbarButton[] }>()

const emits = defineEmits<{
  isStickied: [value: boolean]
}>()

const _globalSidebarService = Services.get(GlobalSidebarService)

const _displayToolbarSidebarButton: IToolbarButton = {
  action: displayToolbarSideBar,
  caption: () => vueI18n.t('caption.menu'),
  icon: () => 'bars',
  name: 'toolbarSidebar',
  canBeMovedToSidebar: () => false,
  isVisible: () => areButtonsHidden.value,
  showCaption: () => 'never',
  style: () => 'discreet'
}

const leftDisplayedButtons = computed(() =>
  areButtonsHidden.value
    ? props.buttons.filter(b => (b.position?.() ?? 'left') === 'left' && !(b.canBeMovedToSidebar?.() ?? true))
    : props.buttons.filter(b => (b.position?.() ?? 'left') === 'left'))
const rightDisplayedButtons = computed(() =>
  areButtonsHidden.value
    ? props.buttons.filter(b => (b.position?.() ?? 'left') === 'right' && !(b.canBeMovedToSidebar?.() ?? true))
    : props.buttons.filter(b => (b.position?.() ?? 'left') === 'right'))
const hiddenButtons = computed(() => areButtonsHidden.value ? props.buttons.filter(b => (b.canBeMovedToSidebar?.() ?? true)) : [])
const toolbarContainer = computed(() => stickyElement.value?.container)

const { isTabletPortraitOrSmaller: areButtonsHidden } = WebBrowserUtils.getScreenSize()
const isInGlobalSidebar = ref(false)
const isStickied = ref(false)
const stickyElement = useTemplateRef('stickyElement')

// Exposing the main div to be able to use it as a reference to stick other elements to it.
// This must be the whole computed and not just its value; otherwise the parent component does not receive the value.
defineExpose({ container: toolbarContainer })

watch(() => isStickied.value, () => emits('isStickied', isStickied.value))

/**
 * Displays the toolbar sidebar.
 */
function displayToolbarSideBar(): void {
  _globalSidebarService.display({
    displayedComponentParameters: props.buttons,
    displayedComponentType: 'ToolbarSidebar'
  })
}
</script>












<template>
  <Sticky
    ref="stickyElement"
    v-model:is-in-global-sidebar="isInGlobalSidebar"
    v-model:is-stickied="isStickied"
    class="toolbar-container"
  >
    <div
      class="toolbar"
      :class="{
        'toolbar-stickied': isStickied && !isInGlobalSidebar,
        'toolbar-stickied-sidebar': isStickied && isInGlobalSidebar
      }"
    >
      <div class="toolbar-line">
        <div class="toolbar-line-left">
          <ToolbarButton
            v-if="hiddenButtons.length > 0"
            :button="_displayToolbarSidebarButton"
          />
          <ToolbarButton
            v-for="button of leftDisplayedButtons"
            :key="button.name"
            :button="button"
          />
          <slot name="left" />
        </div>
        <div class="toolbar-line-center">
          <slot name="center" />
        </div>
        <div class="toolbar-line-right">
          <ToolbarButton
            v-for="button of rightDisplayedButtons"
            :key="button.name"
            :button="button"
          />
          <slot name="right" />
        </div>
      </div>
      <slot name="bottom" />
    </div>
    <div>
      <slot name="under" />
    </div>
  </Sticky>
</template>










<style scoped>
.toolbar {
  background-color: var(--surface-50);
  border-color: var(--primary-color3);
  border-radius: 6px;
  border-style: solid;
  border-width: 1px;
  padding: 0.5rem;
  width: 100%;
  ;
}

.toolbar-container {
  display: flex;
  flex-direction: column;
  width: 100%;
}

.toolbar-line {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 0.5rem;
  font-size: 2rem;
  width: 100%;
}

.toolbar-line-left {
  align-items: center;
  display: flex;
  gap: 0.5rem;
  justify-content: start;
}

.toolbar-line-right {
  align-items: center;
  display: flex;
  gap: 0.25rem;
  justify-content: end;
}

.toolbar-stickied {
  border-top-left-radius: 0;
  border-top-right-radius: 0;
  border-top-style: none;
}

.toolbar-stickied-sidebar {
  border-top-left-radius: 0;
  border-top-right-radius: 0;
}

/* Smartphone in portrait */
@media only screen and (max-width: 480px) {
  .toolbar-line {
    grid-template-columns: 1fr 1fr;
  }

  .toolbar-line-center {
    display: none;
  }
}

/* Smartphone in landscape */
@media only screen and (min-width: 481px) and (max-width: 767px) {
  .toolbar-line {
    grid-template-columns: 1fr 1fr;
  }

  .toolbar-line-center {
    display: none;
  }
}

/* Tablet in portrait */
@media only screen and (min-width: 768px) and (max-width: 991px) {}

/* Tablet in landscape */
@media only screen and (min-width: 992px) and (max-width: 1299px) {}

/* PC */
@media only screen and (min-width: 1300px) {}
</style>