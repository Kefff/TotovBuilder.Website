<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { GlobalSidebarService } from '../services/GlobalSidebarService'
import Services from '../services/repository/Services'
import WebBrowserUtils from '../utils/WebBrowserUtils'

const props = withDefaults(
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

const _globalSidebarService = Services.get(GlobalSidebarService)

const trigger = computed(() =>
  isTouchScreen.value
    ? 'click'
    : 'hover')

const isTouchScreen = WebBrowserUtils.isTouchScreen()
const shown = ref(false)

onMounted(() => {
  if (isTouchScreen.value) {
    _globalSidebarService.emitter.on(GlobalSidebarService.openGlobalSidebarEvent, onGlobalSidebarOpen)
  }
})

onUnmounted(() => {
  if (isTouchScreen.value) {
    _globalSidebarService.emitter.off(GlobalSidebarService.openGlobalSidebarEvent, onGlobalSidebarOpen)
  }
})

/**
 * Reacts to the click on the element the tooltip is attached to.
 */
function onClick(event: MouseEvent): void {
  emits('click', event)
}

/**
 * Reacts to a sidebar being opened.
 *
 * Hides the tooltip
 */
function onGlobalSidebarOpen(): void {
  if (props.tooltip != null) {
    // Adding a small timeout before hidding the tooltip in case is was not yet visible when the sidebar is opened
    setTimeout(() => shown.value = false, 50)
  }
}
</script>










<template>
  <VTooltip
    v-if="tooltip != null"
    v-model:shown="shown"
    :auto-hide="true"
    :class="{ 'tooltip': applyHoverStyle }"
    :triggers="[trigger]"
    :delay="0"
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