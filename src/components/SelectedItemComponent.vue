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










<style scoped>
.selected-item {
  align-items: center;
  display: flex;
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
  margin-left: 1rem;
}
</style>

<style>
.selected-item > .item-icon > img {
  /* Hack for hidding item icon borders that are included in the icon */
  transform: translate(-1px, -1px);
  max-height: 3.3rem;
}
</style>