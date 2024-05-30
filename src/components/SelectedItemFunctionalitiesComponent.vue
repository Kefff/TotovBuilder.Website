<template>
  <div class="selected-item-functionalities">
    <div v-if="canHaveContent">
      <Button
        v-tooltip.top="$t(modelSelectedTab !== SelectableTab.content ? 'caption.showContent' : 'caption.hideContent')"
        :class="'p-button-text p-button-sm' + (modelSelectedTab !== SelectableTab.content ? ' button-discreet' : '')"
        @click="setSelectedTab(SelectableTab.content)"
      >
        <font-awesome-icon icon="box-open" />
      </Button>
      <div
        v-if="contentCount > 0"
        class="selected-item-functionalities-count-chip"
      >
        {{ contentCount }}
      </div>
    </div>
    <div v-if="canHaveMods">
      <Button
        v-tooltip.top="$t(modelSelectedTab !== SelectableTab.mods ? 'caption.showMods' : 'caption.hideMods')"
        :class="'p-button-text p-button-sm' + (modelSelectedTab !== SelectableTab.mods ? ' button-discreet' : '')"
        @click="setSelectedTab(SelectableTab.mods)"
      >
        <font-awesome-icon icon="puzzle-piece" />
      </Button>
      <div
        v-if="modsCount > 0"
        class="selected-item-functionalities-count-chip"
      >
        {{ modsCount }}
      </div>
    </div>
    <div>
      <Button
        v-tooltip.top="$t('caption.showStatistics')"
        class="p-button-text p-button-sm button-discreet"
        @click="modelShowStats = !modelShowStats"
      >
        <font-awesome-icon icon="clipboard-list" />
      </Button>
    </div>
    <div v-if="editing && canBeLooted && canIgnorePrice">
      <Button
        v-tooltip.top="$t(!ignorePrice ? 'caption.ignorePrice' : 'caption.includePrice')"
        :class="'p-button-text p-button-sm' + (!ignorePrice ? ' button-discreet button-discreet-danger' : '')"
        severity="danger"
        @click="modelIgnorePrice = !modelIgnorePrice"
      >
        <font-awesome-icon icon="ban" />
      </Button>
    </div>
  </div>
</template>










<script setup lang="ts">
import { Ref, inject, watch } from 'vue'
import { SelectableTab } from '../models/utils/SelectableTab'

const modelIgnorePrice = defineModel<boolean>('ignorePrice')
const modelSelectedTab = defineModel<SelectableTab>('selectedTab')
const modelShowStats = defineModel<boolean>('showStats')

const props = withDefaults(
  defineProps<{
    canBeLooted: boolean,
    canHaveContent: boolean,
    canHaveMods: boolean,
    canIgnorePrice: boolean,
    contentCount?: number,
    ignorePrice: boolean,
    modsCount?: number
  }>(),
  {
    contentCount: 0,
    modsCount: 0
  })

const editing = inject<Ref<boolean>>('editing')

watch(() => props.canHaveContent, () => {
  if (!props.canHaveContent && modelSelectedTab.value === SelectableTab.content) {
    modelSelectedTab.value = props.canHaveMods ? SelectableTab.mods : SelectableTab.hidden
  }
})

watch(() => props.canHaveMods, () => {
  if (!props.canHaveMods && modelSelectedTab.value === SelectableTab.mods) {
    modelSelectedTab.value = props.canHaveContent ? SelectableTab.content : SelectableTab.hidden
  }
})

/**
 * Sets the selected tab.
 * If the same tab as the current selected tab, tabs are hidden.
 * @param newValue - New selected tab.
 */
function setSelectedTab(newValue: SelectableTab) {
  modelSelectedTab.value = modelSelectedTab.value !== newValue ? newValue : SelectableTab.hidden
}
</script>










<style scoped>
@import '../css/button.css';
@import '../css/icon.css';

.selected-item-functionalities {
  align-items: center;
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  margin-right: 4rem;
}

.selected-item-functionalities-count-chip {
  background-color: var(--primary-color);
  border-radius: 1rem;
  color: var(--text-color);
  font-size: 0.8rem;
  height: 1rem;
  position: absolute;
  text-align: center;
  transform: translate(0.875rem, 1.25rem);
  width: 1rem;
}

.selected-item-functionalities > div {
  display: flex;
  justify-content: center;
  margin-left: 0.3125rem;
  margin-right: 0.3125rem;
  width: 2.5rem;
}
</style>