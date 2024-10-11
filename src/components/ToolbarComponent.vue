<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, useTemplateRef } from 'vue'
import { IToolbarButton } from '../models/utils/IToolbarButton'
import vueI18n from '../plugins/vueI18n'
import { GlobalSidebarService } from '../services/GlobalSidebarService'
import Services from '../services/repository/Services'
import Sticky from './StickyComponent.vue'
import ToolbarButton from './ToolbarButtonComponent.vue'

const props = defineProps<{ buttons: IToolbarButton[] }>()

const _globalSidebarService = Services.get(GlobalSidebarService)

const displayToolbarSidebarButton: IToolbarButton = {
  action: displayToolbarSideBar,
  caption: () => vueI18n.t('caption.menu'),
  icon: () => 'bars',
  name: 'toolbarSidebar',
  canBeMovedToSidebar: () => false,
  isVisible: () => areButtonsHidden.value,
  showCaption: () => 'never',
  style: () => 'discreet',
  tooltipPosition: () => 'left'
}
const hideButtonsWidth = 991

const areButtonsHidden = ref(false)
const isInGlobalSidebar = ref(false)
const isStickied = ref(false)
const stickyElement = useTemplateRef('stickyElement')

const leftDisplayedButtons = computed(() =>
  areButtonsHidden.value
    ? props.buttons.filter(b => (b.position?.() ?? 'left') === 'left' && !(b.canBeMovedToSidebar?.() ?? true))
    : props.buttons.filter(b => (b.position?.() ?? 'left') === 'left'))
const rightDisplayedButtons = computed(() =>
  areButtonsHidden.value
    ? props.buttons.filter(b => (b.position?.() ?? 'left') === 'right' && !(b.canBeMovedToSidebar?.() ?? true))
    : props.buttons.filter(b => (b.position?.() ?? 'left') === 'right'))
const hiddenButtons = computed(() => areButtonsHidden.value ? props.buttons.filter(b => (b.canBeMovedToSidebar?.() ?? true)) : [])
const stickiedClasses = computed(() => ({
  'toolbar-stickied': isStickied.value && !isInGlobalSidebar.value,
  'toolbar-stickied-sidebar': isStickied.value && isInGlobalSidebar.value
}))
const toolbarContainer = computed(() => stickyElement.value?.container)

// Exposing the main div to be able to use it as a reference to stick other elements to it.
// This must be the whole computed and not just its value; otherwise the parent component does not receive the value.
defineExpose({ container: toolbarContainer })

onMounted(() => {
  setButtonsAreHidden()

  window.addEventListener('resize', onResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', onResize)
})

/**
 * Displays the toolbar sidebar.
 */
function displayToolbarSideBar() {
  _globalSidebarService.display({
    displayedComponentParameters: props.buttons,
    displayedComponentType: 'ToolbarSidebar'
  })
}

/**
 * Reacts to the window being resized.
 *
 * Sets a value indicating whether toolbar buttons should be hidden.
 */
function onResize() {
  setButtonsAreHidden()
}

/**
 * Set a value indicating whether the media query trigger for hiding buttons is reached.
 */
function setButtonsAreHidden() {
  areButtonsHidden.value = window.matchMedia(`only screen and (max-width: ${hideButtonsWidth}px)`).matches
}
</script>












<template>
  <Sticky
    ref="stickyElement"
    v-model:is-in-global-sidebar="isInGlobalSidebar"
    v-model:is-stickied="isStickied"
    class="toolbar-container"
    width="fill"
  >
    <div
      class="toolbar"
      :class="stickiedClasses"
    >
      <div class="toolbar-line">
        <div class="toolbar-line-left">
          <ToolbarButton
            v-if="hiddenButtons.length > 0"
            :button="displayToolbarSidebarButton"
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
    </div>
  </Sticky>
</template>










<style>
@import '../css/icon.css';

.toolbar {
  background-color: var(--surface-50);
  border-color: var(--primary-color6);
  border-radius: 6px;
  border-style: solid;
  border-width: 1px;
  padding: 0.5rem;
  width: 100%;
}

.toolbar-container {
  width: 100%;
}

.toolbar-line {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 0.5rem;
  font-size: 2rem;
  width: 100%;
}

.toolbar-line button {
  align-items: center;
  display: flex;
  justify-content: center;
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
  border-top-style: none;
  border-top-left-radius: 0;
  border-top-right-radius: 0;
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