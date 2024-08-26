<template>
  <span
    v-if="tooltip != null"
    v-tooltip:[directiveArguments]="tooltip"
    :class="applyHoverStyle ? 'tooltip' : ''"
    :tabindex="_isTouchScreen ? 9999 : undefined"
    @click="onClick($event)"
  >
    <slot />
  </span>
  <slot v-else />
</template>










<script setup lang="ts">
import { computed, inject } from 'vue'
import { DirectiveArguments } from '../models/utils/TooltipDirectiveArguments'

const emits = defineEmits<{
  click: [event: MouseEvent]
}>()

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

const _isTouchScreen = inject<boolean>('isTouchScreen')

// cf. https://github.com/primefaces/primevue/issues/2255#issuecomment-1073903453
const directiveArguments = computed(() => new DirectiveArguments(props.position, _isTouchScreen ? 'focus' : undefined))

/**
 * Reacts to the click on the element the tooltip is attached to.
 */
function onClick(event: MouseEvent) {
  if (props.stopClickPropagation) {
    event.stopPropagation()
  }

  emits('click', event)
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