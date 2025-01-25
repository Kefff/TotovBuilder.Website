<script setup lang="ts">
import { computed } from 'vue'
import { IToolbarButton } from '../models/utils/IToolbarButton'
import WebBrowserUtils from '../utils/WebBrowserUtils'
import Tooltip from './TooltipComponent.vue'

const props = defineProps<{ button: IToolbarButton }>()

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
      && isCaptionHidden.value)
    ? props.button.caption()
    : undefined)

const { isTabletLandscapeOrSmaller: isCaptionHidden } = WebBrowserUtils.getScreenSize()
</script>










<template>
  <Tooltip
    v-show="button.isVisible?.() ?? true"
    :apply-hover-style="false"
    :tooltip="tooltip"
  >
    <Button
      :class="buttonClasses"
      :disabled="button.isDisabled?.() ?? false"
      :outlined="outlined"
      :severity="button.variant?.()"
      class="toolbar-button"
      @click="button.action"
    >
      <font-awesome-icon :icon="button.icon()" />
      <span
        v-show="showCaptionInternal === 'always' || showCaptionInternal === 'auto'"
        :class="captionClasses"
      >
        {{ button.caption() }}
      </span>
    </Button>
  </Tooltip>
</template>










<style scoped>
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