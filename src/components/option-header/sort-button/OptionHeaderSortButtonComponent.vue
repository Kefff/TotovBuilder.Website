<template>
  <div
    v-tooltip.top="$t('caption.sortBy', { property: StringUtils.toLowerFirst($t(captionResource)) })"
    class="options-header-sort-button"
    @click="sortBy(property)"
  >
    <div :class="'options-header-sort-button-sort-arrow ' + sortingDirectionClass + ' ' + (sortingData.property === property ? 'options-header-sort-button-sort-arrow-visible' : '')">
      <font-awesome-icon icon="angle-down" />
    </div>
    <font-awesome-icon
      v-if="icon != null"
      :icon="icon"
      class="options-header-sort-button-icon"
    />
    <img
      v-else-if="customIcon != null"
      :src="Images[StringUtils.toCamelCase(customIcon)]"
      class="custom-icon"
    >
  </div>
</template>

<script lang="ts" src="./OptionHeaderSortButtonComponent.ts" />
<style scoped lang="css" src="./OptionHeaderSortButtonComponent.css" />