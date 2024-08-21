<template>
  <div
    ref="toolbarContainer"
    class="toolbar-container"
    :class="toolbarContainerClasses"
  >
    <div
      v-if="$slots.content"
      class="toolbar"
      :class="toolbarClasses"
    >
      <div class="toolbar-line">
        <slot name="content" />
      </div>
    </div>
    <slot name="under" />
  </div>
</template>










<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue'

const isInGlobalSidebar = ref(false)
const scrollableParent = ref<HTMLElement>()
const stickied = ref(false)
const toolbarContainer = ref<HTMLDivElement>()

const toolbarContainerClasses = computed(() => {
  if (stickied.value && isInGlobalSidebar.value) {
    return 'toolbar-container-stickied-z-index-fix'
  } else if (stickied.value) {
    return 'toolbar-container-stickied'
  }

  return ''
})

const toolbarClasses = computed(() => {
  if (stickied.value && isInGlobalSidebar.value) {
    return 'toolbar-stickied-sidebar'
  } else if (stickied.value) {
    return 'toolbar-stickied'
  }

  return ''
})

onMounted(() => {
  scrollableParent.value = getScrollableParent(toolbarContainer.value?.parentElement)
  scrollableParent.value?.addEventListener('scroll', onScroll)
})

onUnmounted(() => {
  scrollableParent.value?.removeEventListener('scroll', onScroll)
})

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
</script>












<style>
@import '../css/toolbar.css';

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
  margin-bottom: 0.5rem;
  position: sticky;
  top: 0;
}

.toolbar-container-stickied {
  z-index: 1;
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

.toolbar-line {
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  font-size: 2rem;
}

.toolbar-container-stickied-z-index-fix {
  /* For some reason, when the buils list is displayed in a sidebar, item icons appear over the toolbar. */
  z-index: 9999;
}
</style>