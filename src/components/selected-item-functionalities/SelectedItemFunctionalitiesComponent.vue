<template>
  <div class="selected-item-functionalities">
    <div>
      <Button
        v-if="canHaveContent"
        v-tooltip.top="$t(selectedTabValue !== SelectableTab.content ? 'caption.showContent' : 'caption.hideContent')"
        :class="'p-button-text p-button-sm' + (selectedTabValue !== SelectableTab.content ? ' button-discreet' : '')"
        @click="setSelectedTab(SelectableTab.content)"
      >
        <font-awesome-icon icon="box-open" />
      </Button>
      <div
        v-if="(contentCount ?? 0) > 0"
        class="selected-item-functionalities-count-chip"
      >
        {{ contentCount }}
      </div>
    </div>
    <div>
      <Button
        v-if="canHaveMods"
        v-tooltip.top="$t(selectedTabValue !== SelectableTab.mods ? 'caption.showMods' : 'caption.hideMods')"
        :class="'p-button-text p-button-sm' + (selectedTabValue !== SelectableTab.mods ? ' button-discreet' : '')"
        @click="setSelectedTab(SelectableTab.mods)"
      >
        <font-awesome-icon icon="puzzle-piece" />
      </Button>
      <div
        v-if="(modsCount ?? 0) > 0"
        class="selected-item-functionalities-count-chip"
      >
        {{ modsCount }}
      </div>
    </div>
    <Button
      v-tooltip.top="$t('caption.showStatistics')"
      class="p-button-text p-button-sm button-discreet"
      @click="toggleStats()"
    >
      <font-awesome-icon icon="clipboard-list" />
    </Button>
    <Button
      v-if="editing && canBeLooted"
      v-tooltip.top="$t(!ignorePrice ? 'caption.ignorePrice' : 'caption.includePrice')"
      :class="'p-button-text p-button-sm' + (!ignorePrice ? ' button-discreet button-discreet-danger' : '')"
      severity="danger"
      @click="ignorePriceValue = !ignorePriceValue"
    >
      <font-awesome-icon icon="ban" />
    </Button>
  </div>
</template>

<script lang="ts" src="./SelectedItemFunctionalitiesComponent.ts" />
<style scoped lang="css" src="./SelectedItemFunctionalitiesComponent.css" />