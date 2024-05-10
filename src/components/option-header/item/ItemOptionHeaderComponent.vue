<template>
  <div class="option-line header">
    <div class="option-entry">
      <div class="option-caption">
        <InputText
          ref="filterInput"
          v-model="filterInternal"
          class="filter-input"
          :placeholder="$t('caption.search')"
          type="text"
          @input="onFilterChange()"
        />
        <OptionHeaderSortButton
          v-model:sorting-data="sortingDataInternal"
          caption-resource="caption.name"
          icon="font"
          property="name"
          :sorting-functions="ItemSortingFunctions"
        />
      </div>
    </div>
    <div class="option-entry">
      <div class="option-value-long">
        <OptionHeaderSortButton
          v-model:sorting-data="sortingDataInternal"
          caption-resource="caption.price"
          icon="coins"
          property="price"
          :sorting-functions="ItemSortingFunctions"
        />
      </div>
    </div>
    <slot />
    <div
      v-if="useLongestHeaderWidth"
      class="item-option-longest-header-width-placeholder"
    />
    <div class="item-option-icon-placeholder" />
  </div>
</template>

<script lang="ts" src="./ItemOptionHeaderComponent.ts" />
<style scoped lang="css" src="./ItemOptionHeaderComponent.css" />