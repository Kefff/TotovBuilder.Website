<template>
  <div class="option-entry">
    <div class="option-value">
      <OptionHeaderSortButton
        v-model:sorting-data="sortingDataInternal"
        caption-resource="caption.ergonomics"
        icon="hand-paper"
        property="ergonomicsModifier"
        :sorting-functions="ModSortingFunctions"
      />
    </div>
  </div>
</template>

<script lang="ts" src="./ModOptionHeaderComponent.ts" />
<style scoped lang="css" src="./ModOptionHeaderComponent.css" />