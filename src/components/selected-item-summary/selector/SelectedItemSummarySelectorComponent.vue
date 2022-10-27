<template>
  <SelectedItemSummary
    v-if="modelValue != null && item != null"
    v-model="modelValue"
    :can-be-looted="canBeLooted"
    :preset="preset"
  >
    <AmmunitionSummary
      v-if="item.categoryId === 'ammunition'"
      :item="item"
      :show-empty-entries="false"
    />
    <ArmorSummary
      v-else-if="item.categoryId === 'armor'"
      :item="item"
      :show-empty-entries="false"
    />
    <ArmorModSummary
      v-else-if="item.categoryId === 'armorMod'"
      :item="item"
      :show-empty-entries="false"
    />
    <ContainerSummary
      v-else-if="item.categoryId === 'backpack' || item.categoryId === 'securedContainer' || item.categoryId === 'container'"
      :item="item"
    />
    <EyewearSummary
      v-else-if="item.categoryId === 'eyewear'"
      :item="item"
      :show-empty-entries="false"
    />
    <GrenadeSummary
      v-else-if="item.categoryId === 'grenade'"
      :item="item"
      :show-empty-entries="false"
    />
    <HeadwearSummary
      v-else-if="item.categoryId === 'headwear'"
      :item="item"
      :show-empty-entries="false"
    />
    <MagazineSummary
      v-else-if="item.categoryId === 'magazine'"
      :item="item"
      :show-empty-entries="false"
    />
    <MeleeWeaponSummary
      v-else-if="item.categoryId === 'meleeWeapon'"
      :item="item"
    />
    <ModSummary
      v-else-if="item.categoryId === 'mod'"
      :item="item"
      :show-empty-entries="false"
    />
    <RangedWeaponModSummary
      v-else-if="item.categoryId === 'rangedWeaponMod'"
      :item="item"
      :show-empty-entries="false"
    />
    <RangedWeaponSummary
      v-else-if="item.categoryId === 'mainWeapon' || item.categoryId === 'secondaryWeapon'"
      :item="item"
    />
    <VestSummary
      v-else-if="item.categoryId === 'vest'"
      :item="item"
      :show-empty-entries="false"
    />
  </SelectedItemSummary>
</template>

<script lang="ts" src="./SelectedItemSummarySelectorComponent.ts" />
<style scoped lang="css" src="./SelectedItemSummarySelectorComponent.css" />
<style lang="css" src="./SelectedItemSummarySelectorComponent.unscoped.css" />