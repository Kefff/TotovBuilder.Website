<template>
  <div class="item-content-indent">
    <Item
      v-for="(containedItem, index) of inventoryItemsInternal"
      :key="`${path}/${index}_${inventoryItemsInternal.length}`"
      v-model:inventory-item="inventoryItemsInternal[index]"
      :accepted-items="acceptedItems"
      :accepted-items-category-id="categoryId"
      :force-quantity-to-max-selectable-amount="isMagazine"
      :max-stackable-amount="maximumQuantity"
      :path="`${path}/${contentPathPrefix}${index}_${inventoryItemsInternal.length}/${itemPathPrefix}${containedItem.itemId}`"
      @update:model-value="onItemChanged($event, index)"
    />
    <Item
      v-show="editing && canAddItem"
      v-model:inventory-item="itemToAdd"
      :accepted-items="acceptedItems"
      :accepted-items-category-id="categoryId"
      :max-stackable-amount="maximumQuantity"
      :path="`${path}/new`"
      @update:model-value="onItemAdded($event)"
    />
  </div>
</template>

<script lang="ts" src="./ItemContentComponent.ts" />
<style scoped lang="css" src="./ItemContentComponent.css" />