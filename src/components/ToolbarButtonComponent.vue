<template>
  <Tooltip
    v-show="button.isVisible?.() ?? true"
    :apply-hover-style="false"
    :tooltip="$t(tooltip)"
    :position="button.tooltipPosition?.()"
  >
    <Button
      class="toolbar-button"
      :class="buttonClasses"
      :disabled="button.isDisabled?.() ?? false"
      :severity="button.variant?.()"
      :outlined="outlined"
      @click="button.action"
    >
      <font-awesome-icon
        :icon="button.icon()"
        :class="{ 'icon-before-text': showCaptionInternal }"
      />
      <span v-show="showCaptionInternal">{{ $t(button.caption()) }}</span>
    </Button>
  </Tooltip>
</template>










<script setup lang="ts">
import { computed } from 'vue'
import { IToolbarButton } from '../models/utils/IToolbarButton'

const props = defineProps<{ button: IToolbarButton }>()

const buttonClasses = computed(() => ({
  'button-discreet-danger': props.button.style?.() === 'discreet' && props.button.variant?.() === 'danger',
  'button-discreet': props.button.style?.() === 'discreet',
  'p-button-sm': props.button.style?.() === 'discreet',
  'p-button-text': props.button.style?.() === 'discreet'
}))
const showCaptionInternal = computed(() => props.button.showCaption?.() ?? true)
const outlined = computed(() => props.button.style?.() === 'outlined')
const tooltip = computed(() => !showCaptionInternal.value ? props.button.caption() : '')
</script>










<style scoped>
@import '../css/button.css';

.toolbar-button {
  height: 2.75rem;
  min-width: 2.75rem !important;
}
</style>