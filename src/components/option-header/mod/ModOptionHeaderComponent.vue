<template>
  <div class="option-entry">
    <div class="option-value">
      <OptionHeaderSortButton
        v-model="sortingData"
        caption-resource="caption.ergonomics"
        icon="hand-paper"
        property="ergonomicsModifier"
        :sorting-functions="sortingFunctions"
      />
    </div>
  </div>
</template>

<script lang="ts" src="./ModOptionHeaderComponent.ts" />
<style scoped lang="css" src="./ModOptionHeaderComponent.css" />