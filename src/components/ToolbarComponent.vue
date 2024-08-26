<template>
  <div
    ref="toolbarContainer"
    class="toolbar-container"
  >
    <div
      class="toolbar"
      :class="toolbarClasses"
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
  </div>
</template>










<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { IToolbarButton } from '../models/utils/IToolbarButton'
import vueI18n from '../plugins/vueI18n'
import { GlobalSidebarService } from '../services/GlobalSidebarService'
import Services from '../services/repository/Services'
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
const scrollableParent = ref<HTMLElement>()
const stickied = ref(false)
const toolbarContainer = ref<HTMLDivElement>()

const leftDisplayedButtons = computed(() =>
  areButtonsHidden.value
    ? props.buttons.filter(b => (b.position?.() ?? 'left') === 'left' && !(b.canBeMovedToSidebar?.() ?? true))
    : props.buttons.filter(b => (b.position?.() ?? 'left') === 'left'))
const rightDisplayedButtons = computed(() =>
  areButtonsHidden.value
    ? props.buttons.filter(b => (b.position?.() ?? 'left') === 'right' && !(b.canBeMovedToSidebar?.() ?? true))
    : props.buttons.filter(b => (b.position?.() ?? 'left') === 'right'))
const hiddenButtons = computed(() => areButtonsHidden.value ? props.buttons.filter(b => (b.canBeMovedToSidebar?.() ?? true)) : [])
const toolbarClasses = computed(() => ({
  'toolbar-stickied': stickied.value && !isInGlobalSidebar.value,
  'toolbar-stickied-sidebar': stickied.value && isInGlobalSidebar.value
}))

onMounted(() => {
  scrollableParent.value = getScrollableParent(toolbarContainer.value?.parentElement)
  scrollableParent.value?.addEventListener('scroll', onScroll)

  setButtonsAreHidden()

  window.addEventListener('resize', onResize)
})

onUnmounted(() => {
  scrollableParent.value?.removeEventListener('scroll', onScroll)

  window.removeEventListener('resize', onResize)
})

/**
 * Displays the toolbar sidebar.
 */
function displayToolbarSideBar() {
  _globalSidebarService.display({
    displayedComponentType: 'ToolbarSidebar'
  })
}

/**
 * Gets the parent element that can be scrolled.
 * It can either be the "p-sidebar-content" div of a global sidebar or the "app" div.
 * @param parentElement - Parent element.
 */
function getScrollableParent(parentElement: HTMLElement | undefined | null): HTMLElement | undefined {
  if (parentElement == null) {
    return undefined
  }

  if (parentElement.classList.contains('p-sidebar-content')) {
    isInGlobalSidebar.value = true

    return parentElement
  } else if (parentElement.id === 'app') {
    return parentElement
  }

  return getScrollableParent(parentElement.parentElement)
}

/**
 * Reacts to the content being scrolled.
 *
 * Used to dynamically set its z-index to work around problems with PrimeVue components that appear behind the toolbar.
 */
function onScroll() {
  const scrollableParentRectangle = scrollableParent.value!.getBoundingClientRect()
  const toolbarRectangle = toolbarContainer.value!.getBoundingClientRect()
  stickied.value = toolbarRectangle.y - scrollableParentRectangle.y === 0
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












<style>
@import '../css/icon.css';

.toolbar {
  backdrop-filter: blur(10px);
  background-color: rgba(18, 18, 18, 0.85);
  border-color: var(--primary-color6);
  border-radius: 6px;
  border-style: solid;
  border-width: 1px;
  padding: 0.5rem;
  width: 100%;
}

.toolbar-container {
  position: sticky;
  top: 0;
  z-index: 1;
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