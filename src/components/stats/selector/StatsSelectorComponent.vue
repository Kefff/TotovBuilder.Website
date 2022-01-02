<template>
  <div
    v-if="item !== undefined"
    class="stats"
  >
    <ItemStat :item="item">
      <AmmunitionStat
        v-if="item.categoryId === 'ammunition'"
        :item="item"
      />
      <ArmorStat
        v-else-if="item.categoryId === 'armor'"
        :item="item"
      />
      <ArmorModStat
        v-else-if="item.categoryId === 'armorMod'"
        :item="item"
      />
      <ContainerStat
        v-else-if="item.categoryId === 'backpack' || item.categoryId === 'securedContainer' || item.categoryId === 'container'"
        :item="item"
      />
      <EyewearStat
        v-else-if="item.categoryId === 'eyewear'"
        :item="item"
      />
      <GrenadeStat
        v-else-if="item.categoryId === 'grenade'"
        :item="item"
      />
      <HeadwearStat
        v-else-if="item.categoryId === 'headwear'"
        :item="item"
      />
      <MagazineStat
        v-else-if="item.categoryId === 'magazine'"
        :item="item"
      />
      <MeleeWeaponStat
        v-else-if="item.categoryId === 'meleeWeapon'"
        :item="item"
      />
      <ModStat
        v-else-if="item.categoryId === 'mod'"
        :item="item"
      />
      <RangedWeaponModStat
        v-else-if="item.categoryId === 'rangedWeaponMod'"
        :item="item"
      />
      <RangedWeaponStat
        v-else-if="item.categoryId === 'mainWeapon' || item.categoryId === 'secondaryWeapon'"
        :item="item"
      />
      <VestStat
        v-else-if="item.categoryId === 'vest'"
        :item="item"
      />
    </ItemStat>
  </div>
</template>

<script lang="ts" src="./StatsSelectorComponent.ts" />
<style scoped lang="css" src="./StatsSelectorComponent.css" />