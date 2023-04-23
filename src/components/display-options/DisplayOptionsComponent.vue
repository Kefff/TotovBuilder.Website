<template>
  <Button
    v-tooltip.top="$t('caption.displayOptions')"
    class="p-button-text p-button-sm button-discreet"
    @click="sidebarVisibleInternal = true"
  >
    <font-awesome-icon
      icon="tv"
    />
  </Button>

  <Sidebar
    v-model:visible="sidebarVisibleInternal"
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
      <LanguageSelector />
    </div>
    <slot name="additional-options" />
  </Sidebar>
</template>

<script lang="ts" src="./DisplayOptionsComponent.ts" />
<style scoped lang="css" src="./DisplayOptionsComponent.css" />