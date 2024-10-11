<script setup lang="ts">
import { IItem } from '../models/item/IItem'
import ItemIcon from './ItemIconComponent.vue'

withDefaults(
  defineProps<{
    item?: IItem
  }>(),
  {
    item: undefined
  })
</script>










<template>
  <div>
    <div
      v-if="item != null"
      class="selected-item"
    >
      <ItemIcon :item="item" />
      <div class="selected-item-name">
        {{ item.name }}
      </div>
    </div>
    <div
      v-else
      class="selected-item-placeholder"
    >
      <font-awesome-icon
        icon="plus"
        class="selected-item-placeholder-icon"
      />
      <span class="selected-item-placeholder-text">{{ $t('caption.selectItem') }}</span>
    </div>
  </div>
</template>










<style scoped>
.selected-item {
  align-items: center;
  display: flex;
  height: 100%;
}

.selected-item-name {
  margin-left: 0.25rem;
  overflow: hidden;
  text-overflow: ellipsis;
}

.selected-item-placeholder {
  align-items: center;
  display: flex;
  height: 3.25rem;
  margin-left: 1.25rem;
}

.selected-item-placeholder-icon {
  color: var(--success-color);
}

.selected-item-placeholder-text {
  color: var(--util-color7);
  margin-left: 1.5rem;
}
</style>

<style>
.selected-item > .item-icon {
  border-radius: 0;
  border-right-color: var(--util-color5);
  border-right-width: 1px;
  border-right-style: solid;
}
</style>