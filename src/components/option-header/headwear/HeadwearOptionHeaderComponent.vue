<template>
  <ArmorOptionHeader
    v-model="sortingData"
    :sorting-functions-override="sortingFunctions"
  />
  <div class="option-entry">
    <div class="option-value">
      <OptionHeaderSortButton
        v-model="sortingData"
        caption-resource="caption.ricochetChance"
        custom-icon="ricochet"
        property="ricochetChance"
        :sorting-functions="sortingFunctions"
      />
    </div>
  </div>
</template>

<script lang="ts" src="./HeadwearOptionHeaderComponent.ts" />
<style scoped lang="css" src="./HeadwearOptionHeaderComponent.css" />