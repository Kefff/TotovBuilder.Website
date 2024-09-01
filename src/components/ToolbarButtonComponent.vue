<template>
  <Tooltip
    v-show="button.isVisible?.() ?? true"
    :apply-hover-style="false"
    :tooltip="tooltip"
    :position="button.tooltipPosition?.()"
  >
    <Button
      :class="buttonClasses"
      :disabled="button.isDisabled?.() ?? false"
      :outlined="outlined"
      :severity="button.variant?.()"
      class="p-button-sm toolbar-button"
      @click="button.action"
    >
      <font-awesome-icon :icon="button.icon()" />
      <span
        v-show="showCaptionInternal === 'always' || showCaptionInternal === 'auto'"
        :class="captionClasses"
      >{{ button.caption() }}</span>
    </Button>
  </Tooltip>
</template>










<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { IToolbarButton } from '../models/utils/IToolbarButton'

const props = defineProps<{ button: IToolbarButton }>()

const hideCaptionsWidth = 1299

const areCaptionsHidden = ref(false)

const buttonClasses = computed(() => ({
  'button-discreet-danger': props.button.style?.() === 'discreet' && props.button.variant?.() === 'danger',
  'button-discreet': props.button.style?.() === 'discreet',
  'p-button-text': props.button.style?.() === 'discreet'
}))
const captionClasses = computed(() => ({
  'toolbar-button-tooltip': showCaptionInternal.value === 'always' || showCaptionInternal.value === 'auto',
  'toolbar-button-hiddable-tooltip': showCaptionInternal.value === 'auto'
}))
const outlined = computed(() => props.button.style?.() === 'outlined')
const showCaptionInternal = computed(() => props.button.showCaption?.() ?? 'auto')
const tooltip = computed(() =>
  showCaptionInternal.value === 'never'
    || (showCaptionInternal.value === 'auto'
      && areCaptionsHidden.value)
    ? props.button.caption()
    : '')

onMounted(() => {
  setCaptionsAreHidden()

  window.addEventListener('resize', onResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', onResize)
})

/**
 * Reacts to the window being resized.
 *
 * Sets a value indicating whether toolbar button captions should be hidden.
 */
function onResize() {
  setCaptionsAreHidden()
}

/**
 * Set a value indicating whether the media query trigger for hiding captions is reached.
 */
function setCaptionsAreHidden() {
  areCaptionsHidden.value = window.matchMedia(`only screen and (max-width: ${hideCaptionsWidth}px)`).matches
}
</script>










<style scoped>
@import '../css/button.css';

.toolbar-button {
  height: 2.75rem;
  min-width: 2.75rem !important;
  white-space: nowrap;
}

.toolbar-button-tooltip {
  margin-left: 0.25rem;
}

/* Smartphone in portrait */
@media only screen and (max-width: 480px) {
  .toolbar-button-hiddable-tooltip {
    display: none;
  }
}

/* Smartphone in landscape */
@media only screen and (min-width: 481px) and (max-width: 767px) {
  .toolbar-button-hiddable-tooltip {
    display: none;
  }
}

/* Tablet in portrait */
@media only screen and (min-width: 768px) and (max-width: 991px) {
  .toolbar-button-hiddable-tooltip {
    display: none;
  }
}

/* Tablet in landscape */
@media only screen and (min-width: 992px) and (max-width: 1299px) {
  .toolbar-button-hiddable-tooltip {
    display: none;
  }
}

/* PC */
@media only screen and (min-width: 1300px) {}
</style>