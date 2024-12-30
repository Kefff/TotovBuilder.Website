<script setup lang="ts">
import { computed, inject, Ref, watch } from 'vue'
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
    containsBaseItem: boolean,
    contentCount?: number,
    item: IItem,
    modsCount?: number
  }>(),
  {
    contentCount: 0,
    modsCount: 0
  })

const isEditing = inject<Ref<boolean>>('isEditing')

const contentButtonCaption = computed(() => modelSelectedTab.value !== SelectableTab.content
  ? vueI18n.t('caption.showContent')
  : vueI18n.t('caption.hideContent'))
const modsButtonCaption = computed(() => modelSelectedTab.value !== SelectableTab.mods
  ? vueI18n.t('caption.showMods')
  : vueI18n.t('caption.hideMods'))
const modsButtonOrder = computed(() => {
  if (modelSelectedTab.value === SelectableTab.mods) {
    return '0'
  }

  return '2'
})

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
  <div
    v-show="(canHaveContent && (contentCount > 0 || isEditing))
      || (canHaveMods && (modsCount > 0 || containsBaseItem || isEditing))"
    class="selected-item-functionalities"
  >
    <div
      v-show="canHaveContent && (contentCount > 0 || isEditing)"
      class="selected-item-button-content"
    >
      <Tooltip
        :tooltip="contentButtonCaption"
        :apply-hover-style="false"
      >
        <Button
          :class="{
            'selected-item-functionalities-button-active': modelSelectedTab === SelectableTab.content,
            'button-discreet': modelSelectedTab !== SelectableTab.content,
            'p-button-text': modelSelectedTab !== SelectableTab.content
          }"
          class="p-button-sm"
          :outlined="modelSelectedTab === SelectableTab.content"
          @click="setSelectedTab(SelectableTab.content)"
        >
          <font-awesome-icon icon="box-open" />
          <span class="selected-item-functionalities-button-caption">
            {{ $t('caption.content') }}{{ contentCount > 0 ? ` (${contentCount})` : '' }}
          </span>
        </Button>
      </Tooltip>
    </div>
    <div
      v-show="canHaveMods && (modsCount > 0 || containsBaseItem || isEditing)"
      class="selected-item-button-mods"
    >
      <Tooltip
        :tooltip="modsButtonCaption"
        :apply-hover-style="false"
      >
        <Button
          :class="{
            'selected-item-functionalities-button-active': modelSelectedTab === SelectableTab.mods,
            'button-discreet': modelSelectedTab !== SelectableTab.mods,
            'p-button-text': modelSelectedTab !== SelectableTab.mods
          }"
          class="p-button-sm"
          :outlined="modelSelectedTab === SelectableTab.mods"
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
.selected-item-button-content {
  order: 1;
}

.selected-item-button-mods {
  order: v-bind(modsButtonOrder);
}

.selected-item-functionalities {
  align-items: center;
  display: flex;
  gap: 0.5rem;
  margin-top: 0.25rem;
}

.selected-item-functionalities > div {
  display: flex;
  justify-content: center;
}

.selected-item-functionalities-button-active {
  background-color: var(--primary-color8);
}

.selected-item-functionalities-button-caption {
  margin-left: 0.25rem;
}
</style>