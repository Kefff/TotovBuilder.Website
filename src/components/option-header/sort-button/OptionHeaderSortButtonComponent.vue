<template>
  <div
    v-tooltip.top="$t('caption.sortBy', { property: StringUtils.toLowerFirst($t(captionResource)) })"
    class="sort-button"
    @click="sortBy(property)"
  >
    <div :class="'sort-arrow ' + sortingDirectionClass + ' ' + (modelValue.property === property ? 'sort-arrow-visible' : '')">
      <font-awesome-icon icon="angle-down" />
    </div>
    <font-awesome-icon
      v-if="icon != null"
      :icon="icon"
    />
    <img
      v-else-if="customIcon != null"
      :src="'/assets/' + customIcon + '.webp'"
      class="custom-icon"
    >
  </div>
</template>

<script lang="ts" src="./OptionHeaderSortButtonComponent.ts" />
<style scoped lang="css" src="./OptionHeaderSortButtonComponent.css" />