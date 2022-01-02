<template>
  <ItemOptionHeader
    v-model:sortingData="updatableSortingData"
    v-model:filter="updatableFilter"
  >
    <AmmunitionOptionHeader
      v-if="categoryId === 'ammunition'"
      v-model="updatableSortingData"
    />
    <ArmorModOptionHeader
      v-else-if="categoryId === 'armorMod'"
      v-model="updatableSortingData"
    />
    <ArmorOptionHeader
      v-else-if="categoryId === 'armor'"
      v-model="updatableSortingData"
    />
    <ContainerOptionHeader
      v-else-if="categoryId === 'backpack' || categoryId === 'securedContainer' || categoryId === 'container'"
      v-model="updatableSortingData"
    />
    <EyewearOptionHeader
      v-else-if="categoryId === 'eyewear'"
      v-model="updatableSortingData"
    />
    <GrenadeOptionHeader
      v-else-if="categoryId === 'grenade'"
      v-model="updatableSortingData"
    />
    <HeadwearOptionHeader
      v-else-if="categoryId === 'headwear'"
      v-model="updatableSortingData"
    />
    <MagazineOptionHeader
      v-else-if="categoryId === 'magazine'"
      v-model="updatableSortingData"
    />
    <MeleeWeaponOptionHeader
      v-else-if="categoryId === 'meleeWeapon'"
      v-model="updatableSortingData"
    />
    <ModOptionHeader
      v-else-if="categoryId === 'mod'"
      v-model="updatableSortingData"
    />
    <RangedWeaponModOptionHeader
      v-else-if="categoryId === 'rangedWeaponMod'"
      v-model="updatableSortingData"
    />
    <RangedWeaponOptionHeader
      v-else-if="categoryId === 'mainWeapon' || categoryId === 'secondaryWeapon'"
      v-model="updatableSortingData"
    />
    <VestOptionHeader
      v-else-if="categoryId === 'vest'"
      v-model="updatableSortingData"
    />
  </ItemOptionHeader>
</template>

<script lang="ts" src="./OptionHeaderSelectorComponent.ts" />
<style scoped lang="css" src="./OptionHeaderSelectorComponent.css" />