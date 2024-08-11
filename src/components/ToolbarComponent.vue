<template>
  <div
    ref="toolbarContainer"
    class="toolbar-container"
    :class="stickied ? 'toolbar-container-stickied' : ''"
  >
    <div
      v-if="$slots.content"
      class="toolbar"
      :class="stickied ? 'toolbar-stickied' : ''"
    >
      <div class="toolbar-line">
        <slot name="content" />
      </div>
    </div>
    <slot name="under" />
  </div>
</template>










<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'

const app = ref<HTMLElement | undefined | null>()
const toolbarContainer = ref<HTMLDivElement | undefined>()
const stickied = ref(false)

onMounted(() => {
  app.value = document.getElementById('app')
  app.value?.addEventListener('scroll', onScroll)
})

onUnmounted(() => {
  app.value?.removeEventListener('scroll', onScroll)
})

/**
 * Reacts to the content being scrolled.
 *
 * Used to dynamically set its z-index to work around problems with PrimeVue components that appear behind the toolbar.
 */
function onScroll() {
  const toolbarRectangle = toolbarContainer.value!.getBoundingClientRect()
  stickied.value = toolbarRectangle.y == 0
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
  z-index: 1;
}

.toolbar-line {
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  font-size: 2rem;
}
</style>