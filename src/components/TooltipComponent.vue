<script setup lang="ts">
import { computed } from 'vue'
import WebBrowserUtils from '../utils/WebBrowserUtils'

withDefaults(
  defineProps<{
    applyHoverStyle?: boolean,
    disabledOnMobile?: boolean,
    tooltip?: string
  }>(),
  {
    applyHoverStyle: true,
    disabledOnMobile: false,
    tooltip: undefined
  })

const emits = defineEmits<{
  click: [event: MouseEvent]
}>()

const trigger = computed(() =>
  isTouchScreen.value
    ? 'click'
    : 'hover')

const isTouchScreen = WebBrowserUtils.isTouchScreen()

/**
 * Reacts to the click on the element the tooltip is attached to.
 */
function onClick(event: MouseEvent): void {
  emits('click', event)
}
</script>










<template>
  <VTooltip
    v-if="tooltip != null"
    :auto-hide="true"
    :class="{ 'tooltip': applyHoverStyle }"
    :triggers="[trigger]"
    @click="onClick"
  >
    <slot />
    <template #popper>
      <span class="tooltip-popper">
        {{ tooltip }}
      </span>
    </template>
  </VTooltip>
  <slot v-else />
</template>










<style scoped>
.tooltip:hover {
  opacity: 50%;
}

.tooltip-popper {
  white-space: preserve;
}
</style>










<style>
.v-popper--theme-tooltip .v-popper__inner {
  background-color: var(--surface-100) !important;
  border-color: var(--primary-color);
  border-style: solid;
  border-width: 1px;
  font-size: 0.85rem;
}

.v-popper--theme-tooltip .v-popper__arrow-outer {
  border-color: var(--primary-color) !important;
}
</style>