<template>
  <ContainerOptionHeader
    v-model:sorting-data="sortingDataInternal"
    :sorting-functions-override="MagazineSortingFunctions"
  />
  <div class="option-entry">
    <div class="option-value">
      <OptionHeaderSortButton
        v-model:sorting-data="sortingDataInternal"
        caption-resource="caption.loadSpeed"
        icon="sync-alt"
        property="loadSpeedModifierPercentage"
        :sorting-functions="MagazineSortingFunctions"
      />
    </div>
  </div>
  <div class="option-entry">
    <div class="option-value">
      <OptionHeaderSortButton
        v-model:sorting-data="sortingDataInternal"
        caption-resource="caption.checkSpeed"
        icon="eye"
        property="checkSpeedModifierPercentage"
        :sorting-functions="MagazineSortingFunctions"
      />
    </div>
  </div>
  <div class="option-entry">
    <div class="option-value">
      <OptionHeaderSortButton
        v-model:sorting-data="sortingDataInternal"
        caption-resource="caption.ergonomics"
        icon="hand-paper"
        property="ergonomicsModifier"
        :sorting-functions="MagazineSortingFunctions"
      />
    </div>
  </div>
</template>

<script lang="ts" src="./MagazineOptionHeaderComponent.ts" />
<style scoped lang="css" src="./MagazineOptionHeaderComponent.css" />