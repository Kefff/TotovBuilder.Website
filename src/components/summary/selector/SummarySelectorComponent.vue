<template>
  <ItemSummary
    v-if="item !== undefined"
    :item="item"
  >
    <AmmunitionSummary
      v-if="item.categoryId === 'ammunition'"
      :item="item"
    />
    <ArmorSummary
      v-else-if="item.categoryId === 'armor'"
      :item="item"
    />
    <ArmorModSummary
      v-else-if="item.categoryId === 'armorMod'"
      :item="item"
    />
    <ContainerSummary
      v-else-if="item.categoryId === 'backpack' || item.categoryId === 'securedContainer' || item.categoryId === 'container'"
      :item="item"
    />
    <EyewearSummary
      v-else-if="item.categoryId === 'eyewear'"
      :item="item"
    />
    <GrenadeSummary
      v-else-if="item.categoryId === 'grenade'"
      :item="item"
    />
    <HeadwearSummary
      v-else-if="item.categoryId === 'headwear'"
      :item="item"
    />
    <MagazineSummary
      v-else-if="item.categoryId === 'magazine'"
      :item="item"
    />
    <MeleeWeaponSummary
      v-else-if="item.categoryId === 'meleeWeapon'"
      :item="item"
    />
    <ModSummary
      v-else-if="item.categoryId === 'mod'"
      :item="item"
    />
    <RangedWeaponModSummary
      v-else-if="item.categoryId === 'rangedWeaponMod'"
      :item="item"
    />
    <RangedWeaponSummary
      v-else-if="item.categoryId === 'mainWeapon' || item.categoryId === 'secondaryWeapon'"
      :item="item"
    />
    <VestSummary
      v-else-if="item.categoryId === 'vest'"
      :item="item"
    />
  </ItemSummary>
</template>

<script lang="ts" src="./SummarySelectorComponent.ts" />
<style scoped lang="css" src="./SummarySelectorComponent.css" />