<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { IGlobalSidebarOptions } from '../models/utils/IGlobalSidebarOptions'
import { GlobalSidebarComponentService } from '../services/components/GlobalSidebarComponentService'
import GeneralOptions from './general-options/GeneralOptionsComponent.vue'
import MerchantItemsOptions from './merchant-items-options/MerchantItemsOptionsComponent.vue'
import ShoppingList from './shopping-list/ShoppingListComponent.vue'
import Services from '../services/repository/Services'

const globalSidebarComponentService = Services.get(GlobalSidebarComponentService)

const displayableComponents: Record<string, unknown> = {
  GeneralOptions,
  MerchantItemsOptions,
  ShoppingList
}

const visible = computed({
  get: () => _visible.value,
  set: (value: boolean) => {
    _visible.value = value

    if (!_visible.value) {
      onGlobalSidebarClose()
    }
  }
})
const currentDisplayedComponent = computed(() => displayableComponents[options.value?.displayedComponentType ?? ''])

const _visible = ref(false)
const options = ref<IGlobalSidebarOptions>()

onMounted(() => {
  globalSidebarComponentService.emitter.on(GlobalSidebarComponentService.closeGlobalSidebarEvent, onGlobalSidebarClose)
  globalSidebarComponentService.emitter.on(GlobalSidebarComponentService.openGlobalSidebarEvent, onGlobalSidebarOpen)
})

onUnmounted(() => {
  globalSidebarComponentService.emitter.off(GlobalSidebarComponentService.closeGlobalSidebarEvent, onGlobalSidebarClose)
  globalSidebarComponentService.emitter.off(GlobalSidebarComponentService.openGlobalSidebarEvent, onGlobalSidebarOpen)
})

/**
 * Closes the global sidebard.
 */
function onGlobalSidebarClose() {
  globalSidebarComponentService.executeOnClosingActions()
  _visible.value = false
}

/**
 * Displays the global sidebar
 */
function onGlobalSidebarOpen(openingOptions: IGlobalSidebarOptions) {
  visible.value = true
  options.value = openingOptions
}
</script>



<template>
  <Sidebar
    v-model:visible="visible"
    :block-scroll="true"
    :modal="true"
    :position="options?.position"
    style="max-width: 100vw; width: auto;"
  >
    <template #header>
      <div class="global-sidebar-spacer" />
    </template>
    <component
      :is="currentDisplayedComponent"
      v-if="currentDisplayedComponent != null"
      :parameters="options?.displayedComponentParameters"
    />
  </sidebar>
</template>



<style scoped>
.global-sidebar-spacer {
  width: 100%;
}
</style>