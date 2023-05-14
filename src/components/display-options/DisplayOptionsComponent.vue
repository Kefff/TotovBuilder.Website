<template>
  <slot name="button" />

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