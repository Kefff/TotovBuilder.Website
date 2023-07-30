<template>
  <div
    v-for="itemExclusionFilter of itemExclusionFilters"
    :key="itemExclusionFilter.name"
    class="item-filter"
  >
    <Checkbox
      v-model="itemExclusionFilter.enabled"
      v-tooltip.top="StringUtils.getCheckboxStateTooltip(!itemExclusionFilter.enabled)"
      :binary="true"
      :true-value="false"
      :false-value="true"
      @change="onFiltersChanged()"
    />
    <div
      :class="'item-filter-name' + (itemExclusionFilter.enabled ? ' item-filter-disabled-text' : '')"
      @click="toggleFilter(itemExclusionFilter)"
    >
      {{ $t('caption.itemExclusionFilter_' + itemExclusionFilter.name) }}
    </div>
  </div>
</template>

<script lang="ts" src="./ItemFilterComponent.ts" />
<style scoped lang="css" src="./ItemFilterComponent.css" />