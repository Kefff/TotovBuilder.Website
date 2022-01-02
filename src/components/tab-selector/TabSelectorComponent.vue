<template>
  <Button
    :key="selectedTab"
    v-tooltip.top="$t('caption.' + selectedTab)"
    class="tab-selector-button"
    @click="toggleTabsPanel"
  >
    <font-awesome-icon
      :icon="selectedTabIcon"
    />
  </Button>
  <OverlayPanel
    ref="tabsPanel"
    :dismissable="true"
  >
    <div
      v-for="tabsPanelItem of tabsPanelItems"
      :key="tabsPanelItem.label"
      class="tab-selector-panel-item"
      @click="tabsPanelItem.command()"
    >
      <font-awesome-icon
        :icon="tabsPanelItem.icon"
        class="icon-before-text"
      />
      <span>{{ $t(tabsPanelItem.label) }}</span>
    </div>
  </OverlayPanel>
</template>

<script lang="ts" src="./TabSelectorComponent.ts" />
<style scoped lang="css" src="./TabSelectorComponent.css" />