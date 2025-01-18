<script setup lang="ts">
import { computed } from 'vue'
import { DirectiveArguments } from '../models/utils/UI/TooltipDirectiveArguments'
import WebBrowserUtils from '../utils/WebBrowserUtils'

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

const emits = defineEmits<{
  click: [event: MouseEvent]
}>()


const directiveArguments = computed(() =>
  // cf. https://github.com/primefaces/primevue/issues/2255#issuecomment-1073903453
  new DirectiveArguments(props.position, isTouchScreen?.value
    ? 'focus'
    : undefined))

const isTouchScreen = WebBrowserUtils.isTouchScreen()

/**
 * Reacts to the click on the element the tooltip is attached to.
 */
function onClick(event: MouseEvent): void {
  if (props.stopClickPropagation) {
    event.stopPropagation()
  }

  emits('click', event)
}
</script>










<template>
  <span
    v-if="tooltip != null"
    v-tooltip:[directiveArguments]="tooltip"
    :class="{ 'tooltip': applyHoverStyle }"
    :tabindex="isTouchScreen ? 9999 : undefined"
    @click="onClick($event)"
  >
    <slot />
  </span>
  <slot v-else />
</template>










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