<template>
  <div :class="toolbarCssClass">
    <div class="toolbar-line">
      <slot />
    </div>
    <div class="toolbar-gradient" />
  </div>
</template>










<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'

const props = defineProps<{
  stickyTriggerSelector: string
}>()

const app = ref<HTMLElement>()
const toolbarCssClass = ref('toolbar')

onMounted(() => {
  app.value = document.getElementById('app') ?? undefined
  app.value?.addEventListener('scroll', setToolbarCssClass)
})

onUnmounted(() => {
  window.removeEventListener('scroll', setToolbarCssClass)
})

/**
 * Sets the toolbar CSS class.
 * Used to set its sticky status and work around Z index problems with PrimeVue components that appear behind the toolbar.
 */
function setToolbarCssClass() {
  const toolbarElement = document.querySelector('.toolbar')
  const toolbarHeight = toolbarElement?.clientHeight ?? 0

  const elementUnderToolbar = document.querySelector(props.stickyTriggerSelector)
  const elementUnderToolbarHeight = elementUnderToolbar?.clientHeight ?? 0
  const elementUnderToolbarYPosition = elementUnderToolbar?.getBoundingClientRect()?.top ?? 0

  const canDisplayElementUnderToolbar = elementUnderToolbarYPosition > toolbarHeight + elementUnderToolbarHeight

  toolbarCssClass.value = canDisplayElementUnderToolbar ? 'toolbar' : 'toolbar toolbar-sticky'
}
</script>












<style>
@import '../css/toolbar.css';

.toolbar {
  margin-top: 0.5rem;
  position: unset;
  width: 100%;
}

.toolbar-sticky {
  position: sticky;
  z-index: 1;
  top: -1rem;
}

.toolbar-gradient {
  background-image: linear-gradient(to bottom, var(--surface-0), rgba(0, 0, 0, 0));
  height: 1rem;
}

.toolbar-line {
  background-color: var(--surface-0);
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  font-size: 2rem;
  min-height: 3.5rem;
}
</style>