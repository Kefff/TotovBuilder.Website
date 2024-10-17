<script setup lang="ts">
import { useElementBounding } from '@vueuse/core'
import { computed, onMounted, onUnmounted, ref, useTemplateRef } from 'vue'

const modelIsInGlobalSidebar = defineModel<boolean>('isInGlobalSidebar', { required: false, default: false })
const modelIsStickied = defineModel<boolean>('isStickied', { required: false, default: false })

const props = withDefaults(
  defineProps<{
    align?: 'left' | 'center' | 'right',
    elementToStickTo?: HTMLElement | null,
    offset?: string,
    width?: 'fit' | 'fill'
  }>(),
  {
    align: 'left',
    elementToStickTo: undefined,
    offset: '0px',
    width: 'fit'
  })

const leftMargin = computed(() => props.align !== 'left')
const rightMargin = computed(() => props.align !== 'right')
const stickyElementStyle = computed(() => ({
  'margin-left': leftMargin.value ? 'auto' : '',
  'margin-right': rightMargin.value ? 'auto' : '',
  'top': `calc(${(elementToStickToBoundingBox?.bottom.value ?? 0) - (elementToStickToBoundingBox?.y.value ?? 0)}px + ${props.offset})`,
  'width': props.width === 'fit' ? 'fit-content' : '100%'
}))

const elementToStickToBoundingBox = props.elementToStickTo != null ? useElementBounding(props.elementToStickTo) : null
const scrollableParentElement = ref<HTMLElement>()
const scrollableParentElementBoundingBox = scrollableParentElement.value != null ? useElementBounding(scrollableParentElement) : null
const stickyElement = useTemplateRef('stickyElement')
const stickyElementBoundingBox = useElementBounding(stickyElement)

// Exposing the main div to be able to use it as a reference to stick other elements to it.
// This must be the whole ref and not just its value; otherwise the parent component does not receive the value.
defineExpose({ container: stickyElement })

onMounted(() => {
  getScrollableParentElement(stickyElement.value)
  scrollableParentElement.value?.addEventListener('scroll', onScroll)

  onScroll()
})

onUnmounted(() => {
  scrollableParentElement.value?.removeEventListener('scroll', onScroll)
})

/**
 * Gets the parent element that can be scrolled.
 * It can either be the "p-sidebar-content" div of a global sidebar or the "app" div.
 * @param parentElement - Parent element.
 */
function getScrollableParentElement(parentElement: HTMLElement | undefined | null) {
  if (parentElement == null) {
    return
  }

  if (parentElement.classList.contains('p-sidebar-content')) {
    scrollableParentElement.value = parentElement
    modelIsInGlobalSidebar.value = true

    return
  } else if (parentElement.id === 'app') {
    scrollableParentElement.value = parentElement
    modelIsInGlobalSidebar.value = false

    return
  }

  getScrollableParentElement(parentElement.parentElement)
}

/**
 * Reacts to the content being scrolled.
 *
 * Gets the bounding client rectangle for the scrollable parent element and the sticky div.
 */
function onScroll() {
  modelIsStickied.value = stickyElementBoundingBox.y.value === (elementToStickToBoundingBox?.bottom.value ?? scrollableParentElementBoundingBox?.y.value ?? 0)
}
</script>









<template>
  <div
    ref="stickyElement"
    class="sticky"
    :style="stickyElementStyle"
  >
    <slot />
  </div>
</template>










<style scoped>
.sticky {
  display: flex;
  max-width: 100%;
  position: sticky;
  z-index: 1;
}
</style>