<template>
  <div class="option-entry">
    <div class="option-value">
      <OptionHeaderSortButton
        v-model:sorting-data="sortingDataInternal"
        caption-resource="caption.armorClass"
        icon="award"
        property="armorClass"
        :sorting-functions="sortingFunctions"
      />
    </div>
  </div>
  <div class="option-entry">
    <div class="option-value">
      <OptionHeaderSortButton
        v-model:sorting-data="sortingDataInternal"
        caption-resource="caption.durability"
        icon="heart"
        property="durability"
        :sorting-functions="sortingFunctions"
      />
    </div>
  </div>
  <WearableOptionHeader
    v-model:sorting-data="sortingDataInternal"
    :sorting-functions-override="sortingFunctions"
  />
</template>

<script lang="ts" src="./ArmorOptionHeaderComponent.ts" />
<style scoped lang="css" src="./ArmorOptionHeaderComponent.css" />