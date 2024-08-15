<template>
  <div class="selected-item-functionalities">
    <div v-if="canHaveContent">
      <Tooltip
        :tooltip="$t(modelSelectedTab !== SelectableTab.content ? 'caption.showContent' : 'caption.hideContent')"
        :apply-hover-style="false"
      >
        <Button
          :class="'p-button-text p-button-sm' + (modelSelectedTab !== SelectableTab.content ? ' button-discreet' : '')"
          @click="setSelectedTab(SelectableTab.content)"
        >
          <font-awesome-icon icon="box-open" />
        </Button>
      </Tooltip>
      <div
        v-if="contentCount > 0"
        class="selected-item-functionalities-count-chip"
      >
        {{ contentCount }}
      </div>
    </div>
    <div v-if="canHaveMods">
      <Tooltip
        :tooltip="$t(modelSelectedTab !== SelectableTab.mods ? 'caption.showMods' : 'caption.hideMods')"
        :apply-hover-style="false"
      >
        <Button
          :class="'p-button-text p-button-sm' + (modelSelectedTab !== SelectableTab.mods ? ' button-discreet' : '')"
          @click="setSelectedTab(SelectableTab.mods)"
        >
          <font-awesome-icon icon="puzzle-piece" />
        </Button>
      </Tooltip>
      <div
        v-if="modsCount > 0"
        class="selected-item-functionalities-count-chip"
      >
        {{ modsCount }}
      </div>
    </div>
    <div>
      <Tooltip
        :tooltip="$t('caption.showDetails')"
        :apply-hover-style="false"
      >
        <Button
          class="p-button-text p-button-sm button-discreet"
          @click="onShowDetailsClick()"
        >
          <font-awesome-icon icon="clipboard-list" />
        </Button>
      </Tooltip>
    </div>
    <div v-if="isEditing && canBeLooted && canIgnorePrice">
      <Tooltip
        :tooltip="$t(!ignorePrice ? 'caption.ignorePrice' : 'caption.includePrice')"
        :apply-hover-style="false"
      >
        <Button
          :class="'p-button-text p-button-sm' + (!ignorePrice ? ' button-discreet button-discreet-danger' : '')"
          severity="danger"
          @click="modelIgnorePrice = !modelIgnorePrice"
        >
          <font-awesome-icon icon="ban" />
        </Button>
      </Tooltip>
    </div>
  </div>
</template>










<script setup lang="ts">
import { Ref, inject, watch } from 'vue'
import { IItem } from '../models/item/IItem'
import { SelectableTab } from '../models/utils/SelectableTab'
import { GlobalSidebarService } from '../services/GlobalSidebarService'
import Services from '../services/repository/Services'

const modelIgnorePrice = defineModel<boolean>('ignorePrice')
const modelSelectedTab = defineModel<SelectableTab>('selectedTab')

const props = withDefaults(
  defineProps<{
    canBeLooted: boolean,
    canHaveContent: boolean,
    canHaveMods: boolean,
    canIgnorePrice: boolean,
    contentCount?: number,
    ignorePrice: boolean,
    item: IItem,
    modsCount?: number
  }>(),
  {
    contentCount: 0,
    modsCount: 0
  })

const isEditing = inject<Ref<boolean>>('isEditing')

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
 * Reacts to the click on the "Show details" button.
 *
 * Opens the stats sidebar.
 */
function onShowDetailsClick() {
  Services.get(GlobalSidebarService).display({
    displayedComponentType: 'StatsSidebar',
    displayedComponentParameters: props.item,
    position: 'right'
  })
}

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
  position: relative;
}

.selected-item-functionalities-count-chip {
  background-color: var(--primary-color);
  border-radius: 1rem;
  color: var(--text-color);
  flex-shrink: 0;
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
  margin-left: 0.125rem;
  width: 3rem;
}

.selected-item-functionalities > div:first-child {
  margin-left: 0;
}
</style>