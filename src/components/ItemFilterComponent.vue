<script setup lang="ts">
import { IGlobalFilter } from '../models/utils/IGlobalFilter'
import StringUtils from '../utils/StringUtils'

const props = defineProps<{
  globalFilter: IGlobalFilter
}>()

const emit = defineEmits<{
  (e: 'update:globalFilter', value: IGlobalFilter): void
}>()

/**
 * Updates the filter.
 */
function onItemExclusionFilterChanged(index: number, enabled: boolean) {
  const newGlobalFilter: IGlobalFilter = {
    itemExclusionFilters: props.globalFilter.itemExclusionFilters,
    merchantFilters: props.globalFilter.merchantFilters
  }
  newGlobalFilter.itemExclusionFilters[index].enabled = enabled

  emit('update:globalFilter', newGlobalFilter)
}
</script>












<template>
  <div>
    <div
      v-for="(itemExclusionFilter, index) of props.globalFilter.itemExclusionFilters"
      :key="itemExclusionFilter.name"
      class="item-filter"
    >
      <Checkbox
        v-tooltip.top="StringUtils.getCheckboxStateTooltip(!itemExclusionFilter.enabled)"
        model-value="itemExclusionFilter.enabled"
        :binary="true"
        :true-value="false"
        :false-value="true"
        @update:model-value="onItemExclusionFilterChanged(index, $event)"
      />
      <div
        :class="'item-filter-name' + (itemExclusionFilter.enabled ? ' item-filter-disabled-text' : '')"
        @click="onItemExclusionFilterChanged(index, !itemExclusionFilter.enabled)"
      >
        {{ $t('caption.itemExclusionFilter_' + itemExclusionFilter.name) }}
      </div>
    </div>
  </div>
</template>











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