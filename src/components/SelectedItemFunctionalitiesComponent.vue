<script setup lang="ts">
import { computed, inject, Ref, watch } from 'vue'
import { IItem } from '../models/item/IItem'
import { SelectableTab } from '../models/utils/UI/SelectableTab'
import vueI18n from '../plugins/vueI18n'
import Tooltip from './TooltipComponent.vue'

const modelSelectedTab = defineModel<SelectableTab>('selectedTab', { required: true })

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

const buttonBorderBottomRadius = computed(() => {
  if (!props.canHaveContent || !props.canHaveMods) {
    return '6px'
  } else {
    return '0'
  }
})
const buttonsBorderBottomStyle = computed(() => modelSelectedTab.value === SelectableTab.hidden ? 'none' : 'solid')
const buttonsBorderBottomLeftRadius = computed(() => {
  if (!props.canHaveContent || !props.canHaveMods) {
    return '6px'
  } else if (modelSelectedTab.value === SelectableTab.content) {
    return '6px'
  } else {
    return '0'
  }
})
const buttonsBorderBottomRightRadius = computed(() => {
  if (!props.canHaveContent || !props.canHaveMods) {
    return '6px'
  } else if (modelSelectedTab.value === SelectableTab.mods) {
    return '6px'
  } else {
    return '0'
  }
})
const contentButtonCaption = computed(() => modelSelectedTab.value !== SelectableTab.content
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
  <div
    v-show="(canHaveContent && (contentCount > 0 || isEditing))
      || (canHaveMods && (modsCount > 0 || containsBaseItem || isEditing))"
    class="selected-item-functionalities"
  >
    <div class="selected-item-functionalities-buttons">
      <div
        v-show="canHaveContent && (contentCount > 0 || isEditing)"
        class="selected-item-button-content"
      >
        <Tooltip
          :apply-hover-style="false"
          :disabled-on-mobile="true"
          :tooltip="contentButtonCaption"
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
          :apply-hover-style="false"
          :disabled-on-mobile="true"
          :tooltip="modsButtonCaption"
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
  </div>
</template>










<style scoped>
.selected-item-functionalities {
  align-items: center;
  display: flex;
  gap: 0.5rem;
  margin-top: 0.25rem;
}

.selected-item-button-content button {
  border-color: var(--primary-color6);
  border-bottom-right-radius: v-bind(buttonBorderBottomRadius);
  border-bottom-style: none;
}

.selected-item-button-mods button {
  border-color: var(--primary-color6);
  border-bottom-left-radius: v-bind(buttonBorderBottomRadius);
  border-bottom-style: none;
}

.selected-item-functionalities-buttons {
  align-items: center;
  border-bottom-color: var(--primary-color6);
  border-bottom-style: v-bind(buttonsBorderBottomStyle);
  border-bottom-width: 1px;
  border-bottom-left-radius: v-bind(buttonsBorderBottomLeftRadius);
  border-bottom-right-radius: v-bind(buttonsBorderBottomRightRadius);
  display: flex;
  gap: 0.5rem;
}

.selected-item-functionalities-button-active {
  background-color: var(--primary-color8);
}

.selected-item-functionalities-button-caption {
  margin-left: 0.25rem;
}
</style>

<style>
.selected-item-functionalities-buttons .p-button.p-button-outlined:enabled:hover {
  border-bottom-style: none;
  border-color: var(--primary-color6);
}
</style>