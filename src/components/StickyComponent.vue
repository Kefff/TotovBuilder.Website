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
  'top': `calc(${(elementToStickToBoundingRectangle.value?.bottom.value ?? 0) - (elementToStickToBoundingRectangle.value?.y.value ?? 0)}px + ${props.offset})`,
  'width': props.width === 'fit' ? 'fit-content' : '100%'
}))
const elementToStickToBoundingRectangle = computed(() => {
  // We use mounted to delay the calculation of stickyElementStyle, otherwise there is a warning in the console
  if (mounted.value && props.elementToStickTo != null) {
    return useElementBounding(props.elementToStickTo)
  }

  return undefined
})
const scrollableParentElementBoundingRectangle = computed(() => {
  // We use mounted to delay the calculation of stickyElementStyle, otherwise there is a warning in the console
  if (mounted.value && scrollableParentElement.value != null) {
    return useElementBounding(scrollableParentElement.value)
  }

  return undefined
})

const mounted = ref(false)
const scrollableParentElement = ref<HTMLElement>()
const stickyElement = useTemplateRef('stickyElement')
const stickyElementBoundingBox = useElementBounding(stickyElement)

// Exposing the main div to be able to use it as a reference to stick other elements to it.
// This must be the whole ref and not just its value; otherwise the parent component does not receive the value.
defineExpose({ container: stickyElement })

onMounted(() => {
  getScrollableParentElement(stickyElement.value)
  mounted.value = true
})

watch(
  () => stickyElementBoundingBox.y.value,
  () => setIsStickied())

/**
 * Gets the parent element that can be scrolled.
 * It can either be the "p-sidebar-content" div of a global sidebar or the "app" div.
 * @param parentElement - Parent element.
 */
function getScrollableParentElement(parentElement: HTMLElement | undefined | null): void {
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
function setIsStickied(): void {
  if (elementToStickToBoundingRectangle.value != null) {
    modelIsStickied.value = stickyElementBoundingBox.y.value === elementToStickToBoundingRectangle.value.bottom.value
  } else if (scrollableParentElementBoundingRectangle.value != null) {
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