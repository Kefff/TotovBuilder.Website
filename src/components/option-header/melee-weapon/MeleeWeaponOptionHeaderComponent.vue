<template>
  <div class="option-entry">
    <div class="option-value">
      <OptionHeaderSortButton
        v-model:sorting-data="sortingDataInternal"
        caption-resource="caption.chopDamage"
        custom-icon="chop"
        property="chopDamage"
        :sorting-functions="MeleeWeaponSortingFunctions"
      />
    </div>
  </div>
  <div class="option-entry">
    <div class="option-value">
      <OptionHeaderSortButton
        v-model:sorting-data="sortingDataInternal"
        caption-resource="caption.stabDamage"
        custom-icon="stab"
        property="stabDamage"
        :sorting-functions="MeleeWeaponSortingFunctions"
      />
    </div>
  </div>
  <div class="option-entry">
    <div class="option-value">
      <OptionHeaderSortButton
        v-model:sorting-data="sortingDataInternal"
        caption-resource="caption.hitRadius"
        icon="dot-circle"
        property="hitRadius"
        :sorting-functions="MeleeWeaponSortingFunctions"
      />
    </div>
  </div>
</template>

<script lang="ts" src="./MeleeWeaponOptionHeaderComponent.ts" />
<style scoped lang="css" src="./MeleeWeaponOptionHeaderComponent.css" />