<template>
  <div style="display: flex; flex-direction: row;">
    <Button
      v-if="canHaveContent"
      v-tooltip.top="$t('caption.showContent')"
      :class="'p-button-text p-button-sm' + (selectedTabValue !== SelectableTab.content ? ' button-discreet' : '')"
      @click="setSelectedTab(SelectableTab.content)"
    >
      <font-awesome-icon icon="box-open" />
    </Button>
    <Button
      v-if="canHaveMods"
      v-tooltip.top="$t('caption.showMods')"
      :class="'p-button-text p-button-sm' + (selectedTabValue !== SelectableTab.mods ? ' button-discreet' : '')"
      @click="setSelectedTab(SelectableTab.mods)"
    >
      <font-awesome-icon icon="puzzle-piece" />
    </Button>
    <Button
      v-tooltip.top="$t('caption.showStatistics')"
      :class="'p-button-text p-button-sm' + (selectedTabValue !== SelectableTab.stats ? ' button-discreet' : '')"
      @click="setSelectedTab(SelectableTab.stats)"
    >
      <font-awesome-icon icon="clipboard-list" />
    </Button>
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
  </div>
</template>

<script
  lang="ts"
  src="./SelectedItemFunctionalitiesComponent.ts"
/>
<style
  scoped
  lang="css"
  src="./SelectedItemFunctionalitiesComponent.css"
/>