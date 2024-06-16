<template>
  <div>
    <div
      v-for="(itemExclusionFilter, index) of modelItemExclusionFilters"
      :key="itemExclusionFilter.name"
      class="item-filter"
    >
      <Checkbox
        :binary="true"
        :false-value="true"
        :model-value="itemExclusionFilter.enabled"
        :true-value="false"
        @update:model-value="onItemExclusionFilterChanged(index, $event)"
      />
      <div
        :class="`item-filter-name${itemExclusionFilter.enabled ? ' item-filter-disabled-text' : ''}`"
        @click="onItemExclusionFilterChanged(index, !itemExclusionFilter.enabled)"
      >
        {{ $t('caption.itemExclusionFilter_' + itemExclusionFilter.name) }}
      </div>
    </div>
  </div>
</template>










<script setup lang="ts">
import { IItemExclusionFilter } from '../models/utils/IItemExclusionFilter'

const modelItemExclusionFilters = defineModel<IItemExclusionFilter[]>('itemExclusionFilters', { required: true })

/**
 * Updates the filter.
 */
function onItemExclusionFilterChanged(index: number, enabled: boolean) {
  const newItemExclusionFilters = [...modelItemExclusionFilters.value]
  newItemExclusionFilters[index].enabled = enabled

  modelItemExclusionFilters.value = newItemExclusionFilters
}
</script>










<style scoped>
.item-filter {
  align-items: center;
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  height: 3.5rem;
}

.item-filter:last-child {
  margin-bottom: 0;
}

.item-filter-disabled-text {
  color: var(--util-color5);
}

.item-filter-name {
  cursor: pointer;
  margin-left: 1rem;
  margin-right: 1rem;
}
</style>