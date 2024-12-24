<script setup lang="ts">
import { computed, watch } from 'vue'
import { IItem } from '../models/item/IItem'
import { SelectableTab } from '../models/utils/SelectableTab'
import vueI18n from '../plugins/vueI18n'
import Tooltip from './TooltipComponent.vue'

const modelSelectedTab = defineModel<SelectableTab>('selectedTab')

const props = withDefaults(
  defineProps<{
    canBeLooted: boolean,
    canHaveContent: boolean,
    canHaveMods: boolean,
    canIgnorePrice: boolean,
    contentCount?: number,
    item: IItem,
    modsCount?: number
  }>(),
  {
    contentCount: 0,
    modsCount: 0
  })

const contentButtonCaption = computed(() => modelSelectedTab.value !== SelectableTab.mods
  ? vueI18n.t('caption.showContent')
  : vueI18n.t('caption.hideContent'))
const modsButtonCaption = computed(() => modelSelectedTab.value !== SelectableTab.mods
  ? vueI18n.t('caption.showMods')
  : vueI18n.t('caption.hideMods'))

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
function setSelectedTab(newValue: SelectableTab): void {
  modelSelectedTab.value = modelSelectedTab.value !== newValue ? newValue : SelectableTab.hidden
}
</script>










<template>
  <div class="selected-item-functionalities">
    <div v-if="canHaveContent">
      <Tooltip
        :tooltip="contentButtonCaption"
        :apply-hover-style="false"
      >
        <Button
          :class="{
            'selected-item-functionalities-button-active': modelSelectedTab === SelectableTab.content,
            'button-discreet': modelSelectedTab !== SelectableTab.content
          }"
          class="p-button-text p-button-sm"
          @click="setSelectedTab(SelectableTab.content)"
        >
          <font-awesome-icon icon="box-open" />
          <span class="selected-item-functionalities-button-caption">
            {{ $t('caption.content') }}{{ contentCount > 0 ? ` (${contentCount})` : '' }}
          </span>
        </Button>
      </Tooltip>
    </div>
    <div v-if="canHaveMods">
      <Tooltip
        :tooltip="modsButtonCaption"
        :apply-hover-style="false"
      >
        <Button
          :class="{
            'selected-item-functionalities-button-active': modelSelectedTab === SelectableTab.mods,
            'button-discreet': modelSelectedTab !== SelectableTab.mods
          }"
          class="p-button-text p-button-sm"
          @click="setSelectedTab(SelectableTab.mods)"
        >
          <font-awesome-icon icon="puzzle-piece" />
          <span class="selected-item-functionalities-button-caption">
            {{ $t('caption.mods') }}{{ modsCount > 0 ? ` (${modsCount})` : '' }}
          </span>
        </Button>
      </Tooltip>
    </div>
  </div>
</template>










<style scoped>
.selected-item-functionalities {
  align-items: center;
  display: flex;
  flex-wrap: nowrap;
}

.selected-item-functionalities > div {
  display: flex;
  justify-content: center;
}

.selected-item-functionalities-button-active {
  background-color: var(--primary-color6);
  color: var(--text-color);
}

.selected-item-functionalities-button-caption {
  margin-left: 0.25rem;
}
</style>