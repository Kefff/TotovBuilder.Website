<template>
  <div class="option-line header">
    <div class="option-entry">
      <div class="option-caption">
        <InputText
          ref="filterInput"
          v-model="updatableFilter"
          class="filter-input"
          :placeholder="$t('caption.search')"
          type="text"
          @input="onFilterChange()"
        />
        <OptionHeaderSortButton
          v-model="updatableSortingData"
          caption-resource="caption.name"
          icon="font"
          property="name"
          :sorting-functions="sortingFunctions"
        />
      </div>
    </div>
    <div class="option-entry">
      <div class="option-value-long">
        <OptionHeaderSortButton
          v-model="updatableSortingData"
          caption-resource="caption.price"
          icon="coins"
          property="price"
          :sorting-functions="sortingFunctions"
        />
      </div>
    </div>
    <slot />
    <div class="option-entry" />
  </div>
</template>

<script lang="ts" src="./ItemOptionHeaderComponent.ts" />
<style scoped lang="css" src="./ItemOptionHeaderComponent.css" />