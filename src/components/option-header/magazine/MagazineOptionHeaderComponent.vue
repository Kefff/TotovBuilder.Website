<template>
  <ContainerOptionHeader
    v-model="sortingData"
    :sorting-functions-override="sortingFunctions"
  />
  <div class="option-entry">
    <div class="option-value">
      <OptionHeaderSortButton
        v-model="sortingData"
        caption-resource="caption.loadSpeed"
        icon="sync-alt"
        property="loadSpeedPercentageModifier"
        :sorting-functions="sortingFunctions"
      />
    </div>
  </div>
  <div class="option-entry">
    <div class="option-value">
      <OptionHeaderSortButton
        v-model="sortingData"
        caption-resource="caption.checkSpeed"
        icon="eye"
        property="checkSpeedPercentageModifier"
        :sorting-functions="sortingFunctions"
      />
    </div>
  </div>
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

<script lang="ts" src="./MagazineOptionHeaderComponent.ts" />
<style scoped lang="css" src="./MagazineOptionHeaderComponent.css" />