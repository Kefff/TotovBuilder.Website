<template>
  <div class="option-entry">
    <div class="option-value">
      <OptionHeaderSortButton
        v-model="sortingData"
        caption-resource="caption.ergonomics"
        icon="hand-paper"
        property="ergonomicsPercentageModifier"
        :sorting-functions="sortingFunctions"
      />
    </div>
  </div>
  <div class="option-entry">
    <div class="option-value">
      <OptionHeaderSortButton
        v-model="sortingData"
        caption-resource="caption.movementSpeed"
        icon="walking"
        property="movementSpeedPercentageModifier"
        :sorting-functions="sortingFunctions"
      />
    </div>
  </div>
  <div class="option-entry">
    <div class="option-value">
      <OptionHeaderSortButton
        v-model="sortingData"
        caption-resource="caption.turningSpeed"
        icon="undo"
        property="turningSpeedPercentageModifier"
        :sorting-functions="sortingFunctions"
      />
    </div>
  </div>
</template>

<script lang="ts" src="./WearableOptionHeaderComponent.ts" />
<style scoped lang="css" src="./WearableOptionHeaderComponent.css" />