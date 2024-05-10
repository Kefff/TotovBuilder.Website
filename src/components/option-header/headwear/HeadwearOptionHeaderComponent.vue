<template>
  <ArmorOptionHeader
    v-model:sorting-data="sortingDataInternal"
    :sorting-functions-override="sortingDataInternal"
  />
  <div class="option-entry">
    <div class="option-value">
      <OptionHeaderSortButton
        v-model:sorting-data="sortingDataInternal"
        caption-resource="caption.ricochetChance"
        custom-icon="ricochet"
        property="ricochetChance"
        :sorting-functions="sortingDataInternal"
      />
    </div>
  </div>
</template>

<script lang="ts" src="./HeadwearOptionHeaderComponent.ts" />
<style scoped lang="css" src="./HeadwearOptionHeaderComponent.css" />