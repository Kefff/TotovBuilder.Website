<template>
  <div class="indent">
    <Item
      v-for="(containedItem, index) of content"
      :key="path + '/' + index + '_' + content.length"
      v-model="content[index]"
      :accepted-items="acceptedItems"
      :accepted-items-category-id="categoryId"
      :force-quantity-to-max-selectable-amount="isMagazine"
      :max-stackable-amount="maximumQuantity"
      :path="path + '/' + contentPathPrefix + index + '_' + content.length + '/' + itemPathPrefix + containedItem.itemId"
      @update:model-value="onItemChanged($event, index)"
    />
    <Item
      v-show="editing && canAddItem"
      v-model="itemToAdd"
      :accepted-items="acceptedItems"
      :accepted-items-category-id="categoryId"
      :max-stackable-amount="maximumQuantity"
      :path="path + '/new'"
      @update:model-value="onItemAdded($event)"
    />
  </div>
</template>

<script lang="ts" src="./ItemContentComponent.ts" />
<style scoped lang="css" src="./ItemContentComponent.css" />