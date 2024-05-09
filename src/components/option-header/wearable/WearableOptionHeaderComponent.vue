<template>
  <div class="option-entry">
    <div class="option-value">
      <OptionHeaderSortButton
        v-model:sorting-data="sortingDataInternal"
        caption-resource="caption.ergonomics"
        icon="hand-paper"
        property="ergonomicsModifierPercentage"
        :sorting-functions="sortingFunctions"
      />
    </div>
  </div>
  <div class="option-entry">
    <div class="option-value">
      <OptionHeaderSortButton
        v-model:sorting-data="sortingDataInternal"
        caption-resource="caption.movementSpeed"
        icon="walking"
        property="movementSpeedModifierPercentage"
        :sorting-functions="sortingFunctions"
      />
    </div>
  </div>
  <div class="option-entry">
    <div class="option-value">
      <OptionHeaderSortButton
        v-model:sorting-data="sortingDataInternal"
        caption-resource="caption.turningSpeed"
        icon="undo"
        property="turningSpeedModifierPercentage"
        :sorting-functions="sortingFunctions"
      />
    </div>
  </div>
</template>

<script lang="ts" src="./WearableOptionHeaderComponent.ts" />
<style scoped lang="css" src="./WearableOptionHeaderComponent.css" />