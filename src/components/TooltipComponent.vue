<template>
  <span
    v-if="tooltip != null"
    v-tooltip:[directiveArguments]="tooltip"
    :class="applyHoverStyle ? 'tooltip' : ''"
    :tabindex="isTouchScreen ? 9999 : undefined"
    @click="onClick($event)"
  >
    <slot />
  </span>
  <span v-else>
    <slot />
  </span>
</template>










<script setup lang="ts">
import { computed } from 'vue'
import { DirectiveArguments } from '../models/utils/TootipDirectiveArguments'

const props = withDefaults(
  defineProps<{
    applyHoverStyle?: boolean,
    position?: 'bottom' | 'left' | 'right' | 'top',
    stopClickPropagation?: boolean,
    tooltip?: string
  }>(),
  {
    applyHoverStyle: true,
    position: 'top',
    stopClickPropagation: false,
    tooltip: undefined
  })

// cf. https://stackoverflow.com/a/63666289
const isTouchScreen = matchMedia('(hover: none)').matches

// cf. https://github.com/primefaces/primevue/issues/2255#issuecomment-1073903453
const directiveArguments = computed(() => new DirectiveArguments(props.position, isTouchScreen ? 'focus' : undefined))

/**
 * Reacts to the click on the element the tooltip is attached to.
 */
function onClick(event: MouseEvent) {
  if (props.stopClickPropagation) {
    event.stopPropagation()
  }
}
</script>










<style scoped>
.tooltip:hover {
  opacity: 50%;
}
</style>

<style>
.p-tooltip {
  z-index: 999;
}
</style>