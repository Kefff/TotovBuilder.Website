<script setup lang="ts">
import { useElementBounding } from '@vueuse/core'
import { computed, onMounted, ref, useTemplateRef, watch } from 'vue'

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

const stickyElementStyle = computed(() => ({
  'margin-left': props.align !== 'left' ? 'auto' : '',
  'margin-right': props.align !== 'right' ? 'auto' : '',
  // The following line generates a warning "onMounted is called when there is no active component instance to be associated with"
  'top': `calc(${elementToStickToBoundingRectangle.value.bottom.value - elementToStickToBoundingRectangle.value.y.value}px + ${props.offset})`,
  'width': props.width === 'fit' ? 'fit-content' : '100%'
}))

const elementToStickToBoundingRectangle = computed(() => useElementBounding(props.elementToStickTo)) // Computed used here otherwise the bounding rectangle is not set when mounting. Also allows to change the element to stick to on the fly.
const scrollableParentElementBoundingRectangle = computed(() => useElementBounding(scrollableParentElement.value)) // Computed used here otherwise the bounding rectangle is not set when mounting

const scrollableParentElement = ref<HTMLElement>()
const stickyElement = useTemplateRef('stickyElement')
const stickyElementBoundingBox = useElementBounding(stickyElement)

// Exposing the main div to be able to use it as a reference to stick other elements to it.
// This must be the whole ref and not just its value; otherwise the parent component does not receive the value.
defineExpose({ container: stickyElement })

onMounted(() => getScrollableParentElement(stickyElement.value))

watch(
  () => stickyElementBoundingBox.y.value,
  () => setIsStickied())

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
 * Sets whether the sticky element is stickied.
 */
function setIsStickied() {
  if (props.elementToStickTo != null) {
    modelIsStickied.value = stickyElementBoundingBox.y.value === elementToStickToBoundingRectangle.value.bottom.value
  } else if (scrollableParentElement.value != null) {
    modelIsStickied.value = stickyElementBoundingBox.y.value === scrollableParentElementBoundingRectangle.value.y.value
  } else {
    modelIsStickied.value = stickyElementBoundingBox.y.value === 0
  }
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