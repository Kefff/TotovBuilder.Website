<script setup lang="ts">
import { computed, inject, Ref } from 'vue'
import { IInventoryItem } from '../models/build/IInventoryItem'
import WebBrowserUtils from '../utils/WebBrowserUtils'

const props = defineProps<{
  inventoryItems: (IInventoryItem | undefined)[],
  index: number
  mode: 'addContent' | 'baseItem' | 'content' | 'magazineContent' | 'mods',
}>()

const _bottomTopOffset = '12px'
const _middleHeight = '1.5625rem'

const isEditing = inject<Ref<boolean>>('isEditing')

const bottomHeight = computed(() => `calc(100% - ${upperHeight.value} - ${_middleHeight} + ${_bottomTopOffset})`)
const bottomTop = computed(() => `calc(${upperHeight.value} + ${_middleHeight} - ${_bottomTopOffset})`)
const displayBottomPart = computed(() => {
  const result = props.index !== lastHierarchyInventoryItemIndex.value
    || props.mode === 'baseItem'
    || (props.mode === 'content' && isEditing?.value)

  return result
})
const indicatorWidth = computed(() => isCompactMode.value ? '0.75rem' : '1.75rem')
const isVisible = computed(() => props.inventoryItems[props.index] != null || isEditing?.value)
const lastHierarchyInventoryItemIndex = computed(() => {
  let lastIndex = 0

  for (let i = 0; i < props.inventoryItems.length; i++) {
    if ((!isEditing?.value && props.inventoryItems[i] != null)
      || (isEditing?.value && i === props.inventoryItems.length - 1)
    ) {
      lastIndex = i
    }
  }

  return lastIndex
})
const upperHeight = computed(() => {
  if (props.mode === 'baseItem'
    || (props.mode === 'mods' && props.index === 0)
  ) {
    return '2.5rem'
  } else if (props.mode === 'mods') {
    return '3.5rem'
  } else if (props.mode === 'addContent'
    || (props.index === 0
      && (props.mode === 'content'
        || props.mode === 'magazineContent'))) {
    return '1rem'
  } else {
    return '2.25rem'
  }
})

const { isSmartphonePortrait: isCompactMode } = WebBrowserUtils.getScreenSize()
</script>










<template>
  <div
    v-show="isVisible"
    class="item-hierarchy-indicator"
  >
    <div class="item-hierarchy-indicator-upper" />
    <div class="item-hierarchy-indicator-middle" />
    <div
      v-show="displayBottomPart"
      class="item-hierarchy-indicator-bottom"
    />
  </div>
</template>









<style scoped>
.item-hierarchy-indicator {
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
  position: relative;
  width: v-bind(indicatorWidth);
}

.item-hierarchy-indicator-bottom {
  border-color: #143a58;
  /* Same as --primary-color6 but without transparency to avoid color mixing where the different parts of the indicator overlap */
  border-left-style: solid;
  border-width: 1px;
  height: v-bind(bottomHeight);
  margin-left: 50%;
  position: absolute;
  top: v-bind(bottomTop);
  width: 50%;
}

.item-hierarchy-indicator-middle {
  border-color: #143a58;
  /* Same as --primary-color6 but without transparency to avoid color mixing where the different parts of the indicator overlap */
  border-bottom-left-radius: 12px;
  border-bottom-style: solid;
  border-left-style: solid;
  border-width: 1px;
  flex-shrink: 0;
  height: v-bind(_middleHeight);
  margin-left: 50%;
  width: 50%;
}

.item-hierarchy-indicator-upper {
  border-color: #143a58;
  /* Same as --primary-color6 but without transparency to avoid color mixing where the different parts of the indicator overlap */
  border-left-style: solid;
  border-width: 1px;
  flex-shrink: 0;
  height: v-bind(upperHeight);
  margin-left: 50%;
  width: 50%;
}
</style>