<script setup lang="ts">
import { computed, nextTick, onMounted, onUnmounted, ref, watch } from 'vue'
import { GlobalSidebarService } from '../services/GlobalSidebarService'
import Services from '../services/repository/Services'
import WebBrowserUtils from '../utils/WebBrowserUtils'

const props = withDefaults(
  defineProps<{
    applyHoverStyle?: boolean,
    disabledOnMobile?: boolean,
    fullSize?: boolean,
    tooltip?: string
  }>(),
  {
    applyHoverStyle: true,
    disabledOnMobile: false,
    fullSize: false,
    tooltip: undefined
  })

const emits = defineEmits<{
  click: [event: MouseEvent]
}>()

const _globalSidebarService = Services.get(GlobalSidebarService)

const trigger = computed(() =>
  isTouchScreen.value && !props.disabledOnMobile
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

watch(
  () => shown.value,
  () => {
    if (shown.value
      && (props.tooltip == null
        || props.tooltip === '')) {
      close()
    }
  })

function close(useDelay: boolean = false): void {
  if (useDelay) {
    // Adding a small timeout before hidding the tooltip in case it was not yet visible
    setTimeout(() => shown.value = false, 50)
  } else {
    nextTick(() => shown.value = false)
  }
}

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
    close(true)
  }
}
</script>










<template>
  <div
    class="tooltip-container"
    :class="{ 'tooltip-container-full-size': fullSize }"
  >
    <!-- Parent div is required otherwise the tooltip does sometimes not trigger on certain elements -->
    <VTooltip
      v-model:shown="shown"
      :auto-hide="true"
      :distance="10"
      :class="{
        'tooltip': applyHoverStyle,
        'tooltip-full-size': fullSize
      }"
      :triggers="[trigger]"
      :delay="0"
      @click="onClick"
    >
      <div class="tooltip-content">
        <slot />
      </div>

      <template #popper>
        <span class="tooltip-popper">
          {{ tooltip }}
        </span>
      </template>
    </VTooltip>
  </div>
</template>










<style scoped>
.tooltip:hover {
  opacity: 50%;
}

.tooltip-container {
  display: flex;
}

.tooltip-container-full-size {
  height: 100%;
  width: 100%;
}

.tooltip-full-size {
  height: 100%;
  width: 100%;
}

.tooltip-content {
  align-items: center;
  display: flex;
  height: 100%;
  width: 100%;
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