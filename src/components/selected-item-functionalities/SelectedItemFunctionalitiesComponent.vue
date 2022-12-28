<template>
  <Button
    :key="selectedTab"
    v-tooltip.top="$t('caption.options')"
    class="selected-item-functionalities-button p-button-text p-button-sm button-discreet"
    @click="toggleFunctionalitiesPanel($event)"
  >
    <font-awesome-icon icon="cog" />
  </Button>

  <OverlayPanel
    ref="functionalitiesPanel"
    :dismissable="true"
  >
    <div :class="'selected-item-functionalities-panel-item selected-item-functionalities-panel-ignore-price' + (!editing ? ' p-disabled' : '')">
      <Checkbox
        v-model="ignorePriceValue"
        :disabled="!editing"
        :binary="true"
        class="selected-item-functionalities-panel-item-icon"
      />
      <span
        class="selected-item-functionalities-panel-ignore-price-text"
        @click="ignorePriceValue = !ignorePriceValue"
      >{{ $t('caption.ignorePrice') }}</span>
    </div>
    <div
      v-for="tabButton of tabButtons"
      :key="tabButton.label"
      class="selected-item-functionalities-panel-item"
      @click="tabButton.command()"
    >
      <font-awesome-icon
        :icon="tabButton.icon"
        class="selected-item-functionalities-panel-item-icon"
      />
      <span>{{ $t(tabButton.label) }}</span>
    </div>
  </OverlayPanel>
</template>

<script lang="ts" src="./SelectedItemFunctionalitiesComponent.ts" />
<style scoped lang="css" src="./SelectedItemFunctionalitiesComponent.css" />