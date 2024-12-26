<script setup lang="ts">
import { computed, inject, Ref } from 'vue'
import { IInventoryItem } from '../models/build/IInventoryItem'

const props = defineProps<{
  inventoryItems: (IInventoryItem | undefined)[],
  index: number
  mode: 'baseItem' | 'content' | 'mods',
}>()

const _bottomTopOffset = '12px'
const _middleHeight = '1.5625rem'

const isEditing = inject<Ref<boolean>>('isEditing')

const bottomHeight = computed(() => `calc(100% - ${upperHeight.value} - ${_middleHeight} + ${_bottomTopOffset})`)
const bottomTop = computed(() => `calc(${upperHeight.value} + ${_middleHeight} - ${_bottomTopOffset})`)
const displayBottomPart = computed(() => {
  const result = props.index !== lastHierarchyInventoryItemIndex.value || props.mode === 'baseItem'

  return result
})
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
const upperHeight = computed(() => `${props.mode === 'content' ? '0.5' : '2.75'}rem`)
</script>










<template>
  <div
    v-if="isVisible"
    class="item-hierarchy-indicator"
  >
    <div class="item-hierarchy-indicator-upper" />
    <div class="item-hierarchy-indicator-middle" />
    <div
      v-if="displayBottomPart"
      class="item-hierarchy-indicator-bottom"
    />
  </div>
</template>









<style scoped>
.item-hierarchy-indicator {
  display: flex;
  flex-direction: column;
  position: relative;
  width: 3.125rem;
}

.item-hierarchy-indicator-bottom {
  border-color: var(--surface-500);
  border-left-style: solid;
  border-width: 1px;
  height: v-bind(bottomHeight);
  margin-left: 50%;
  position: absolute;
  top: v-bind(bottomTop);
  width: 50%;
}

.item-hierarchy-indicator-middle {
  border-color: var(--surface-500);
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
  border-color: var(--surface-500);
  border-left-style: solid;
  border-width: 1px;
  flex-shrink: 0;
  height: v-bind(upperHeight);
  margin-left: 50%;
  width: 50%;
}
</style>