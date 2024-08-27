<template>
  <div
    v-for="button of leftButtons"
    :key="button.name"
    class="sidebar-option"
  >
    <Button
      :disabled="button.isDisabled?.() ?? false"
      :outlined="button.style?.() === 'outlined' || button.style?.() === 'discreet'"
      :severity="button.variant?.()"
      class="toolbar-sidebar-button"
      :class="{
        'button-discreet': button.style?.() === 'discreet'
      }"
      @click="() => executeAction(button.action)"
    >
      <font-awesome-icon
        :icon="button.icon()"
        class="icon-before-text"
      />
      <span>{{ button.caption() }}</span>
    </Button>
  </div>
  <div class="sidebar-title" />
  <div
    v-for="button of rightButtons"
    :key="button.name"
    class="sidebar-option"
  >
    <Button
      :disabled="button.isDisabled?.() ?? false"
      :outlined="button.style?.() === 'outlined' || button.style?.() === 'discreet'"
      :severity="button.variant?.()"
      class="toolbar-sidebar-button"
      :class="{
        'button-discreet': button.style?.() === 'discreet',
        'p-button-text': button.style?.() === 'discreet'
      }"
      @click="() => executeAction(button.action)"
    >
      <font-awesome-icon
        :icon="button.icon()"
        class="icon-before-text"
      />
      <span>{{ button.caption() }}</span>
    </Button>
  </div>
</template>










<script setup lang="ts">
import { computed } from 'vue'
import { ToolbarSidebarParameters } from '../../models/utils/IGlobalSidebarOptions'
import { GlobalSidebarService } from '../../services/GlobalSidebarService'
import Services from '../../services/repository/Services'

const modelParameters = defineModel<ToolbarSidebarParameters>('parameters', { required: true })

const _globalSidebarService = Services.get(GlobalSidebarService)

const leftButtons = computed(() => modelParameters.value.filter(b => (b.position?.() ?? 'left') === 'left' && (b.isVisible?.() ?? true)))
const rightButtons = computed(() => modelParameters.value.filter(b => (b.position?.() ?? 'left') === 'right' && (b.isVisible?.() ?? true)))

/**
 * Execute a button action and closes the sidebar.
 */
function executeAction(action: () => void) {
  action()
  _globalSidebarService.close('ToolbarSidebar')
}
</script>










<style scoped>
@import '../../css/button.css';
@import '../../css/sidebar.css';

.toolbar-sidebar-button {
  align-items: center;
  display: flex;
  justify-content: center;
  width: 100%;
}
</style>