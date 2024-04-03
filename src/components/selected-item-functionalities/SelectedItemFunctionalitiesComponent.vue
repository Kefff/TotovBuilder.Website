<template>
  <div class="selected-item-functionalities">
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
    <Button
      v-if="editing && canBeLooted"
      v-tooltip.top="$t('caption.ignorePrice')"
      :class="'p-button-text p-button-sm' + (!ignorePrice ? ' button-discreet button-discreet-danger' : '')"
      severity="danger"
      @click="ignorePriceValue = !ignorePriceValue"
    >
      <font-awesome-icon icon="ban" />
    </Button>
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