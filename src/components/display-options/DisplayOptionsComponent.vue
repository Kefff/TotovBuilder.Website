<template>
  <div
    class="display-options-button"
    @click="display()"
  >
    <slot name="button">
      <Button
        v-tooltip.top="$t('caption.displayOptions')"
        class="p-button-text p-button-sm button-discreet"
      >
        <font-awesome-icon icon="tv" />
      </Button>
    </slot>
  </div>

  <Sidebar
    v-model:visible="sidebarVisible"
    position="right"
    style="width: auto"
  >
    <div class="sidebar-title">
      <font-awesome-icon
        icon="tv"
        class="icon-before-text"
      />
      <span>{{ $t('caption.displayOptions') }}</span>
    </div>
    <div class="sidebar-option">
      <LanguageSelector @changed="sidebarVisible = false" />
    </div>
    <slot name="additional-options" />
  </Sidebar>
</template>

<script lang="ts" src="./DisplayOptionsComponent.ts" />
<style scoped lang="css" src="./DisplayOptionsComponent.css" />